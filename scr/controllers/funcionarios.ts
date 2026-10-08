import { Response, Request } from "express";
import { prisma } from "../../config/prisma";
import { handleErrors } from "../helpers/hendleErrors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default {

    create: async (request: Request, response: Response) => {
        try {

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
                return response
                    .status(400)
                    .json("Campos obrigatorios vazios");
            }

            const senhaCriptografada = bcrypt.hashSync(senha, 10);

            const funcionario = await prisma.funcionario.create({
                data: {
                    cpf,
                    nome,
                    email,
                    cargo,
                    nascimento: new Date(nascimento),
                    senha: senhaCriptografada,
                    telefone,
                    endereco,
                    Sexo: sexo,
                },
            });

            return response
                .status(200)
                .json(funcionario);

        } catch (e) {
            return handleErrors(e, response);
        }
    },

    list: async (request: Request, response: Response) => {
        try {

            const funcionarios = await prisma.funcionario.findMany();

            return response
                .status(200)
                .json(funcionarios);

        } catch (e) {
            return handleErrors(e, response);
        }
    },

    login: async (request: Request, response: Response) => {
        try {

            const { email, senha } = request.body;

            if (!email || !senha) {
                return response
                    .status(400)
                    .json("Dados incompletos");
            }

            const funcionario = await prisma.funcionario.findUnique({
                where: {
                    email,
                },
            });

            if (
                !funcionario ||
                !bcrypt.compareSync(senha, funcionario.senha)
            ) {
                return response
                    .status(404)
                    .json("Email ou senha invalidos");
            }

            const token = jwt.sign(
                {
                    id: funcionario.id,
                    cargo: funcionario.cargo
                },
                process.env.jwt_SECRET!,
                {
                    expiresIn: "1d",
                }
            );

            return response
                .status(200)
                .json(token);

        } catch (e) {
            return handleErrors(e, response);
        }
    }

};