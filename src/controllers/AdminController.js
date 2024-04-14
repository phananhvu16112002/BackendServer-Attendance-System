import 'dotenv/config';
import jwt from "jsonwebtoken";
import ExcelService from '../services/ExcelService';
import StudentService from '../services/StudentService';
import CourseService from '../services/CourseService';
import { v4 as uuidv4 } from 'uuid';
import { StudentClass } from '../models/StudentClass';
import { AppDataSource } from '../config/db.config';
import { Classes } from '../models/Classes';
import { Student } from '../models/Student';
import ClassService from '../services/ClassService';
import StudentClassService from '../services/StudentClassService';
import TeacherService from '../services/TeacherService';
import AdminService from '../services/AdminService';
//$2b$10$Jy/x6brNkjrtIpPRRbHrQu8jh8k8o.l9qXPxAORF6G9fFAvmHr4JO //520h0380password!
//$2b$10$jf1lWevTaxoTjvYTr34l9.qDb0ZQoDNGFUK2uj2DPdrA7pXrgOc2G //520h0696password!
const studentClassRepository = AppDataSource.getRepository(StudentClass);

class AdminController {
    login = async (req,res) => {
        try {
            const email = req.body.email;
            const password = req.body.password;

            let admin = await AdminService.checkAdminExist(email);
            if (admin == null){
                return res.status(422).json({message : "Account does not exist"});
            }
            if (await AdminService.login(admin, email, password) == false){
                return res.status(422).json({message: "Email or password incorrect"});
            }

            const accessToken = jwt.sign({userID: email, role: "admin"}, process.env.ACCESS_TOKEN_SECRET,{ expiresIn: '1m' });
            const refreshToken = jwt.sign({userID: email, role: "admin"}, process.env.REFRESH_TOKEN_SECRET,{ expiresIn: '30m' });

            return res.status(200).json({
                message:"Login Successfully", 
                refreshToken: refreshToken, 
                accessToken: accessToken,
                adminEmail: admin.adminEmail
            });
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    //oke
    uploadStudents = async (req,res) => {
        try {
            const excelFile = req.files.file;
            let {data, error} = await ExcelService.readStudentsFromExcel(excelFile);
            if (error){
                return res.status(503).json({message: error});
            }
            if (data.length == 0){
                return res.status(204).json({message: "No content found in this excel"});
            }
            let {data: result, error: err} = await StudentService.loadStudentsToDatabase(data);
            if (err){
                return res.status(503).json({message: err});
            }
            return res.status(200).json({data: data, message: `Upload students successfully. Row insert ${result.length}`});
        } catch (e) {
            return res.status(500).json({message: "Internal Server"});
        }
    }

    //oke
    uploadTeachers = async (req,res) => {
        try {
            const excelFile = req.files.file;
            let {data, error} = await ExcelService.readTeachersFromExcel(excelFile);
            if (error){
                return res.status(503).json({message: error});
            }
            if (data.length == 0){
                return res.status(204).json({message: "No content found in this excel"});
            }
            let {data: result, error: err} = await TeacherService.loadTeachersToDatabase(data);
            if (err){
                return res.status(503).json({message: err});
            }
            return res.status(200).json({data: data, message: `Upload teachers successfully. Row insert ${result.length}`});
        } catch (e) {
            return res.status(500).json({message: "Internal Server"});
        }
    }

    //oke
    uploadCourses = async (req,res) => {
        try {
            const excelFile = req.files.file;
            let {data, error} = await ExcelService.readCoursesFromExcel(excelFile);
            if (error){
                return res.status(503).json({message: error});
            }
            if (data.length == 0){
                return res.status(204).json({message: "No content found in this excel"});
            }
            let {data: result, error: err} = await CourseService.loadCoursesToDatabase(data);
            if (err){
                return res.status(503).json({message: err});
            }
            if (result.length == 0){
                return res.status(204).json({message: "No content"});
            }
            return res.status(200).json({data: result, message: "Uploading course successfully"});
        } catch (e) {
            return res.status(500).json({message: "Internal Server"});
        }
    }

    //oke
    uploadClasses = async (req,res) => {
        try {
            const courseID = req.body.courseID;
            const teacherID = req.body.teacherID;
            const classID = uuidv4();
            const roomNumber = req.body.roomNumber;
            const shiftNumber = req.body.shiftNumber;
            const startTime = req.body.startTime;
            const endTime = req.body.endTime;
            const classType = req.body.classType; // Lecture or Laboratory
            const group = req.body.group;
            const subGroup = req.body.subGroup;

            const fileExcel = req.files.file;

            let {data, error} = await ExcelService.readStudentsInClassFromExcel(fileExcel, classID);
            if (error){
                return res.status(503).json({message: error});
            }
            if (data.length == 0){
                return res.status(204).json({message: "No content found in this excel"});
            }

            let classes = new Classes();
            classes.classID = classID;
            classes.roomNumber = roomNumber;
            classes.shiftNumber = shiftNumber;
            classes.startTime = startTime;
            classes.endTime = endTime;
            classes.classType = classType;
            classes.group = group;
            classes.subGroup = subGroup;
            classes.course = courseID;
            classes.teacher = teacherID;

            if (await StudentClassService.uploadClass(classes, data)){
                let {data: result, error: err} = await ClassService.getClassesByID(classID);
                if (err){
                    return res.status(503).json({message: err});
                }
                return res.status(200).json({data: result, message: "Class was formed"});
            }
            return res.status(503).json({message: "Failed creating class"});
        } catch (e) {
            console.log(e);
            return res.status(500).json({message: "Internal Server"});
        }
    }

    //testable
    getCourses = async (req,res) => {
        try {   
            let {data, error} = await CourseService.getCourses();
            if (error){
                return res.status(503).json({message: error});
            }
            if (data.length == 0){
                return res.status(204).json({message: "No content found in this excel"});
            }
            return res.status(200).json(data);
        } catch (e) {
            console.log(e);
            return res.status(500).json({message: "Internal Server"});
        }
    }

    //testable
    getClassesByCourseID = async (req,res) => {
        try {
            const courseID = req.params.id;
            let {data, error} = await ClassService.getClassesWithCourseAndTeacherByCourseID(courseID);

            if (error){
                return res.status(503).json({message: error});
            }
            if (data.length == 0){
                return res.status(204).json({message: "No content found in this excel"});
            }
            return res.status(200).json(data);
        } catch (e) {
            console.log(e);
            return res.status(500).json({message: "Internal Server"});
        }
    }

    //testabel
    getClasses = async (req,res) => {
        try {
            let {data, error} = await ClassService.getClasses();
            if (error){
                return res.status(503).json({message: error});
            }
            if (data.length == 0){
                return res.status(204).json({message: "No content found in this excel"});
            }
            return res.status(200).json(data);
        } catch (e) {
            console.log(e);
            return res.status(500).json({message: "Internal Server"});
        }
    }

    //testable
    getStudents = async (req,res) => {
        try {
            let {data,error} = await StudentService.getStudents();
            if (error){
                return res.status(503).json({message: error});
            }
            if (data.length == 0){
                return res.status(204).json({message: "No content found in this excel"});
            }
            return res.status(200).json(data);
        } catch (e) {
            console.log(e);
            return res.status(500).json({message: "Internal Server"});
        }
    }

    //testable
    getTeachers = async (req,res) => {
        try {
            let {data,error} = await TeacherService.getTeachers();
            if (error){
                return res.status(503).json({message: error});
            }
            if (data.length == 0){
                return res.status(204).json({message: "No content found in this excel"});
            }
            return res.status(200).json(data);
        } catch (e) {
            console.log(e);
            return res.status(500).json({message: "Internal Server"});
        }
    }

    //testable
    postStudent = async (req,res) => {
        try {
            const studentID = req.body.studentID;
            const studentName = req.body.studentName;
            const studentEmail = req.body.studentEmail;

            let {data, error} = await StudentService.postStudent(studentID, studentName, studentEmail);
            if (error){
                return res.status(503).json({message: error});
            }
            if (data == null){
                return res.status(204).json({message: "No content"});
            }
            return res.status(200).json(data);
        } catch (e) {
            console.log(e);
            return res.status(500).json({message: "Internal Server"});
        }
    }

    //testable
    postTeacher = async (req,res) => {
        try {
            const teacherID = req.body.teacherID;
            const teacherName = req.body.teacherName;
            const teacherEmail = req.body.teacherEmail;

            let {data, error} = await TeacherService.postTeacher(teacherID, teacherName, teacherEmail);
            if (error){
                return res.status(503).json({message: error});
            }
            if (data == null){
                return res.status(204).json({message: "No content"});
            }
            return res.status(200).json(data);
        } catch (e) {
            console.log(e);
            return res.status(500).json({message: "Internal Server"});
        }
    }

    //testalbe
    postCourse = async (req,res) => {
        try {
            const courseID = req.body.courseID;
            const courseName = req.body.courseName;
            const totalWeeks = req.body.totalWeeks;
            const requiredWeeks = req.body.requiredWeeks;
            const credit = req.body.credit;

            let {data, error} = await CourseService.postCourse(courseID, courseName, totalWeeks, requiredWeeks, credit);
            if (error){
                return res.status(503).json({message: error});
            }
            if (data == null){
                return res.status(204).json({message: "No content"});
            }
            return res.status(200).json(data);
        } catch (e) {
            console.log(e);
            return res.status(500).json({message: "Internal Server"});
        }
    }

    //must test
    editStudent = async (req,res) => {
        try {
            let studentName = req.body.studentName;
            let studentID = req.params.id;
            if (await StudentService.editStudent(studentID, studentName)){
                return res.status(200).json({message: "Edit successfully"});
            }
            return res.status(503).json({message: "Failed editing"});
        } catch (e) {
            return res.status(500).json({message: "Internal Server"});
        }
    }

    //must test
    editTeacher = async (req,res) => {
        try {
            let teacherName = req.body.teacherName;
            let teacherID = req.params.id;
            if (await TeacherService.editTeacher(teacherID, teacherName)){
                return res.status(200).json({message: "Edit successfully"});
            }
            return res.status(503).json({message: "Failed editing"});
        } catch (e) {
            return res.status(500).json({message: "Internal Server"});
        }
    }

    //must test
    editCourse = async (req,res) => {
        try {
            let courseID = req.params.id;
            let courseName = req.body.courseName;
            let totalWeeks = req.body.totalWeeks;
            let requiredWeeks = req.body.requiredWeeks;
            let credit = req.body.credit;
            if (await CourseService.editCourse(courseID, courseName, totalWeeks, requiredWeeks, credit)){
                return res.status(200).json({message: "Edit successfully"});
            }
            return res.status(503).json({message: "Failed editing"});
        } catch (e) {
            return res.status(500).json({message: "Internal Server"});
        }
    }

    //must test
    editClass = async (req,res) => {
        try {
            let classID = req.params.id;
            let roomNumber = req.body.roomNumber;
            let shiftNumber = req.body.shiftNumber;
            let startTime = req.body.startTime;
            let endTime = req.body.endTime;
            let classType = req.body.classType;
            let group = req.body.group;
            let subGroup = req.body.subGroup;
            let courseID = req.body.courseID;
            let teacherID = req.body.teacherID;
            if (await ClassService.editClass(classID, roomNumber, shiftNumber, startTime, endTime, classType, 
            group, subGroup, courseID, teacherID)){
                return res.status(200).json({message: "Edit successfully"});
            }
            return res.status(503).json({message: "Failed editing"});
        } catch (e) {
            return res.status(500).json({message: "Internal Server"});
        }
    }

    //must test
    getCoursesWithPagination = async (req,res) => {
        try {  
            let page = req.params.page; 
            let {data, error} = await CourseService.getCoursesWithPagination(page);
            if (error){
                return res.status(503).json({message: error});
            }
            if (data.length == 0){
                return res.status(204).json({message: "No content found in this excel"});
            }
            return res.status(200).json(data);
        } catch (e) {
            console.log(e);
            return res.status(500).json({message: "Internal Server"});
        }
    }

    //testable
    getClassesByCourseIDWithPagination = async (req,res) => {
        try {
            const courseID = req.params.id;
            let page = req.params.page;
            let {data, error} = await ClassService.getClassesWithCourseAndTeacherByCourseIDWithPagination(courseID, page);

            if (error){
                return res.status(503).json({message: error});
            }
            if (data.length == 0){
                return res.status(204).json({message: "No content found in this excel"});
            }
            return res.status(200).json(data);
        } catch (e) {
            console.log(e);
            return res.status(500).json({message: "Internal Server"});
        }
    }

    //must test
    getClassesWithPagination = async (req,res) => {
        try {
            let page = req.params.page; 
            let {data, error} = await ClassService.getClassesWithPagination(page);
            if (error){
                return res.status(503).json({message: error});
            }
            if (data.length == 0){
                return res.status(204).json({message: "No content found in this excel"});
            }
            return res.status(200).json(data);
        } catch (e) {
            console.log(e);
            return res.status(500).json({message: "Internal Server"});
        }
    }
}

export default new AdminController();