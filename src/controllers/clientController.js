import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import generateToken from "../utils/generateToken.js";
import { authenticateUser, createUser, updateRegistrationData, verifyClientByPhone } from "../services/userService.js";
import hashPassword from "../utils/hashPassword.js";

// verificacao de usuario ja cadastrado na biblioteca
export const verifyOrCreateClient = async (req, res) => {
  const { phone, email, password } = req.body;

  try {
    const clientExists = await verifyClientByPhone(phone);
    if (clientExists.error) {
      return res.status(clientExists.status).json({ error: clientExists.error });
    }

    const updatedClient = await updateRegistrationData(email, password, phone);
    if (!updatedClient) {
      return res.status(400).json({ error: "No valid data provided for update." });
    }

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
  const { name, lastName, phone, street, number, neighborhood, city, state, cep } = req.body;

  const data = {
    nome: name,
    sobrenome: lastName,
    telefone: phone,
    logradouro: street,
    numero: number,
    bairro: neighborhood,
    cidade: city,
    estado: state,
    cep,
  };

  try {
    const existingClient = await prisma.cliente.findUnique({ where: { telefone: phone } });
    if (existingClient) return res.status(400).json({ error: "Client already exists!" });

    const newClient = await prisma.cliente.create({ data });

    return res.status(201).json({ message: "Client created successfully!", client: newClient });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred, please try again later." });
  }
};

// Função de login para clientes
export const clientLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const client = await authenticateUser(email, password, "cliente");
    if (!client) return res.status(404).json({ error: "invalid credentials" });

    const token = generateToken(client);

    return res.status(200).json({ message: "Login successful!", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred, please try again later." });
  }
};

export const getClientProfile = async (req, res) => {
  const userId = req.userId;
  try {
    const client = await prisma.cliente.findUnique({ where: { id: userId } });
    if (!client) return res.status(404).json({ error: "Client not found!" });
    return res.status(200).json(client);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred, please try again later." });
  }
};

// Atualização dos dados cadastrais do cliente
export const updateClientProfile = async (req, res) => {
  const clientId = req.userId;
  const data = {};

  if (req.body.name) data.nome = req.body.name;
  if (req.body.lastName) data.sobrenome = req.body.lastName;
  if (req.body.phone) data.telefone = req.body.phone;
  if (req.body.email) data.email = req.body.email;

  if (req.body.password) {
    const hashedPassword = await hashPassword(req.body.password);
    data.senha = hashedPassword;
  }

  try {
    const updatedClient = await prisma.cliente.update({
      where: { id: clientId },
      data,
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
  const { street, number, neighborhood, city, state, cep } = req.body;
  const clientId = req.userId;
  const data = {};

  if (street) data.logradouro = street;
  if (number) data.numero = number;
  if (neighborhood) data.bairro = neighborhood;
  if (city) data.cidade = city;
  if (state) data.estado = state;
  if (cep) data.cep = cep;

  try {
    const updatedAddress = await prisma.cliente.update({
      where: { id: clientId },
      data,
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
  const { page, nome, itemsPerPage } = req.query;
  const itemsPerPageNumber = itemsPerPage ? Number(itemsPerPage) : 10;

  const where = {};

  // Filtro de busca por título
  if (nome) {
    where.nome = {
      contains: nome, // Busca livros cujo nome contém o termo
      mode: "insensitive", // Ignora maiúsculas/minúsculas na busca
    };
  }

  try {
    const data = await prisma.cliente.findMany({
      where,
      take: Number(itemsPerPageNumber),
      skip: (Number(page) - 1) * Number(itemsPerPageNumber),
    });

    const count = await prisma.cliente.count({ where });
    return res.status(200).json({
      data,
      totalPages: Math.ceil(count / itemsPerPageNumber),
      currentPage: Number(page),
    });
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
