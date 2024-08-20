import { Router } from "express";
const router = Router();

//controller em forma de Class
import AttributesBook from "../controllers/AttributesBookController.js";
// Tenho que passar nome da tabela para o construtor
const author = new AttributesBook("autor");

//middleware
import authRequired from "../middlewares/authRequired.js";
import controllerAccess from "../middlewares/controllerAccess.js";

// Criar um novo categoria (Funcionario)
router.post("/create", authRequired, controllerAccess(), author.create);

// Obter todos os categoriaes (Funcionario)
router.get("/all", authRequired, controllerAccess(), author.getAll);

// Atualizar um categoria por ID (Funcionario)
router.put("/update/:id", authRequired, controllerAccess(), author.update);

// Deletar uma cátegoria (Funcionario)
router.delete("/delete/:id", authRequired, controllerAccess(), author.delete);

export default router;
