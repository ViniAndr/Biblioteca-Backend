import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

//Service
import { registerLoan, getLoansClient, getLoansEmployee } from "../services/loanService.js";

export const createLoan = async (req, res) => {
  const userId = req.useruserId;
  const role = req.userRole;
  try {
    await registerLoan(req.body, userId, role);

    return res.status(201).json({ message: "Loan created successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong, please try again later." });
  }
};

export const confirmLoanPickup = async (req, res) => {
  const loanId = parseInt(req.params.id);
  const userId = req.userId;

  try {
    // Busca o empréstimo pelo ID
    const loan = await prisma.emprestimo.findUnique({ where: { id: loanId } });
    if (!loan) {
      return res.status(404).json({ error: "Loan not found" });
    }

    if (loan.status !== "Pendente") {
      return res.status(400).json({ error: "Loan is not pending" });
    }

    // Atualiza o empréstimo com o ID do funcionário e altera o status para "Emprestado"
    const updatedLoan = await prisma.emprestimo.update({
      where: { id: loanId },
      data: {
        funcionarioId: userId,
        status: "Emprestado",
      },
    });

    res.status(200).json({ message: "Loan accepted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong, please try again later." });
  }
};

// os filtro de status e id são opcionais e vem do body
export const getLoans = async (req, res) => {
  const { status, clientId } = req.query;

  try {
    const loans = await getLoansEmployee(status, clientId);
    return res.status(200).json(loans);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong, please try again later." });
  }
};

// o filtro de status e opcionais e vem do body
export const getClientLoans = async (req, res) => {
  const clientId = req.userId;
  const { status } = req.query;

  try {
    const loans = await getLoansClient(clientId, status);
    return res.status(200).json(loans);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong, please try again later." });
  }
};

// cliente pode cancelar a solicitacao de emprestimo
export const cancelLoan = async (req, res) => {
  const loanId = parseInt(req.params.id);
  const status = "Cancelado";
  try {
    const loan = await prisma.emprestimo.findUnique({ where: { id: loanId } });
    if (!loan) {
      return res.status(404).json({ error: "Loan not found" });
    }
    if (loan.status !== "Pendente") {
      return res.status(400).json({ error: "Loan is not pending" });
    }

    await prisma.emprestimo.update({ where: { id: loanId }, data: { status } });

    return res.status(201).json("loan cancel successfully");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong, please try again later." });
  }
};
