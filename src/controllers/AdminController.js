import 'dotenv/config';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
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
//$2b$10$Jy/x6brNkjrtIpPRRbHrQu8jh8k8o.l9qXPxAORF6G9fFAvmHr4JO //520h0380password!
//$2b$10$jf1lWevTaxoTjvYTr34l9.qDb0ZQoDNGFUK2uj2DPdrA7pXrgOc2G //520h0696password!
const studentClassRepository = AppDataSource.getRepository(StudentClass);

class AdminController {
    login = async (req,res) => {
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash("520h0380password!", salt)
        console.log(hashPassword);

        const salt2 = await bcrypt.genSalt(10);
        const hashedPassword2 = await bcrypt.hash("520h0696password!", salt2)
        console.log(hashedPassword2);
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
            return res.status(200).json({message: `Upload students successfully. Row insert ${result.length}`});
        } catch (e) {
            return res.status(500).json({message: "Internal Server"});
        }
    }

    //oke
    uploadTeachers = async (req,res) => {
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
            return res.status(200).json({message: `Upload teachers successfully. Row insert ${result.length}`});
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
            return res.status(200).json({message: `Upload teachers successfully. Row insert ${result.length}`});
        } catch (e) {
            return res.status(500).json({message: "Internal Server"});
        }
    }

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

            let {data, error} = await ExcelService.readStudentInClassFromExcel(fileExcel, classID);
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
                return res.status(200).json({message: "Class was formed"});
            }
            return res.status(503).json({message: "Failed creating class"});
        } catch (e) {
            console.log(e);
            return res.status(500).json({message: "Internal Server"});
        }
    }
}

export default new AdminController();