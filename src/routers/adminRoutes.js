import { Router } from "express";
const router = Router();

// Controller
import * as adminController from "../controllers/adminController.js";

// Middlewares
import authRequired from "../middlewares/authRequired.js";
import controllerAccess from "../middlewares/controllerAccess.js";
import blockAccess from "../middlewares/blockAccess.js";

// Login (alterado para POST)
router.post("/login", blockAccess, adminController.loginAdmin);

// Atualizar dados do admin
router.put("/update", authRequired, controllerAccess("admin"), adminController.updateAdmin);

// Obter perfil do admin
router.get("/profile", authRequired, controllerAccess("admin"), adminController.getAdminDetails);

// Rota comentada para criar um admin, descomente se necessário
// router.post("/create", blockAccess, authRequired, controllerAccess("superadmin"), adminController.create);

export default router;
