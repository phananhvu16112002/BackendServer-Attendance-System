import express from "express";
import AdminController from "../controllers/AdminController";

const AdminRouter = express.Router();

AdminRouter.get("/login", AdminController.uploadClasses);
AdminRouter.post("/submit/teachers", );
AdminRouter.post("/submit/students", );
AdminRouter.post("/submit/course", );
AdminRouter.post("/submit/")

export default AdminRouter;