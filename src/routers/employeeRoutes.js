import { Router } from "express";
const router = Router();
//Controller
import * as employeeController from "../controllers/employeeController.js";
// Middlewares
import authRequired from "../middlewares/authRequired.js";
import controllerAccess from "../middlewares/controllerAccess.js";

// Criar um novo funcionario (Admin)
router.post("/create", authRequired, controllerAccess("admin"), employeeController.create);

// Login do funcionario (Funcionario)
router.get("/login", employeeController.login);

// Atualizar dados de registro do funcionario (Funcionario)
router.put("/update", authRequired, employeeController.update);

// Obter perfil do funcionario (Funcionario)
router.get("/show", authRequired, controllerAccess(), employeeController.getShowEmployee);

// Obter todos os funcionarios (Admin)
router.get("/all", authRequired, controllerAccess("admin"), employeeController.getAllEmployee);

// Obter um funcionario por ID (Admin)
router.get("/show/:id", authRequired, controllerAccess("admin"), employeeController.getEmployeeById);

// Deletar um funcionario por ID (Admin)
router.delete("/delete/:id", authRequired, controllerAccess("admin"), employeeController.deleteEmployee);

export default router;
