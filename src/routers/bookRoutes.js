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
// Mostar um livro especifico (Todos os usuarios)
routes.get("/show/:id", bookController.getShowBook);
// Atualizar os dados de um livro (Funcionario)
routes.put("/update/:id", authRequired, controllerAccess(), bookController.updateBook);
// Deletar um livro (Funcionario)
routes.delete("/delete/:id", authRequired, controllerAccess(), bookController.deleteBook);

export default routes;
