import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import hashPassword from "../utils/hashPassword.js";

const prisma = new PrismaClient();

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

export { authenticateUser, createUser };
