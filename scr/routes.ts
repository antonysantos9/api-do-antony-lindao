import { Router } from "express";
import alunoController from "./controllers/aluno";

// Inicia o router
const routes = Router();

// Rota inicial para verificar se o servidor esta rodando
routes.get("/", (request, response) => {
    return response.status(200).json({ menssage: "Hello World"});
});

// Rotas de alunos
routes.get("/alunos", alunoController.list);

routes.get("/alunos/:id", alunoController.getById);

routes.post("/alunos", alunoController.create);

routes.put("/alunos/:id", alunoController.update);


export default routes;
