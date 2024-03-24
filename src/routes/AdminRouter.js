import express from "express";
import AdminController from "../controllers/AdminController";
import VerifyAccessToken from "../middlewares/verifyAccessToken";
import Authorization from "../middlewares/Authorization";

const AdminRouter = express.Router();

AdminRouter.post("/login", AdminController.login);

AdminRouter.post("/submit/teachers", VerifyAccessToken, Authorization('admin'), AdminController.uploadTeachers);
AdminRouter.post("/submit/students", VerifyAccessToken, Authorization('admin'), AdminController.uploadStudents);
AdminRouter.post("/submit/course", VerifyAccessToken, Authorization('admin'), AdminController.uploadCourses);
AdminRouter.post("/submit/classes", VerifyAccessToken, Authorization('admin'), AdminController.uploadClasses);

AdminRouter.get("/teachers", VerifyAccessToken, Authorization('admin'), AdminController.getTeachers);
AdminRouter.get("/students", VerifyAccessToken, Authorization('admin'), AdminController.getStudents);
AdminRouter.get("/courses", VerifyAccessToken, Authorization('admin'), AdminController.getCourses);
AdminRouter.get("/courses/:id/classes", VerifyAccessToken, Authorization('admin'), AdminController.getClassesByCourseID);
AdminRouter.get("/classes", VerifyAccessToken, Authorization('admin'), AdminController.getClasses);

AdminRouter.post("/submit/teacher", VerifyAccessToken, Authorization('admin'), AdminController.postTeacher);
AdminRouter.post("/submit/student", VerifyAccessToken, Authorization('admin'), AdminController.postStudent);
AdminRouter.post("/submit/course", VerifyAccessToken, Authorization('admin'), AdminController.postCourse);
export default AdminRouter;