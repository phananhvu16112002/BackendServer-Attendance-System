import { Student } from "../models/Student";
import { Teacher } from "../models/Teacher";
import { Course } from "../models/Course";
import { Classes } from "../models/Classes";
import { StudentClass } from "../models/StudentClass";
import { AppDataSource } from "../config/db.config";
import JSDatetimeToMySQLDatetime from "../utils/TimeConvert";

class Test {
    testCreateStudentTable = async (req,res) => {
        try{
            let s1 = new Student();
            s1.studentName = "Ho Tuan Kiet"
            s1.studentEmail = "520h0380@student.tdtu.edu.vn"
            s1.studentID = "520H0380"

            let s2 = new Student();
            s2.studentName = "Phan Anh Vu"
            s2.studentEmail = "520h0696@student.tdtu.edu.vn"
            s2.studentID = "520h0696"

            let studentRepository = AppDataSource.getRepository(Student);
            await studentRepository.save(s1);
            await studentRepository.save(s2);
            res.json("success");
        }catch{
            console.log("Error in the database");
            res.json("failed");
        }
    }

    testCreateCourseTable = async (req,res) => {
        try{
            let c1 = new Course();
            c1.courseID = "503111"
            c1.courseName = "Cross-platform Programming"
            c1.credit = 3
            c1.requiredWeeks = 8
            c1.totalWeeks = 10

            let c2 = new Course();
            c2.courseID = "502111"
            c2.courseName = "Introduction to programming"
            c2.credit = 3
            c2.requiredWeeks = 8 
            c2.totalWeeks = 10

            let courseRepository = AppDataSource.getRepository(Course);
            await courseRepository.save(c1);
            await courseRepository.save(c2);
            
            res.json("success");
        }catch{
            console.log("Error in the database");
            res.json("failed");
        }
    }

    testCreateTeacherTable = async (req,res) => {
        try{
            let t1 = new Teacher();
            t1.teacherName = "Mai Van Manh"
            t1.teacherEmail = "maivanmanh@lecturer.tdtu.edu.vn"
            t1.teacherID = "333h222"

            let t2 = new Teacher();
            t2.teacherName = "Manh Van Mai"
            t2.teacherEmail = "manhvanmai@lecturer.tdtu.edu.vn"
            t2.teacherID = "222h333"

            let teacherRepository = AppDataSource.getRepository(Teacher);
            await teacherRepository.save(t1);
            await teacherRepository.save(t2);
            res.json("success");
        }catch{
            console.log("Error in the database");
            res.json("failed");
        }
    }

    testCreateClassTable = async (req,res) => {
        try{
            let classes = new Classes()
            classes.classID = "520300_09_t01";
            classes.classType = "lecture"; 
            classes.course = await AppDataSource.getRepository(Course).findOneBy({courseID: "503111"});
            classes.endTime = JSDatetimeToMySQLDatetime(new Date());
            classes.group = "09";
            classes.roomNumber = "A503"; 
            classes.shiftNumber = "3";
            classes.startTime = JSDatetimeToMySQLDatetime(new Date());
            classes.subGroup = "01";
            classes.teacher = await AppDataSource.getRepository(Teacher).findOneBy({teacherID: "333h222"});
            await AppDataSource.getRepository(Classes).save(classes);

            let studentClass = new StudentClass()
            studentClass.student = await AppDataSource.getRepository(Student).findOneBy({studentID: "520H0380"})
            studentClass.classes = classes
            console.log(studentClass)
            await AppDataSource.getRepository(StudentClass).save(studentClass);
            res.json("success");
        }catch{
            console.log("Error in the database");
            res.json("failed");
        }
    }

    testCreateFormTable = async (req,res) => {
        
    }

    testGetStudent = async (req,res) => {
        let st = await AppDataSource.getRepository(Student).findOne({where: {studentID: "520H0380"}, relations: {studentClass: true}})
        console.log(st);
        res.json(st);
    }

    testGetTeacher = async (req,res) => {
        let teacher = await AppDataSource.getRepository(Teacher).findOne({where: {teacherID: "333h222"}, relations: {classes: true}});
        console.log(teacher)
        res.json(teacher)
    }

    testGetCourse = async (req,res) => {
        let course = await AppDataSource.getRepository(Course).findOne({where: {courseID: "503111"}, relations: {classes : true}});
        console.log(course)
        res.json(course);
    }

    testGetClasses = async (req,res) => {
        let classes = await AppDataSource.getRepository(Classes).findOneBy({classID: "520300_09_t01"})
        console.log(classes);
        res.json(classes);
    }
}

export default new Test();