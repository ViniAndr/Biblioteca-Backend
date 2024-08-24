import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { authenticateUser, createUser } from "../services/userService.js";
import generateToken from "../utils/generateToken.js";
import hashPassword from "../utils/hashPassword.js";

export const loginAdmin = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await authenticateUser(email, senha, "admin");
    if (!user) return res.status(404).json({ error: "User not found!" });

    const token = generateToken(user);

    return res
      .status(200)
      .json({ message: "Login feito com sucesso!", token, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Something went wrong, please try again later." });
  }
};

export const updateAdmin = async (req, res) => {
  const id = req.userId;
  const { email, senha } = req.body;

  try {
    const updateData = { email };

    if (senha) {
      const hash = await hashPassword(senha);
      updateData.senha = hash;
    }

    const updatedAdmin = await prisma.admin.update({
      where: { id },
      data: updateData,
    });

    if (!updatedAdmin) return res.status(404).json({ error: "Admin not found!" });

    return res.status(200).json({ message: "Admin updated successfully!" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Something went wrong, please try again later." });
  }
};

export const getAdminDetails = async (req, res) => {
  const id = 1;

  try {
    const admin = await prisma.admin.findUnique({
      where: { id },
    });

    if (!admin) return res.status(404).json({ error: "Admin not found!" });

    return res.status(200).json(admin);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Something went wrong, please try again later." });
  }
};

// Criação de Admin (Somente uma vez)
// export const create = async (req, res) => {
//   const data = {
//     nome: "Admin",
//     email: "admin@admin.com",
//     senha: "admin",
//   };

//   try {
//     const existingAdmin = await prisma.admin.findFirst();
//     if (existingAdmin) return res.status(400).json({ error: "Admin already exists!" });

//     const newAdmin = await createUser(data, "admin");
//     return res.status(201).json({ message: "Admin created successfully!" });
//   } catch (error) {
//     console.error(error.message);
//     return res.status(500).json({ error: "Something went wrong, please try again later." });
//   }
// };
