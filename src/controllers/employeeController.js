import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import generateToken from "../utils/generateToken.js";
import { authenticateUser, createUser } from "../services/userService.js";

export const createEmployee = async (req, res) => {
  try {
    const user = await createUser(req.body, "funcionario");
    if (!user) return res.status(400).json({ error: "User already exists!" });

    return res.status(201).json({ message: "Employee created successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
};

export const employeeAndAdminLogin = async (req, res) => {
  const { email, password } = req.body;
  let adminUser = null;

  try {
    // verifica se esse email e senha pertencem a um funcionario
    const employeeUser = await authenticateUser(email, password, "funcionario");
    // se nao for um funcionario, verifica se e um admin
    if (!employeeUser) {
      adminUser = await authenticateUser(email, password, "admin");
      if (!adminUser) return res.status(404).json({ error: "Invalid credentials!" });
    }

    const token = generateToken(employeeUser || adminUser);

    return res.status(200).json({ message: "Login successful!", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
};

export const updateEmployee = async (req, res) => {
  const id = req.userId;
  const { name: nome, lastName: sobrenome, email, password: senha } = req.body;

  try {
    const updatedEmployee = await prisma.funcionario.update({ where: { id }, data: { nome, sobrenome, email, senha } });
    if (!updatedEmployee) return res.status(404).json({ error: "Employee not found!" });

    return res.status(200).json({ message: "Employee updated successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
};

export const getEmployeeDetails = async (req, res) => {
  const id = req.userId;
  try {
    const employee = await prisma.funcionario.findUnique({ where: { id } });
    if (!employee) return res.status(404).json({ error: "Employee not found!" });

    return res.status(200).json({ employee });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
};

export const getAllEmployees = async (req, res) => {
  try {
    const employees = await prisma.funcionario.findMany();

    return res.status(200).json({ employees });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
};

export const getEmployeeById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const employee = await prisma.funcionario.findUnique({ where: { id } });
    if (!employee) return res.status(404).json({ error: "Employee not found!" });

    return res.status(200).json({ employee });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong. Please try again later." });
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
    return res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
};
