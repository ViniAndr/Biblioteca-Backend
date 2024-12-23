import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Esse controller teve que ser uma class para evitar repetição de código e ter flexbilidade.
class AttributesBook {
  constructor(tableDB) {
    // vai representar um model para o prisma
    this.tableDB = tableDB;
  }

  // Tiver que usar arrow function, para o this ser aplicado corretamente junto ao Express
  // criar um autor, editora ou categoria
  create = async (req, res) => {
    const { name: nome } = req.body;
    try {
      // Chamo o model dinamicamente. req.body já é um objeto com apenas o nome para as 3 tabelas.
      const name = await prisma[this.tableDB].findUnique({ where: { nome } });
      if (name) return res.status(400).json({ message: "Name already exists" });

      await prisma[this.tableDB].create({ data: { nome } });
      res.status(201).json({ message: "Created" });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Something went wrong, please try again later." });
    }
  };

  // Obter todos os autores, editoras ou categorias
  getAll = async (req, res) => {
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
      // Chamo o model dinamicamente.
      if (page) {
        const data = await prisma[this.tableDB].findMany({
          where,
          take: Number(itemsPerPageNumber),
          skip: (Number(page) - 1) * Number(itemsPerPageNumber),
        });

        const count = await prisma[this.tableDB].count({ where });
        return res.status(200).json({
          data,
          totalPages: Math.ceil(count / itemsPerPageNumber),
          currentPage: Number(page),
        });
      }

      const data = await prisma[this.tableDB].findMany();
      return res.status(200).json(data);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Something went wrong, please try again later." });
    }
  };

  // Atualizar um autor, editora ou categoria por ID
  update = async (req, res) => {
    const id = parseInt(req.params.id);
    const { name: nome } = req.body;
    try {
      const data = await prisma[this.tableDB].findUnique({ where: { id } });
      if (!data) return res.status(404).json({ message: "Not found" });

      // Chamo o model dinamicamente.
      await prisma[this.tableDB].update({ where: { id }, data: { nome } });
      res.status(200).json({ message: "Updated" });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Something went wrong, please try again later." });
    }
  };

  // Deletar um autor, editora ou categoria por ID
  delete = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const data = await prisma[this.tableDB].findUnique({ where: { id } });
      if (!data) return res.status(404).json({ message: "Not found" });

      // Chamo o model dinamicamente.
      await prisma[this.tableDB].delete({ where: { id } });
      res.status(200).json({ message: "Deleted" });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Something went wrong, please try again later." });
    }
  };
}

export default AttributesBook;
