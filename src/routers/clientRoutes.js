import { Router } from "express";
const router = Router();
//Controller
import * as clientController from "../controllers/clientController.js";
// Middlewares
import authRequired from "../middlewares/authRequired.js";
import controllerAccess from "../middlewares/controllerAccess.js";

// Verificar se o cliente já existe e atualizar
router.post("/verify", clientController.verifyOrCreateClient);

// Criar um novo cliente online com o cadastro completo
router.post("/create", clientController.createFullClient);

// Criar um novo cliente com o cadastro simples
router.post("/create/simple", clientController.createSimpleClient);

// Login do cliente
router.post("/login", clientController.clientLogin);

// Atualizar endereço do cliente
router.put("/update/address", authRequired, clientController.updateClientAddress);

// Atualizar dados do registro do cliente
router.put("/update/profile", authRequired, clientController.updateClientProfile);

// Deletar cliente
router.delete("/delete", authRequired, clientController.deleteClientAccount);

// Ver todos os clientes
router.get("/all", authRequired, controllerAccess("admin"), clientController.listAllClients);

// Ver cliente por ID
router.get("/:id", authRequired, controllerAccess("admin"), clientController.getClientById);

export default router;
