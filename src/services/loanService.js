import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const registerLoan = async (body, id, role) => {
  const data = { ...body };
  data.dataEmprestimo = new Date();

  // Esse "cliente" vem da coluna role
  if (role === "cliente") {
    // já vem da requisição o id do livro
    data.clienteId = id;
    data.status = "Pendente";
    // você tem até 8 dias úteis para ir buscar e ler o livro
    data.dataDevolucao = getDateReturn();
  } else {
    // Id do livro, data de devolução e id do cliente já vem da requisição
    data.status = "Emprestado";
    data.funcionarioId = id;
  }

  const loan = await prisma.emprestimo.create({ data });

  return loan;
};

const getLoansClient = async (clientId, status) => {
  // a busca por padrao vai ser associada ao id do cliente
  const where = { clienteId: clientId };
  // pode ter o filtro de status
  if (status) {
    where.status = status;
  }
  // se nao tiver id e status, ele vai trazer todos os emprestimos do cliente
  const loans = await prisma.emprestimo.findMany({ where });
  return loans;
};

const getLoansEmployee = async (clientId, status) => {
  // vai buscar todos os emprestimos
  const where = {};
  // pode ter o filtro de id e status
  if (clientId) {
    where.clienteId = clientId;
  }
  if (status) {
    where.status = status;
  }

  // se nao tiver id e status, ele vai trazer todos os emprestimos
  const loans = await prisma.emprestimo.findMany({ where });

  return loans;
};

export { registerLoan, getLoansClient, getLoansEmployee };

function getDateReturn() {
  const dateNow = new Date();
  let count = 0;

  while (count < 8) {
    dateNow.setDate(dateNow.getDate() + 1);
    const day = dateNow.getDay();

    // Verifica se não é sábado (6) ou domingo (0)
    if (day !== 0 && day !== 6) {
      count += 1;
      // vefirica se e o oitavo dia util
      if (count == 8) {
        return new Date(dateNow);
      }
    }
  }
  return null;
}
