import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createBook = async (req, res) => {
  const data = {
    titulo: req.body.title,
    isbn: req.body.isbn,
    qtdCopias: req.body.numberOfCopies,
    qtdDisponivel: req.body.availableQuantity,
    edicao: req.body.edition,
    autorId: req.body.authorId,
    editoraId: req.body.publisherId,
    categoriaId: req.body.categoryId,
  };

  try {
    const book = prisma.livro.findUnique({ where: { isbn: data.isbn } });
    if (book) return res.status(400).json({ message: "Book already exists" });

    await prisma.livro.create({ data });
    return res.status(201).json({ message: "Book created successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Something went wrong, please try again later." });
  }
};

export const getAllBooks = async (req, res) => {
  const limit = 10;
  const { page = 1, author, category, publisher } = req.query;

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

    const count = await prisma.livro.count({ where });

    return res.status(200).json({
      books,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Something went wrong, please try again later." });
  }
};

export const getBookById = async (req, res) => {
  const { id } = req.params;

  try {
    const book = await prisma.livro.findUnique({ where: { id: Number(id) } });
    if (!book) return res.status(404).json({ message: "Book not found" });

    return res.status(200).json(book);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Something went wrong, please try again later." });
  }
};

export const updateBook = async (req, res) => {
  const { id } = req.params;
  const data = {
    titulo: req.body.title,
    isbn: req.body.isbn,
    qtdCopias: req.body.numberOfCopies,
    qtdDisponivel: req.body.availableQuantity,
    edicao: req.body.edition,
    autorId: req.body.authorId,
    editoraId: req.body.publisherId,
    categoriaId: req.body.categoryId,
  };

  try {
    const book = await prisma.livro.findUnique({ where: { id: Number(id) } });
    if (!book) return res.status(404).json({ message: "Book not found" });

    await prisma.livro.update({
      where: { id: Number(id) },
      data,
    });
    return res.status(200).json({ message: "Book updated successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Something went wrong, please try again later." });
  }
};

export const deleteBook = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.livro.delete({ where: { id: Number(id) } });
    return res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Something went wrong, please try again later." });
  }
};
