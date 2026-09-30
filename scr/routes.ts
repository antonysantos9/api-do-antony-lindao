import { response, Router } from "express";

// Inicia o router
const routes = Router();

// Rota inicial para verificar se o servidor esta rodando
routes.get("/", (requeste, response) => {
    return response.status(200).json({ menssage: "Hello World"});
});

routes.get("/number", (request, response) => {
    const randomNumber = Math.floor(Math.random() * 100);
    return response.status(200).json( randomNumber );
});

routes.get("/fibonacci/:quantidade", (request, response) => {
    const quantidade = Number(request.params.quantidade);

    let a = 0;
    let b = 1;
    let fibonacci = [];

    for (let i = 0; i < quantidade; i++) {
        fibonacci.push(a);

        let proximo = a + b;
        a = b;
        b = proximo;
    }

    return response.status(200).json(fibonacci);
});

routes.get("/fatorial/:numero", (request, response) => {
    const numero = Number(request.params.numero);

    let resultado = 1;

    for (let i = 1; i <= numero; i++) {
        resultado = resultado * i;
    }

    return response.status(200).json(resultado);
});

export default routes;
