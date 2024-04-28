"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AdminController_1 = __importDefault(require("../controllers/AdminController"));
const Authorization_1 = __importDefault(require("../middlewares/Authorization"));
const StudentClassController_1 = __importDefault(require("../controllers/StudentClassController"));
const verifyAccessToken_1 = __importDefault(require("../middlewares/verifyAccessToken"));
const AdminRouter = express_1.default.Router();
AdminRouter.post("/login", AdminController_1.default.login);
AdminRouter.post("/submit/teachers", verifyAccessToken_1.default, (0, Authorization_1.default)('admin'), AdminController_1.default.uploadTeachers);
AdminRouter.post("/submit/students", verifyAccessToken_1.default, (0, Authorization_1.default)('admin'), AdminController_1.default.uploadStudents);
AdminRouter.post("/submit/courses", verifyAccessToken_1.default, (0, Authorization_1.default)('admin'), AdminController_1.default.uploadCourses);
AdminRouter.post("/submit/classes", verifyAccessToken_1.default, (0, Authorization_1.default)('admin'), AdminController_1.default.uploadClasses);
AdminRouter.get("/teachers", verifyAccessToken_1.default, (0, Authorization_1.default)('admin'), AdminController_1.default.getTeachers);
AdminRouter.get("/students", verifyAccessToken_1.default, (0, Authorization_1.default)('admin'), AdminController_1.default.getStudents);
AdminRouter.get("/courses", verifyAccessToken_1.default, (0, Authorization_1.default)('admin'), AdminController_1.default.getCourses);
AdminRouter.get("/courses/:id/classes", verifyAccessToken_1.default, (0, Authorization_1.default)('admin'), AdminController_1.default.getClassesByCourseID);
AdminRouter.get("/classes", verifyAccessToken_1.default, (0, Authorization_1.default)('admin'), AdminController_1.default.getClasses);
AdminRouter.post("/submit/teacher", verifyAccessToken_1.default, (0, Authorization_1.default)('admin'), AdminController_1.default.postTeacher);
AdminRouter.post("/submit/student", verifyAccessToken_1.default, (0, Authorization_1.default)('admin'), AdminController_1.default.postStudent);
AdminRouter.post("/submit/course", verifyAccessToken_1.default, (0, Authorization_1.default)('admin'), AdminController_1.default.postCourse);
AdminRouter.post("/submit/studentclass", verifyAccessToken_1.default, (0, Authorization_1.default)('admin'), AdminController_1.default.addStudentInClass);
AdminRouter.put("/edit/student/:id", verifyAccessToken_1.default, (0, Authorization_1.default)('admin'), AdminController_1.default.editStudent);
AdminRouter.put("/edit/teacher/:id", verifyAccessToken_1.default, (0, Authorization_1.default)('admin'), AdminController_1.default.editTeacher);
AdminRouter.put("/edit/course/:id", verifyAccessToken_1.default, (0, Authorization_1.default)('admin'), AdminController_1.default.editCourse);
AdminRouter.put("/edit/class/:id", verifyAccessToken_1.default, (0, Authorization_1.default)('admin'), AdminController_1.default.editClass);
AdminRouter.get("/classes/:id", verifyAccessToken_1.default, (0, Authorization_1.default)('admin'), AdminController_1.default.getStudentsByClassID);
AdminRouter.put("/classes/:id/uploadstudents", verifyAccessToken_1.default, (0, Authorization_1.default)('admin'), AdminController_1.default.uploadMoreStudentsToClass);
//pagination
AdminRouter.get("/courses/page/:page", verifyAccessToken_1.default, (0, Authorization_1.default)('admin'), AdminController_1.default.getCoursesWithPagination);
AdminRouter.get("/courses/:id/classes/page/:page", verifyAccessToken_1.default, (0, Authorization_1.default)('admin'), AdminController_1.default.getClassesByCourseIDWithPagination);
AdminRouter.get("/classes/page/:page", verifyAccessToken_1.default, (0, Authorization_1.default)('admin'), AdminController_1.default.getClassesWithPagination);
//delete
AdminRouter.delete("/course/:id", verifyAccessToken_1.default, (0, Authorization_1.default)("admin"), AdminController_1.default.deleteCourse);
AdminRouter.delete("/class/:id", verifyAccessToken_1.default, (0, Authorization_1.default)("admin"), AdminController_1.default.deleteClass);
AdminRouter.delete("/teacher/:id", verifyAccessToken_1.default, (0, Authorization_1.default)("admin"), AdminController_1.default.deleteTeacher);
AdminRouter.delete("/student/:id", verifyAccessToken_1.default, (0, Authorization_1.default)("admin"), AdminController_1.default.deleteStudent);
AdminRouter.delete("/class/:classid/student/:studentid", verifyAccessToken_1.default, (0, Authorization_1.default)('admin'), AdminController_1.default.removeStudentInClass);
AdminRouter.delete("/class/:id/removeall", verifyAccessToken_1.default, (0, Authorization_1.default)('admin'), AdminController_1.default.removeAllStudentsInClass);
//search
AdminRouter.get("/search/student/:id", verifyAccessToken_1.default, (0, Authorization_1.default)("admin"), AdminController_1.default.searchStudentByID);
AdminRouter.get("/search/teacher/:id", verifyAccessToken_1.default, (0, Authorization_1.default)("admin"), AdminController_1.default.searchTeacherByID);
exports.default = AdminRouter;
