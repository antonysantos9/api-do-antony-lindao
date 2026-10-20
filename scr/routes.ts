import { Router } from "express";
import alunoController from "./controllers/alunos";
import cursoController from "./controllers/cursos";
import matriculaController from "./controllers/matriculas";
import funcionarioController from "./controllers/funcionarios";
import { authentication } from "./middlewares/authentication";
import { isAdmin, isAdminOrHimself } from "./middlewares/permiçoes";

// Inicializa o router
const routes = Router();

// Rota inicial para verificar se o servidor está rodando
routes.get("/", (request, response) => {
  return response.status(200).json({ message: "Hello World!" });
});

// Rotas de alunos
routes.get("/alunos", authentication, alunoController.list);
routes.get("/alunos/:id", authentication, alunoController.getById);
routes.post("/alunos", authentication, alunoController.create);
routes.put("/alunos/:id", authentication, alunoController.update);
routes.delete("/alunos/:id", authentication, alunoController.delete);

// Rotas de cursos
routes.get("/cursos", authentication, cursoController.list);
routes.get("/cursos/:id", authentication, cursoController.getById);
routes.post("/cursos", authentication, cursoController.create);
routes.put("/cursos/:id", authentication, cursoController.update);
routes.delete("/cursos/:id", authentication, cursoController.delete);

// Rotas de matrículas
routes.post("/matriculas/:id", authentication, matriculaController.create);
routes.delete("/matriculas/:id", authentication, matriculaController.delete);

// Rotas de funcionários
routes.post("/login", funcionarioController.login);
routes.get(
  "/funcionarios",
  authentication,
  isAdmin,
  funcionarioController.list,
);
routes.get(
  "/funcionarios/:id",
  authentication,
  isAdminOrHimself,
  funcionarioController.getById,
);
routes.post(
  "/funcionarios",
  authentication,
  isAdmin,
  funcionarioController.create,
);
routes.put(
  "/funcionarios/:id",
  authentication,
  isAdminOrHimself,
  funcionarioController.update,
);
routes.delete(
  "/funcionarios/:id",
  authentication,
  isAdmin,
  funcionarioController.delete,
);

export default routes;
