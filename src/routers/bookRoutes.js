import { Router } from "express";
const routes = Router();

// Controller
import * as bookController from "../controllers/bookController.js";
// Middlewares
import authRequired from "../middlewares/authRequired.js";
import controllerAccess from "../middlewares/controllerAccess.js";

// Criar um livro (Funcionario)
routes.post("/create", authRequired, controllerAccess(), bookController.createBook);

// Mostrar todos os livros (Todos os usuarios)
routes.get("/all", bookController.getAllBooks);

// Mostrar um livro específico (Todos os usuários)
routes.get("/:id", bookController.getBookById);

// Atualizar os dados de um livro (Funcionario)
routes.put("/update/:id", authRequired, controllerAccess(), bookController.updateBook);

// Deletar um livro (Funcionario)
routes.delete("/delete/:id", authRequired, controllerAccess(), bookController.deleteBook);

export default routes;

/*
Formas de usar o endpoint /all

GET /book/all?page=1&limit=30
GET /book/all?author=2&category=2&publisher=3&page=2&limit=5
*/
