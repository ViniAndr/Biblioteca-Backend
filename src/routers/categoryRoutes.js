import { Router } from "express";
const router = Router();

//controller em forma de Class
import AttributesBook from "../controllers/AttributesBookController.js";
// Tenho que passar nome da tabela para o construtor
const category = new AttributesBook("categoria");

//middleware
import authRequired from "../middlewares/authRequired.js";
import controllerAccess from "../middlewares/controllerAccess.js";

// Criar um novo categoria (Funcionario)
router.post("/create", authRequired, controllerAccess("funcionario"), category.create);

// Obter todos os categoriaes (Funcionario)
router.get("/all", authRequired, controllerAccess("funcionario"), category.getAll);

// Atualizar um categoria por ID (Funcionario)
router.put("/update/:id", authRequired, controllerAccess("funcionario"), category.update);

// Deletar uma cátegoria (Funcionario)
router.delete("/delete/:id", authRequired, controllerAccess("funcionario"), category.delete);

export default router;
