import { Response, Request } from "express";

import { prisma } from "../../config/prisma";

import { handleErrors } from "../helpers/hendleErrors";

export default {

    // LISTAR TODOS OS CURSOS
    list: async (request: Request, response: Response) => {
        try {

            const cursos = await prisma.curso.findMany({
                include: {
                    alunos: true,
                }
            });

            return response.status(200).json(cursos);

        } catch (e) {
            return handleErrors(e, response);
        }
    },


    // BUSCAR CURSO PELO ID
    getById: async (request: Request, response: Response) => {
        try {

            const { id } = request.params;

            const curso = await prisma.curso.findUnique({
                where: {
                    id: Number(id),
                },
                include: {
                    alunos: true,
                }
            });

            if (!curso) {
                return response.status(404).json({
                    message: "Curso não encontrado"
                });
            }

            return response.status(200).json(curso);

        } catch (e) {
            return handleErrors(e, response);
        }
    },


    // CADASTRAR CURSO
    create: async (request: Request, response: Response) => {
        try {

            const {
                nome,
                descricao,
                cargaHoraria
            } = request.body;

            if (!nome || !descricao || !cargaHoraria) {
                return response.status(400).json({
                    message: "Campos obrigatórios vazios"
                });
            }

            const curso = await prisma.curso.create({
                data: {
                    nome,
                    descricao,
                    cargaHoraria,
                },
            });

            return response.status(201).json(curso);

        } catch (e) {
            return handleErrors(e, response);
        }
    },


    // EDITAR CURSO
    update: async (request: Request, response: Response) => {
        try {

            const { id } = request.params;

            const {
                nome,
                descricao,
                cargaHoraria
            } = request.body;

            const curso = await prisma.curso.update({
                where: {
                    id: +id,
                },

                data: {
                    nome,
                    descricao,
                    cargaHoraria,
                },
            });

            return response.status(200).json(curso);

        } catch (e) {
            return handleErrors(e, response);
        }
    },


    // EXCLUIR CURSO
    delete: async (request: Request, response: Response) => {
        try {

            const { id } = request.params;

            const curso = await prisma.curso.delete({
                where: {
                    id: +id,
                },
            });

            return response.status(200).json(curso);

        } catch (e) {
            return handleErrors(e, response);
        }
    },

};