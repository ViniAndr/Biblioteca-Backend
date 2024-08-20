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
    try {
      // Chamo o model dinamicamente. req.body já é um objeto com apenas o nome para as 3 tabelas.
      await prisma[this.tableDB].create({ data: req.body });
      res.status(201).json({ message: "Created" });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Something went wrong, please try again later." });
    }
  };

  // Obter todos os autores, editoras ou categorias
  getAll = async (req, res) => {
    try {
      // Chamo o model dinamicamente.
      const data = await prisma[this.tableDB].findMany();
      res.status(200).json(data);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Something went wrong, please try again later." });
    }
  };

  // Atualizar um autor, editora ou categoria por ID
  update = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      // Chamo o model dinamicamente.
      await prisma[this.tableDB].update({ where: { id }, data: req.body });
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