import express from "express";
import AdminController from "../controllers/AdminController";

const AdminRouter = express.Router();

AdminRouter.post("/login", AdminController.login);





AdminRouter.post("/submit/teachers", AdminController.uploadTeachers);
AdminRouter.post("/submit/students", AdminController.uploadStudents);
AdminRouter.post("/submit/course", AdminController.uploadCourses);
AdminRouter.post("/submit/classes", AdminController.uploadClasses);

AdminRouter.get("/teachers", AdminController.getStudents);
AdminRouter.get("/students", AdminController.getTeachers);
AdminRouter.get("/courses", AdminController.getCourses);
AdminRouter.get("/courses/:id/classes", AdminController.getClassesByCourseID);
AdminRouter.get("/classes", AdminController.getClasses);
export default AdminRouter;