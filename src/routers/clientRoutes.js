import { Router } from "express";
const router = Router();
//Controller
import * as clientController from "../controllers/clientController.js";
// Middlewares
import authRequired from "../middlewares/authRequired.js";
import controllerAccess from "../middlewares/controllerAccess.js";

// Criar um novo cliente (Cliente)
router.post("/create", clientController.create);

// Login do cliente (Cliente)
router.get("/login", clientController.login);

// Atualizar endereço do cliente (Cliente)
router.put("/update/address", authRequired, clientController.updateAddress);

// Atualizar dados do registro do cliente (Cliente)
router.put("/update/registration", authRequired, clientController.updateRegistration);

// Deletar cliente (Cliente)
router.delete("/delete", authRequired, clientController.deleteClient);

// Ver todos os clientes (Funcionário e Admin)
router.get("/all", authRequired, controllerAccess(), clientController.getAllClients);

// Ver cliente por ID (Funcionário e Admin)
router.get("/:id", authRequired, controllerAccess(), clientController.getClientById);

export default router;
