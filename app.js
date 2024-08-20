import express from "express";
import dotenv from "dotenv";
dotenv.config();

// routes
import clientRoutes from "./src/routers/clientRoutes.js";
import employeeRoutes from "./src/routers/employeeRoutes.js";
import adminRoutes from "./src/routers/adminRoutes.js";

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
    this.app.use("/cliente", clientRoutes);
    this.app.use("/funcionario", employeeRoutes);
    this.app.use("/admin", adminRoutes);
  }
}

export default new App().app;
