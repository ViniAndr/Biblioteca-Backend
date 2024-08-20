import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { authenticateUser, createUser } from "../services/userService.js";
import generateToken from "../utils/generateToken.js";

import hashPassword from "../utils/hashPassword.js";

export const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await authenticateUser(email, senha, "admin");
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
  const { email, senha } = req.body;

  try {
    const hash = await hashPassword(senha);

    const updatedAdmin = await prisma.admin.update({
      where: { id },
      data: { email, senha: hash },
    });
    if (!updatedAdmin) return res.status(404).json({ error: "Admin not found!" });

    return res.status(200).json({ message: "Admin updated sucessfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "something went wrong, please try again later." });
  }
};

export const getShowAdmin = async (req, res) => {
  const id = 1;

  try {
    const admin = await prisma.admin.findUnique({
      where: { id },
    });
    if (!admin) return res.status(404).json({ error: "Admin not found!" });

    return res.status(200).json(admin);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "something went wrong, please try again later." });
  }
};

// essa criação só pode ser feita uma vez pelo dev!!!

// export const create = async (req, res) => {
//   const data = {
//     nome: "Admin",
//     email: "admin@admin.com",
//     senha: "admin",
//   };

//   try {
//     const newAdmin = await createUser(data, "admin");
//     if (!newAdmin) return res.status(400).json({ error: "Admin already exists!" });

//     return res.status(201).json({ message: "Admin created successfully!" });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "something went wrong, please try again later." });
//   }
// };
