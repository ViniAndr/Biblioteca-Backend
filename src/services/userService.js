import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import hashPassword from "../utils/hashPassword.js";

const prisma = new PrismaClient();

// CRIAR USUÁRIO (CLEINTE E FUNCIONÁRIO)
const createUser = async (data, role) => {
  const { email, senha } = data;

  // Verificar o usuário no banco de dados
  const userExists = await prisma[role].findUnique({ where: { email } });
  if (userExists) return null;

  // Criptografar a senha
  const hashedPassword = await hashPassword(senha);
  data.senha = hashedPassword;

  // Criar o usuário
  const newUser = await prisma[role].create({ data });

  return newUser;
};

// LOGIN
const authenticateUser = async (email, senha, role) => {
  // Verificar o usuário no banco de dados
  const user = await prisma[role].findUnique({ where: { email } });
  // Verifica se o usuário foi encontrado
  if (!user) return null;

  // Verifica se a senha está correta
  const isPasswordValid = await bcrypt.compare(senha, user.senha);
  if (!isPasswordValid) return null;

  return user;
};

// VERIFICA SE UM CLIENTE JA EXISTE E ATUALIZA PARA USO NO SITE
const verifyAndUpdateClient = async (data) => {
  const { email, senha, telefone } = data;

  const existingClient = await prisma.cliente.findUnique({ where: { telefone } });

  // Se o telefone já estiver cadastrado, atualiza o cliente com o email e a senha
  if (existingClient) {
    const hashedPassword = await hashPassword(senha);

    const updatedClient = await prisma.cliente.update({
      where: { telefone },
      data: { email, senha: hashedPassword },
    });

    return updatedClient;
  }

  return null;
};

export { authenticateUser, createUser, verifyAndUpdateClient };
