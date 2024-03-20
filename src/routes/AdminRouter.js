import express from "express";
import AdminController from "../controllers/AdminController";

const AdminRouter = express.Router();

//AdminRouter.get("/login", );
AdminRouter.post("/submit/teachers", AdminController.uploadTeachers);
AdminRouter.post("/submit/students", AdminController.uploadStudents);
AdminRouter.post("/submit/course", AdminController.uploadClasses);
AdminRouter.post("/submit/classes", AdminController.uploadClasses);

export default AdminRouter;