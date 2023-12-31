import { Student } from "../models/Student";
import { Teacher } from "../models/Teacher";
import { Course } from "../models/Course";
import { Classes } from "../models/Classes";
import { StudentClass } from "../models/StudentClass";
import { AppDataSource } from "../config/db.config";
import JSDatetimeToMySQLDatetime from "../utils/TimeConvert";
import { AttendanceForm } from "../models/AttendanceForm";
import { AttendanceDetail } from "../models/AttendanceDetail";
import { time } from "console";

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
            //Tao lop hoc
            ///Lop ly thuyet
            let classes = new Classes()
            classes.classID = "520300_09_t0133";
            classes.classType = "thesis"; 
            classes.course = await AppDataSource.getRepository(Course).findOneBy({courseID: "502111"});
            classes.endTime = JSDatetimeToMySQLDatetime(new Date());

            classes.group = "09";
            classes.roomNumber = "A0503"; 
            classes.shiftNumber = "4";
            classes.startTime = JSDatetimeToMySQLDatetime(new Date());
            classes.subGroup = "08";
            classes.teacher = await AppDataSource.getRepository(Teacher).findOneBy({teacherID: "222h333"});
            
            //Lop thuc hanh
            let classes2 = new Classes()
            classes2.classID = "5202111_09_t000";
            classes2.classType = "laboratory"; 
            classes2.course = await AppDataSource.getRepository(Course).findOneBy({courseID: "502111"});

            classes2.endTime = JSDatetimeToMySQLDatetime(new Date());
            classes2.group = "09";
            classes2.roomNumber = "A0506"; 
            classes2.shiftNumber = "2";
            classes2.startTime = JSDatetimeToMySQLDatetime(new Date());
            classes2.subGroup = "00";
            classes2.teacher = await AppDataSource.getRepository(Teacher).findOneBy({teacherID: "222h333"});
            

            let classRepository = AppDataSource.getRepository(Classes);
            await classRepository.save(classes);
            await classRepository.save(classes2);

            //Ket noi student va class trong StudentClass
            let studentClass = new StudentClass()
            studentClass.studentID = await AppDataSource.getRepository(Student).findOneBy({studentID: "520H0380"})
            studentClass.classesID = classes

            let studentClass2 = new StudentClass()
            studentClass2.studentID = await AppDataSource.getRepository(Student).findOneBy({studentID: "520H0380"})
            studentClass2.classesID = classes2

            await AppDataSource.getRepository(StudentClass).save(studentClass);
            await AppDataSource.getRepository(StudentClass).save(studentClass2);
            res.status(200).json("success");
        }catch{
            console.log("Error in the database");
            res.json("failed");
        }
    }

    testCreateFormTable = async (req,res) => {

        //form diem danh lan 1 cua lop 520300_09_t0133
        let attendanceForm = new AttendanceForm()
        attendanceForm.formID = "formID1"
        attendanceForm.classes = await AppDataSource.getRepository(Classes).findOneBy({classID: "520300_09_t0133"})
        attendanceForm.status = true
        attendanceForm.weekNumber = 1

        let timeAttendance = new Date();
        timeAttendance.setMinutes(timeAttendance.getMinutes() + 5)

        let timeEnd = new Date()
        timeEnd.setMinutes(timeEnd.getMinutes() + 10);

        attendanceForm.dateOpen = JSDatetimeToMySQLDatetime(timeAttendance)
        attendanceForm.startTime = JSDatetimeToMySQLDatetime(new Date())
        attendanceForm.endTime = JSDatetimeToMySQLDatetime(timeEnd)
        //form diem danh lan 2 cua lop 520300_09_t0133
        let attendanceForm2 = new AttendanceForm()
        attendanceForm2.formID = "formID2"
        attendanceForm2.classes = await AppDataSource.getRepository(Classes).findOneBy({classID: "520300_09_t0133"})
        attendanceForm2.status = true
        attendanceForm2.weekNumber = 2
        attendanceForm2.dateOpen = JSDatetimeToMySQLDatetime(timeAttendance)
        attendanceForm2.startTime = JSDatetimeToMySQLDatetime(new Date())
        attendanceForm2.endTime = JSDatetimeToMySQLDatetime(timeEnd)

        await AppDataSource.getRepository(AttendanceForm).save(attendanceForm);
        await AppDataSource.getRepository(AttendanceForm).save(attendanceForm2);
        res.json("success");
    }

    testTakeAttendance = async (req,res) => {
        let student = await AppDataSource.getRepository(Student).findOneBy({studentID: "520H0380"});
        let classes = await AppDataSource.getRepository(Classes).findOneBy({classID: "520300_09_t0133"});
        let studentClass = await AppDataSource.getRepository(StudentClass).findOneBy({studentID: student.studentID, classesID: classes.classID})

        //Take attendance formID1 cua sinh vien 520H0380 trong lop 520300_09_t0133
        let date = new Date();
        let attendanceDetail = new AttendanceDetail()
        attendanceDetail.dateAttendanced = JSDatetimeToMySQLDatetime(date)
        attendanceDetail.classes = studentClass
        attendanceDetail.studentDetail = studentClass
        attendanceDetail.attendanceForm = await AppDataSource.getRepository(AttendanceForm).findOneBy({formID: "formID1"})

        //Take attendance formID2
        let date2 = new Date();
        let attendanceDetail2 = new AttendanceDetail()
        attendanceDetail2.dateAttendanced = JSDatetimeToMySQLDatetime(date2)
        attendanceDetail2.classes = studentClass
        attendanceDetail2.studentDetail = studentClass
        attendanceDetail2.attendanceForm = await AppDataSource.getRepository(AttendanceForm).findOneBy({formID: "formID2"})

        await AppDataSource.getRepository(AttendanceDetail).save(attendanceDetail);
        await AppDataSource.getRepository(AttendanceDetail).save(attendanceDetail2);
        res.status(200).json("success");
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
        let classes = await AppDataSource.getRepository(Classes).findOne({where: {classID: "520300_09_t0133"}, relations: {studentClass: true, teacher: true, course: true}});
        classes.startTime = JSDatetimeToMySQLDatetime(new Date(classes.startTime));
        classes.endTime = JSDatetimeToMySQLDatetime(new Date(classes.endTime));  
        console.log(classes);
        res.json(classes);
    }

    testGetStudentClasses = async (req,res) => {
        let student = await AppDataSource.getRepository(Student).findOneBy({studentID: "520H0380"});
        let studentClass = await AppDataSource.getRepository(StudentClass).find({where: {studentID: student.studentID}, relations: {classesID: true}})

        for (let i = 0; i < studentClass.length; i++){
            let object = studentClass[i].classesID;
            let classes = await AppDataSource.getRepository(Classes).findOne({where: 
                {
                    classID: object.classID
                }, 
                select: {
                    teacher: {
                        teacherID: true,
                        teacherEmail: true,
                        teacherName: true
                    }, 
                    course: true, 
                },
                relations: {
                    teacher: true,
                    course: true
                }
            })

            classes.startTime = JSDatetimeToMySQLDatetime(new Date(classes.startTime));
            classes.endTime = JSDatetimeToMySQLDatetime(new Date(classes.endTime));

            studentClass[i].classesID = classes;
        }
        res.status(200).json(studentClass)
    }

    testGetAttendanceDetail = async (req,res) => {
        let student = await AppDataSource.getRepository(Student).findOneBy({studentID: "520H0380"});
        let classes = await AppDataSource.getRepository(Classes).findOneBy({classID: "520300_09_t0133"});
        let studentClass = await AppDataSource.getRepository(StudentClass).findOneBy({studentID: student.studentID, classesID: classes.classID})
        let attendanceDetail = await AppDataSource.getRepository(AttendanceDetail).find({where: {studentDetail: studentClass.studentID, classes: studentClass.classesID}, relations: {studentDetail: true}});
        for (let i = 0; i < attendanceDetail.length; i++){
            attendanceDetail[i].dateAttendanced = JSDatetimeToMySQLDatetime(new Date(attendanceDetail[i].dateAttendanced))
        }
        res.status(200).json(attendanceDetail);
    }   
}

export default new Test();