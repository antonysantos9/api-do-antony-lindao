import express from "express";
import cors from "cors";

// Inicializa o express
const app = express();

// Definir regras so servidor
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


export default app;