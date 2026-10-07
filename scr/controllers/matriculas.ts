import { Request, Response } from "express";

import { prisma } from "../../config/prisma";

import { handleErrors } from "../helpers/hendleErrors";

export default {
  create: async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      const { cursosIds } = request.body;

      if (!cursosIds || !Array.isArray(cursosIds)) {
        return response.status(400).json("Cursos inválidos");
      }

      const aluno = await prisma.aluno.update({
        where: {
          id: +id,
        },

        data: {
          cursos: {
            connect: cursosIds.map((cursoId: number) => ({
              id: cursoId,
            })),
          },
        },

        include: {
          cursos: true,
        },
      });

      return response.status(201).json(aluno);
    } catch (e) {
      return handleErrors(e, response);
    }
  },

  delete: async (request: Request, response: Response) => {
    try {
      const { id } = request.params;
      const { cursosIds } = request.body;

      if (!cursosIds || !Array.isArray(cursosIds)) {
        return response.status(400).json("Cursos inválidos");
      }

      const aluno = await prisma.aluno.update({
        where: {
          id: +id,
        },

        data: {
          cursos: {
            disconnect: cursosIds.map((cursoId: number) => ({
              id: cursoId,
            })),
          },
        },

        include: {
          cursos: true,
        },
      });

      return response.status(200).json(aluno);
    } catch (e) {
      return handleErrors(e, response);
    }
  },
};