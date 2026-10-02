import { Response, Request} from "express";
import { prisma } from "../../config/prisma";
import { hendleErrors } from "../helpers/HendleErrors";
 
export default {
    list: async (request: Request, response: Response) => {
        try {
            const alunos = await prisma.aluno.findMany({
                include:{
                    cursos: true,
                }
            })

        return response.status(200).json(alunos);
        } catch (e) {
            return hendleErrors(e, response);
        } 
    }
}