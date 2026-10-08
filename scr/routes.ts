import { Router } from "express";

import alunoController from "./controllers/alunos";
import cursoController from "./controllers/cursos";
import matriculasController from "./controllers/matriculas";
import funcionariosControler from "./controllers/funcionarios";

const router = Router();


// ==================== ALUNOS ====================

router.get("/alunos", alunoController.list);

router.get("/alunos/:id", alunoController.getById);

router.post("/alunos", alunoController.create);

router.put("/alunos/:id", alunoController.update);

router.delete("/alunos/:id", alunoController.delete);


// ==================== CURSOS ====================

router.get("/cursos", cursoController.list);

router.get("/cursos/:id", cursoController.getById);

router.post("/cursos", cursoController.create);

router.put("/cursos/:id", cursoController.update);

router.delete("/cursos/:id", cursoController.delete);


// ==================== MATRICULAS ====================

router.post("/matriculas/:id", matriculasController.create);
router.delete("/matriculas/:id", matriculasController.delete);


// ==================== FUNCIONARIOS ====================

router.post("/login", funcionariosControler.login);
router.post("/funcionarios", funcionariosControler.create);


export default router;