import { Router } from "express";
const router = Router();

// controller
import * as loanController from "../controllers/loanController.js";
// Middlewares
import authRequired from "../middlewares/authRequired.js";
import controllerAccess from "../middlewares/controllerAccess.js";

// Criar um novo empréstimo (cliente e funcionário)
router.post("/create", authRequired, loanController.createLoan);

// Confirmar retirada do livro (funcionário)
router.put("/:id/confirm", authRequired, controllerAccess(), loanController.confirmLoanPickup);

// Ver todos os empréstimos ou filtrar por cliente/status (funcionário)
router.get("/all", loanController.getLoans);
// router.get("/all", authRequired, controllerAccess(), loanController.getLoans);

// Ver todos os empréstimos do cliente autenticado ou filtrar por status (cliente)
router.get("/client", authRequired, loanController.getClientLoans);

// Cancelar empréstimo (cliente)
router.put("/:id/cancel", authRequired, loanController.cancelLoan);

router.get("/filter/clients", authRequired, controllerAccess(), loanController.getClientsFromLoans);

router.get("/filter/books", authRequired, controllerAccess(), loanController.getBooksFromLoans);

export default router;

/*
Rota GET /all
- Aceita os filtros de status e id do cliente, que devem ser passado no body da requisição
- status, clientId

Rota GET /client
- Aceita o filtro de status, que deve ser passado no body da requisição
- status
*/
