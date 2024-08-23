import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import generateToken from "../utils/generateToken.js";
import { authenticateUser, createUser, verifyAndUpdateClient } from "../services/userService.js";
import hashPassword from "../utils/hashPassword.js";

// verificacao de usuario ja cadastrado na biblioteca
export const verifyOrCreateClient = async (req, res) => {
  try {
    const client = await verifyAndUpdateClient(req.body);
    if (!client) return res.status(404).json({ error: "Client not found!" });

    return res.status(200).json({ message: "Client updated successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred, please try again later." });
  }
};

// criacao completa que e feita pelo cliente via site
export const createFullClient = async (req, res) => {
  try {
    const client = await createUser(req.body, "cliente");
    if (!client) return res.status(400).json({ error: "Client already exists!" });

    const token = generateToken(client);

    return res.status(201).json({ message: "Client created successfully!", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred, please try again later." });
  }
};

// criacao simples feita pelo funcionario via presencial
export const createSimpleClient = async (req, res) => {
  const { telefone } = req.body;

  try {
    const existingClient = await prisma.cliente.findUnique({ where: { telefone } });
    if (existingClient) return res.status(400).json({ error: "Client already exists!" });

    await prisma.cliente.create({ data: req.body });

    return res.status(201).json({ message: "Client created successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred, please try again later." });
  }
};

// Função de login para clientes
export const clientLogin = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const client = await authenticateUser(email, senha, "cliente");
    if (!client) return res.status(404).json({ error: "Client not found!" });

    const token = generateToken(client);

    return res.status(200).json({ message: "Login successful!", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred, please try again later." });
  }
};

// Atualização dos dados cadastrais do cliente
export const updateClientProfile = async (req, res) => {
  const clientId = req.userId;
  const { nome, sobrenome, telefone, email, senha } = req.body;

  try {
    const hashedPassword = await hashPassword(senha);

    const updatedClient = await prisma.cliente.update({
      where: { id: clientId },
      data: { nome, sobrenome, telefone, email, senha: hashedPassword },
    });
    if (!updatedClient) return res.status(404).json({ error: "Client not found!" });

    return res.status(200).json({ message: "Client profile updated successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred, please try again later." });
  }
};

// Atualização do endereço do cliente
export const updateClientAddress = async (req, res) => {
  const clientId = req.userId;
  const { logradouro, numero, bairro, cidade, estado, cep } = req.body;

  try {
    const updatedAddress = await prisma.cliente.update({
      where: { id: clientId },
      data: { logradouro, numero, bairro, cidade, estado, cep },
    });
    if (!updatedAddress) return res.status(404).json({ error: "Client not found!" });

    return res.status(200).json({ message: "Client address updated successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred, please try again later." });
  }
};

// Deleção de cliente
export const deleteClientAccount = async (req, res) => {
  const clientId = req.userId;

  try {
    const deletedClient = await prisma.cliente.delete({ where: { id: clientId } });
    if (!deletedClient) return res.status(404).json({ error: "Client not found!" });

    return res.status(200).json({ message: "Client account deleted successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred, please try again later." });
  }
};

// Retorna todos os clientes cadastrados
export const listAllClients = async (req, res) => {
  try {
    const clients = await prisma.cliente.findMany();

    return res.status(200).json({ clients });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred, please try again later." });
  }
};

// Retorna um cliente pelo ID
export const getClientById = async (req, res) => {
  const clientId = parseInt(req.params.id);

  try {
    const client = await prisma.cliente.findUnique({ where: { id: clientId } });
    if (!client) return res.status(404).json({ error: "Client not found!" });

    return res.status(200).json({ client });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred, please try again later." });
  }
};
