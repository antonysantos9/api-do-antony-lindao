
import { Request, Response } from "express";
import { prisma } from "../../config/prisma";
import { handleErrors } from "../helpers/hendleErrors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface AuthPayload {
    id: number;
    cargo: string;
}

// Verifica o token do usuário
const getUsuario = (request: Request): AuthPayload | null => {
    const authorization = request.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
        return null;
    }

    const token = authorization.slice(7);

    try {
        const usuario = jwt.verify(
            token,
            process.env.jwt_SECRET!
        ) as AuthPayload;

        if (
            !Number.isInteger(usuario.id) ||
            typeof usuario.cargo !== "string"
        ) {
            return null;
        }

        return usuario;
    } catch {
        return null;
    }
};

// Verifica se o usuário é administrador
const isAdmin = (cargo: string): boolean => {
    const cargoNormalizado = cargo
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

    return [
        "admin",
        "administrador",
        "administradora"
    ].includes(cargoNormalizado);
};

export default {

    // CREATE - Apenas administrador
    create: async (request: Request, response: Response) => {
        try {
            const usuario = getUsuario(request);

            if (!usuario) {
                return response.status(401).json("Token inválido ou não informado");
            }

            if (!isAdmin(usuario.cargo)) {
                return response.status(403).json("Acesso negado");
            }

            const {
                cpf,
                nome,
                email,
                cargo,
                nascimento,
                senha,
                telefone,
                endereco,
                sexo
            } = request.body;

            if (!cpf || !nome || !email || !cargo || !nascimento || !senha) {
                return response.status(400).json("Campos obrigatórios vazios");
            }

            const senhaCriptografada = bcrypt.hashSync(senha, 10);

            const funcionario = await prisma.funcionario.create({
                data: {
                    cpf,
                    nome,
                    email,
                    cargo,
                    nascimento: nascimento ? new Date(nascimento): undefined,
                    senha: senhaCriptografada,
                    telefone,
                    endereco,
                    Sexo: sexo
                },
                select: {
                    id: true,
                    cpf: true,
                    nome: true,
                    email: true,
                    cargo: true,
                    nascimento: true,
                    telefone: true,
                    endereco: true,
                    Sexo: true
                }
            });

            return response.status(201).json(funcionario);

        } catch (e) {
            return handleErrors(e, response);
        }
    },

    // LIST - Apenas administrador
    list: async (request: Request, response: Response) => {
        try {
            const usuario = getUsuario(request);

            if (!usuario) {
                return response.status(401).json("Token inválido ou não informado");
            }

            if (!isAdmin(usuario.cargo)) {
                return response.status(403).json("Acesso negado");
            }

            const funcionarios = await prisma.funcionario.findMany({
                select: {
                    id: true,
                    cpf: true,
                    nome: true,
                    email: true,
                    cargo: true,
                    nascimento: true,
                    telefone: true,
                    endereco: true,
                    Sexo: true
                }
            });

            return response.status(200).json(funcionarios);

        } catch (e) {
            return handleErrors(e, response);
        }
    },

    // GET BY ID - Administrador ou o próprio funcionário
    getById: async (request: Request, response: Response) => {
        try {
            const usuario = getUsuario(request);

            if (!usuario) {
                return response.status(401).json("Token inválido ou não informado");
            }

            const id = Number(request.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return response.status(400).json("ID inválido");
            }

            if (!isAdmin(usuario.cargo) && usuario.id !== id) {
                return response.status(403).json("Acesso negado");
            }

            const funcionario = await prisma.funcionario.findUnique({
                where: { id },
                select: {
                    id: true,
                    cpf: true,
                    nome: true,
                    email: true,
                    cargo: true,
                    nascimento: true,
                    telefone: true,
                    endereco: true,
                    Sexo: true
                }
            });

            if (!funcionario) {
                return response.status(404).json("Funcionário não encontrado");
            }

            return response.status(200).json(funcionario);

        } catch (e) {
            return handleErrors(e, response);
        }
    },

    // UPDATE - Administrador ou o próprio funcionário
    update: async (request: Request, response: Response) => {
        try {
            const usuario = getUsuario(request);

            if (!usuario) {
                return response.status(401).json("Token inválido ou não informado");
            }

            const id = Number(request.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return response.status(400).json("ID inválido");
            }

            const admin = isAdmin(usuario.cargo);

            if (!admin && usuario.id !== id) {
                return response.status(403).json("Acesso negado");
            }

            const funcionarioExistente = await prisma.funcionario.findUnique({
                where: { id }
            });

            if (!funcionarioExistente) {
                return response.status(404).json("Funcionário não encontrado");
            }

            const {
                cpf,
                nome,
                email,
                cargo,
                nascimento,
                senha,
                telefone,
                endereco,
                sexo
            } = request.body;

            const data: {
                cpf?: string;
                nome?: string;
                email?: string;
                cargo?: string;
                nascimento?: Date;
                senha?: string;
                telefone?: number;
                endereco?: string;
                Sexo?: string;
            } = {};

            if (cpf !== undefined) data.cpf = cpf;
            if (nome !== undefined) data.nome = nome;
            if (email !== undefined) data.email = email;
            if (telefone !== undefined) data.telefone = telefone;
            if (endereco !== undefined) data.endereco = endereco;
            if (sexo !== undefined) data.Sexo = sexo;
            data.nascimento = nascimento ? new Date(nascimento): undefined

           

            if (senha !== undefined && senha !== "") {
                data.senha = bcrypt.hashSync(senha, 10);
            }

            // Somente administrador pode alterar o cargo
            if (admin && cargo !== undefined) {
                data.cargo = cargo;
            }

            const funcionario = await prisma.funcionario.update({
                where: { id },
                data,
                select: {
                    id: true,
                    cpf: true,
                    nome: true,
                    email: true,
                    cargo: true,
                    nascimento: true,
                    telefone: true,
                    endereco: true,
                    Sexo: true
                }
            });

            return response.status(200).json(funcionario);

        } catch (e) {
            return handleErrors(e, response);
        }
    },

    // DELETE - Apenas administrador
    delete: async (request: Request, response: Response) => {
        try {
            const usuario = getUsuario(request);

            if (!usuario) {
                return response.status(401).json("Token inválido ou não informado");
            }

            if (!isAdmin(usuario.cargo)) {
                return response.status(403).json("Acesso negado");
            }

            const id = Number(request.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return response.status(400).json("ID inválido");
            }

            const funcionario = await prisma.funcionario.findUnique({
                where: { id }
            });

            if (!funcionario) {
                return response.status(404).json("Funcionário não encontrado");
            }

            await prisma.funcionario.delete({
                where: { id }
            });

            return response.status(200).json("Funcionário excluído com sucesso");

        } catch (e) {
            return handleErrors(e, response);
        }
    },

    // LOGIN - Autenticação do funcionário
    login: async (request: Request, response: Response) => {
        try {
            const { email, senha } = request.body;

            if (!email || !senha) {
                return response.status(400).json("Dados incompletos");
            }

            const funcionario = await prisma.funcionario.findUnique({
                where: { email }
            });

            if (
                !funcionario ||
                !bcrypt.compareSync(senha, funcionario.senha)
            ) {
                return response.status(401).json("Email ou senha inválidos");
            }

            if (!process.env.jwt_SECRET) {
                return response.status(500).json("Chave de autenticação não configurada");
            }

            const token = jwt.sign(
                {
                    id: funcionario.id,
                    cargo: funcionario.cargo
                },
                process.env.jwt_SECRET,
                {
                    expiresIn: "1d"
                }
            );

            return response.status(200).json(token);

        } catch (e) {
            return handleErrors(e, response);
        }
    }

};
