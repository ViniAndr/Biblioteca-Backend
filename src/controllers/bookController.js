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
  const { page = 1, limit = 10, author, category, publisher } = req.query;

  // Filtros Dinâmicos
  const where = {};
  if (author) where.autorId = Number(author);
  if (category) where.categoriaId = Number(category);
  if (publisher) where.editoraId = Number(publisher);

  try {
    const books = await prisma.livro.findMany({
      where,
      take: Number(limit),
      skip: (Number(page) - 1) * Number(limit),
    });

    // serve para contar quantos livros existem no banco de dados
    const count = await prisma.livro.count({ where });

    return res.status(200).json({
      books,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
    });
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
