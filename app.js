import express from "express";
import dotenv from "dotenv";
dotenv.config();

// routes
import clientRoutes from "./src/routers/clientRoutes.js";
import employeeRoutes from "./src/routers/employeeRoutes.js";
import adminRoutes from "./src/routers/adminRoutes.js";
import author from "./src/routers/authorRoutes.js";
import category from "./src/routers/categoryRoutes.js";
import publisher from "./src/routers/publisherRoutes.js";
import bookRoutes from "./src/routers/bookRoutes.js";
import loanRoutes from "./src/routers/loanRoutes.js";

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  routes() {
    this.app.use("/client", clientRoutes);
    this.app.use("/employee", employeeRoutes);
    this.app.use("/admin", adminRoutes);
    this.app.use("/author", author);
    this.app.use("/category", category);
    this.app.use("/publisher", publisher);
    this.app.use("/book", bookRoutes);
    this.app.use("/loan", loanRoutes);
  }
}

export default new App().app;
