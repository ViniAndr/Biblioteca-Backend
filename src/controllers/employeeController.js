import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import generateToken from "../utils/generateToken.js";
import { authenticateUser, createUser } from "../services/userService.js";

export const create = async (req, res) => {
  console.log(req.body);
  try {
    const user = await createUser(req.body, "funcionario");
    if (!user) return res.status(400).json({ error: "User already exists!" });

    // por enquanto o token será chamado aqui.
    const token = generateToken(user);

    return res.status(201).json({ message: "Employee created successfully!", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "something went wrong, please try again later." });
  }
};

export const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await authenticateUser(email, senha, "funcionario");
    if (!user) return res.status(404).json({ error: "User not found!" });

    // por enquanto o token será chamado aqui.
    const token = generateToken(user);

    return res.status(200).json({ message: "Login feito com sucesso!", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "something went wrong, please try again later." });
  }
};

export const update = async (req, res) => {
  const id = req.userId;

  try {
    const updatedEmployee = await prisma.funcionario.update({ where: { id }, data: req.body });
    if (!updatedEmployee) return res.status(404).json({ error: "Employee not found!" });

    return res.status(200).json({ message: "Employee updated sucessfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "something went wrong, please try again later." });
  }
};

export const getShowEmployee = async (req, res) => {
  const id = req.userId;
  try {
    const data = await prisma.funcionario.findUnique({ where: { id } });
    if (!data) return res.status(404).json({ error: "Employee not found!" });

    return res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "something went wrong, please try again later." });
  }
};

export const getAllEmployee = async (req, res) => {
  try {
    const employees = await prisma.funcionario.findMany();

    return res.status(200).json({ employees });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "something went wrong, please try again later." });
  }
};

export const getEmployeeById = async (req, res) => {
  const id = parseInt(req.params.id);
  console.log(req.userRole);
  try {
    const employee = await prisma.funcionario.findUnique({ where: { id } });
    if (!employee) return res.status(400).json({ error: "employee not found!" });

    return res.status(200).json({ employee });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "something went wrong, please try again later." });
  }
};

export const deleteEmployee = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const deletedEmployee = await prisma.funcionario.delete({ where: { id } });
    if (!deletedEmployee) return res.status(404).json({ error: "Employee not found!" });

    return res.status(200).json({ message: "Employee deleted successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "something went wrong, please try again later." });
  }
};
