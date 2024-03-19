import express from "express";
import AdminController from "../controllers/AdminController";

const AdminRouter = express.Router();

AdminRouter.get("/login", AdminController.login);

export default AdminRouter;