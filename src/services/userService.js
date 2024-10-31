import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import hashPassword from "../utils/hashPassword.js";

const prisma = new PrismaClient();

// CRIAR USUÁRIO (CLEINTE E FUNCIONÁRIO)
const createUser = async (data, role) => {
  const dataPT = {
    nome: data.name,
    sobrenome: data.lastName,
    email: data.email,
    senha: data.password,
    telefone: data.phone,
    logradouro: data.street,
    numero: data.number,
    bairro: data.neighborhood,
    cidade: data.city,
    estado: data.state,
    cep: data.cep,
  };

  // Verificar o usuário no banco de dados
  if (role === "cliente") {
    const userExists = await prisma[role].findFirst({
      where: {
        OR: [{ email: data.email }, { telefone: data.phone }],
      },
    });
    if (userExists) return null;
  } else {
    // Para outros papéis, apenas verifique o email
    const userExists = await prisma[role].findUnique({ where: { email: data.email } });
    if (userExists) return null;
  }

  // Criptografar a senha
  const hashedPassword = await hashPassword(data.password);
  dataPT.senha = hashedPassword;

  // Criar o usuário
  const newUser = await prisma[role].create({ data: dataPT });

  return newUser;
};

// LOGIN
const authenticateUser = async (email, password, role) => {
  // Verificar o usuário no banco de dados
  const user = await prisma[role].findUnique({ where: { email } });
  // Verifica se o usuário foi encontrado
  if (!user) return null;

  // Verifica se a senha está correta
  const isPasswordValid = await bcrypt.compare(password, user.senha);
  if (!isPasswordValid) return null;

  return user;
};

//lidar com o cliente conforme a situação encontrada.
const verifyClientByPhone = async (phone) => {
  const client = await prisma.cliente.findUnique({ where: { telefone: phone } });

  if (!client) return { status: 404, error: "Client not found!" };
  if (client.email && client.senha) return { status: 400, error: "Client already exists!" };

  return client;
};

const updateRegistrationData = async (email, password, phone) => {
  if (!email || !password || !phone) return null;
  const hashedPassword = await hashPassword(password);

  return await prisma.cliente.update({
    where: { telefone: phone },
    data: { email, senha: hashedPassword },
  });
};

export { authenticateUser, createUser, updateRegistrationData, verifyClientByPhone };
