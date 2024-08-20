import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createBook = async (req, res) => {
  const data = req.body;

  try {
    await prisma.livro.create({ data });
    return res.status(201).json({ message: "Created" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "something went wrong, please try again later." });
  }
};

export const getAllBooks = async (req, res) => {
  try {
    const books = await prisma.livro.findMany();
    return res.status(200).json(books);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "something went wrong, please try again later." });
  }
};

export const getShowBook = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const book = await prisma.livro.findUnique({ where: { id } });
    return res.status(200).json(book);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "something went wrong, please try again later." });
  }
};

export const updateBook = async (req, res) => {
  const id = parseInt(req.params.id);
  const data = req.body;

  try {
    await prisma.livro.update({ where: { id }, data });
    return res.status(200).json({ message: "Updated!" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "something went wrong, please try again later." });
  }
};

export const deleteBook = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    await prisma.livro.delete({ where: { id } });
    return res.status(200).json({ message: "Deleted!" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "something went wrong, please try again later." });
  }
};
