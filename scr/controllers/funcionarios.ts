import { Response, Request } from "express";

import { prisma } from "../../config/prisma";

import { handleErrors } from "../helpers/hendleErrors";

import bcrypt from "bcrypt";

export default {
    login: async(request: Request, response: Response) => {
        try {
            const { email, senha } = request.body;

            if ( !email || !senha) {
                return response.status(400).json("Dados incompletos")
            }

            const funcionario = await prisma.funcionario.findUnique({
                where: {
                    email,
                },
            });

            if(!funcionario) {
                return response.status(404).json("Email ou senha invalidos")
            }
        }catch (e) {
            return handleErrors(e, response)
        }
    }
}