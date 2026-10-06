import { Request, Response } from "express";
import { prisma } from "../../config/prisma";
import { handleErrors } from "../helpers/hendleErrors";

export default{
creat: async (request: Request, response: Response) => {
 try{
    const { id } = request.params;
    const { cursosIds } = request.body

    if (!cursosIds || !Array.isArray(cursosIds)) {
        return response.status(400).json("Cursos invalidos")
    }

    const aluno = await prisma.aluno.update({
        where: {
            id: +id,
        },
        data: {
            cursos: {
                connect: cursosIds.map((cursosId: number) => ({ id: cursosId }))
            },
        },
        include:{
            cursos: true,
        },
    });

    return response.status(201).json(aluno);
 }catch (e) {
    return handleErrors(e, response);
 }
},
};