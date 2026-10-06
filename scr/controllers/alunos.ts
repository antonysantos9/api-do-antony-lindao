import { Response, Request } from "express";
import { prisma } from "../../config/prisma";
import { handleErrors } from "../helpers/hendleErrors";
import { create } from "node:domain";

export default {
    list: async (request: Request, response: Response) => {
        try {
            const alunos = await prisma.aluno.findMany({
                include: {
                    cursos: true,
                }
            });

            return response.status(200).json(alunos);
        } catch (e) {
            return handleErrors(e, response);
        }
    },

    getById: async (request: Request, response: Response) => {
        try {
            const { id } = request.params;

            const aluno = await prisma.aluno.findUnique({
                where: {
                    id: Number(id),
                },
                include: {
                    cursos: true,
                }
            });

            if (!aluno) {
                return response.status(404).json({
                    message: "Aluno não encontrado"
                });
            }

            return response.status(200).json(aluno);

        } catch (e) {
            return handleErrors(e, response);
        }
    },

    create: async (request: Request, response: Response) => {
        try {
            const { matricula, cpf, nome, email, nascimento, telefone, endereco, sexo } = request.body;

            if( !matricula || !cpf || !nome || !email) {
                 return response.status(400).json("Campos obrigatorios vazios");
            }

            const aluno = await prisma.aluno.create({
                data: {
                    matricula,
                    cpf,
                    nome,
                    email,
                    nascimento: new Date(nascimento),
                    telefone,
                    endereco,
                    Sexo: sexo,
                },
            });

            return response.status(200).json(aluno);

        }catch (e) {
        return handleErrors(e, response);
        }
    },

    update: async (request: Request, response: Response) => {
    try {
        const { id } = request.params;

        const {
            matricula,
            cpf,
            nome,
            email,
            nascimento,
            telefone,
            endereco,
            sexo
        } = request.body;

        const aluno = await prisma.aluno.update({
            where: {
                id: +id,
            },
            data: {
                matricula,
                cpf,
                nome,
                email,
                nascimento: nascimento ? new Date(nascimento): undefined,
                telefone,
                endereco,
                sexo
            },
        });

        return response.status(200).json(aluno);

    } catch (e) {
        return handleErrors(e, response);
    }
},

delete: async (request: Request, response: Response) => {
    try {
      const { id } = request.params;

      const aluno = await prisma.aluno.delete({
        where: {
          id: +id,
        },
      });

      return response.status(200).json(aluno);
    } catch (e) {
      return handleErrors(e, response);
    }
  },
};