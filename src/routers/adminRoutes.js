import { Router } from "express";
const router = Router();
//Controller
import * as adminController from "../controllers/adminController.js";
// Middlewares
import authRequired from "../middlewares/authRequired.js";
import controllerAccess from "../middlewares/controllerAccess.js";

// login
router.get("/login", adminController.login);

// atualizar dados
router.put("/update", authRequired, controllerAccess("admin"), adminController.update);

// router.get("/create", adminController.create);

export default router;
