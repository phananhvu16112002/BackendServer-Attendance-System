import express from "express";
import AdminController from "../controllers/AdminController";
import Authorization from "../middlewares/Authorization";
import VerifyAccessToken from "../middlewares/VerifyAccessToken";
import StudentClassController from "../controllers/StudentClassController";

const AdminRouter = express.Router();

AdminRouter.post("/login", AdminController.login);

AdminRouter.post("/submit/teachers", VerifyAccessToken, Authorization('admin'), AdminController.uploadTeachers);
AdminRouter.post("/submit/students", VerifyAccessToken, Authorization('admin'), AdminController.uploadStudents);
AdminRouter.post("/submit/courses", VerifyAccessToken, Authorization('admin'), AdminController.uploadCourses);
AdminRouter.post("/submit/classes", VerifyAccessToken, Authorization('admin'), AdminController.uploadClasses);

AdminRouter.get("/teachers", VerifyAccessToken, Authorization('admin'), AdminController.getTeachers);
AdminRouter.get("/students", VerifyAccessToken, Authorization('admin'), AdminController.getStudents);
AdminRouter.get("/courses", VerifyAccessToken, Authorization('admin'), AdminController.getCourses);
AdminRouter.get("/courses/:id/classes", VerifyAccessToken, Authorization('admin'), AdminController.getClassesByCourseID);
AdminRouter.get("/classes", VerifyAccessToken, Authorization('admin'), AdminController.getClasses);

AdminRouter.post("/submit/teacher", VerifyAccessToken, Authorization('admin'), AdminController.postTeacher);
AdminRouter.post("/submit/student", VerifyAccessToken, Authorization('admin'), AdminController.postStudent);
AdminRouter.post("/submit/course", VerifyAccessToken, Authorization('admin'), AdminController.postCourse);
AdminRouter.post("/submit/studentclass", VerifyAccessToken, Authorization('admin'), AdminController.addStudentInClass);

AdminRouter.put("/edit/student/:id", VerifyAccessToken, Authorization('admin'), AdminController.editStudent);
AdminRouter.put("/edit/teacher/:id", VerifyAccessToken, Authorization('admin'), AdminController.editTeacher);
AdminRouter.put("/edit/course/:id", VerifyAccessToken, Authorization('admin'), AdminController.editCourse);
AdminRouter.put("/edit/class/:id", VerifyAccessToken, Authorization('admin'), AdminController.editClass);

AdminRouter.get("/classes/:id", VerifyAccessToken, Authorization('admin'), AdminController.getStudentsByClassID);
AdminRouter.put("/classes/:id/uploadstudents", VerifyAccessToken, Authorization('admin'), AdminController.uploadMoreStudentsToClass);
//pagination
AdminRouter.get("/courses/page/:page", VerifyAccessToken, Authorization('admin'), AdminController.getCoursesWithPagination);
AdminRouter.get("/courses/:id/classes/page/:page", VerifyAccessToken, Authorization('admin'), AdminController.getClassesByCourseIDWithPagination);
AdminRouter.get("/classes/page/:page", VerifyAccessToken, Authorization('admin'), AdminController.getClassesWithPagination);

//delete
AdminRouter.delete("/course/:id", VerifyAccessToken, Authorization("admin"), AdminController.deleteCourse);
AdminRouter.delete("/class/:id", VerifyAccessToken, Authorization("admin"), AdminController.deleteClass);
AdminRouter.delete("/teacher/:id", VerifyAccessToken, Authorization("admin"), AdminController.deleteTeacher);
AdminRouter.delete("/student/:id", VerifyAccessToken, Authorization("admin"), AdminController.deleteStudent);
AdminRouter.delete("/class/:classid/student/:studentid", VerifyAccessToken, Authorization('admin'), AdminController.removeStudentInClass);
AdminRouter.delete("/class/:id/removeall", VerifyAccessToken, Authorization('admin'), AdminController.removeAllStudentsInClass);

//search
AdminRouter.get("/search/student/:id", VerifyAccessToken, Authorization("admin"), AdminController.searchStudentByID);
AdminRouter.get("/search/teacher/:id", VerifyAccessToken, Authorization("admin"), AdminController.searchTeacherByID);
export default AdminRouter;