import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createBook = async (req, res) => {
  const { title, isbn, numberOfCopies, availableQuantity, edition, authorId, publisherId, categoryId } = req.body;
  const data = {
    titulo: title,
    isbn: isbn,
    qtdCopias: Number(numberOfCopies),
    qtdDisponivel: Number(availableQuantity),
    edicao: Number(edition),
    autorId: Number(authorId),
    editoraId: Number(publisherId),
    categoriaId: Number(categoryId),
  };

  try {
    const book = await prisma.livro.findUnique({ where: { isbn } });
    if (book) return res.status(400).json({ message: "Book already exists" });

    // Alem de Criar ele retorna o livro criado para pode ser atualizado no front.
    const newBook = await prisma.livro.create({
      data,
      include: {
        autor: true,
        editora: true,
        categoria: true,
      },
    });
    return res.status(201).json({ message: "Book created successfully", book: newBook });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Something went wrong, please try again later." });
  }
};

export const getAllBooks = async (req, res) => {
  const { page, author, category, publisher, title, itemsPerPage } = req.query;
  const itemsPerPageNumber = itemsPerPage ? Number(itemsPerPage) : 10;

  const where = {};
  if (author) where.autorId = Number(author);
  if (category) where.categoriaId = Number(category);
  if (publisher) where.editoraId = Number(publisher);

  // Filtro de busca por título
  if (title) {
    where.titulo = {
      contains: title, // Busca livros cujo nome contém o termo
      mode: "insensitive", // Ignora maiúsculas/minúsculas na busca
    };
  }

  try {
    const books = await prisma.livro.findMany({
      where,
      include: {
        autor: true,
        editora: true,
        categoria: true,
      },
      take: Number(itemsPerPageNumber),
      skip: (Number(page) - 1) * Number(itemsPerPageNumber),
    });

    const count = await prisma.livro.count({ where });

    return res.status(200).json({
      books,
      totalPages: Math.ceil(count / itemsPerPageNumber),
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
  const { title, isbn, numberOfCopies, availableQuantity, edition, authorId, publisherId, categoryId } = req.body;
  const { id } = req.params;
  const data = {
    titulo: title,
    isbn: isbn,
    qtdCopias: numberOfCopies,
    qtdDisponivel: availableQuantity,
    edicao: edition,
    autorId: authorId,
    editoraId: publisherId,
    categoriaId: categoryId,
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
