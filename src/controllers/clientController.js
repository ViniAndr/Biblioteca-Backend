import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import generateToken from "../utils/generateToken.js";
import { authenticateUser, createUser } from "../services/userService.js";
import hashPassword from "../utils/hashPassword.js";

export const create = async (req, res) => {
  try {
    const user = await createUser(req.body, "cliente");
    if (!user) return res.status(400).json({ error: "User already exists!" });

    // por enquanto o token será chamado aqui.
    const token = generateToken(user);

    return res.status(201).json({ message: "Client created successfully!", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong, please try again later." });
  }
};

export const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await authenticateUser(email, senha, "cliente");
    if (!user) return res.status(404).json({ error: "User not found!" });

    // por enquanto o token será chamado aqui.
    const token = generateToken(user);

    return res.status(200).json({ message: "Login feito com sucesso!", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong, please try again later." });
  }
};

export const updateRegistration = async (req, res) => {
  const id = req.userId;

  const { nome, sobrenome, telefone, email, senha } = req.body;

  try {
    const hash = await hashPassword(senha);

    const updatedClient = await prisma.cliente.update({
      where: { id },
      data: { nome, sobrenome, telefone, email, senha: hash },
    });
    if (!updatedClient) return res.status(404).json({ error: "Client not found!" });

    return res.status(200).json({ message: "Client updated successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong, please try again later." });
  }
};

export const updateAddress = async (req, res) => {
  const id = req.userId;

  const { logradouro, numero, bairro, cidade, estado, cep } = req.body;

  try {
    const updatedClient = await prisma.cliente.update({
      where: { id },
      data: { logradouro, numero, bairro, cidade, estado, cep },
    });
    if (!updatedClient) return res.status(404).json({ error: "Client not found!" });

    return res.status(200).json({ message: "Client address updated successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong, please try again later." });
  }
};

export const deleteClient = async (req, res) => {
  const id = req.userId;

  try {
    const deletedClient = await prisma.cliente.delete({ where: { id } });
    if (!deletedClient) return res.status(404).json({ error: "Client not found!" });

    return res.status(200).json({ message: "Client deleted successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong, please try again later." });
  }
};

export const getAllClients = async (req, res) => {
  try {
    const clients = await prisma.cliente.findMany();

    return res.status(200).json({ clients });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong, please try again later." });
  }
};

export const getClientById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const client = await prisma.cliente.findUnique({ where: { id } });
    if (!client) return res.status(404).json({ error: "Client not found!" });

    return res.status(200).json({ client });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong, please try again later." });
  }
};
