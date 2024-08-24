import { Router } from "express";
const router = Router();

//controller em forma de Class
import AttributesBook from "../controllers/AttributesBookController.js";
// Tenho que passar nome da tabela para o construtor
const publisher = new AttributesBook("editora");

//middleware
import authRequired from "../middlewares/authRequired.js";
import controllerAccess from "../middlewares/controllerAccess.js";

// Criar um novo categoria (Funcionario)
router.post("/create", authRequired, controllerAccess(), publisher.create);

// Obter todos os categoriaes (Funcionario)
router.get("/all", publisher.getAll);

// Atualizar um categoria por ID (Funcionario)
router.put("/update/:id", authRequired, controllerAccess(), publisher.update);

// Deletar uma cátegoria (Funcionario)
router.delete("/delete/:id", authRequired, controllerAccess(), publisher.delete);

export default router;
