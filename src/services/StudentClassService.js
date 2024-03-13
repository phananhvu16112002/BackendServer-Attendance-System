import { AppDataSource } from "../config/db.config";
import { StudentClass } from "../models/StudentClass";
import { Course } from "../models/Course";
import { Teacher } from "../models/Teacher";
import { AttendanceDetail } from "../models/AttendanceDetail";
import { Classes } from "../models/Classes";
import { Student } from "../models/Student";
import StudentClassDTO from "../dto/StudentClassDTO";


const studentClassRepository = AppDataSource.getRepository(StudentClass);

class StudentClassService {
    getStudentClass = async (studentID, classID) => {
        try {
            return await studentClassRepository.findOne({
                where : {
                    studentDetail : studentID, 
                    classDetail : classID
                },
                relations : {
                    studentDetail : true,
                    classDetail : true
                }
            });
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    // getClassesByStudentID = async (studentID) => {
    //     try {
    //         const studentClasses = await studentClassRepository.find({
    //             where: {studentDetail : studentID},
    //             select : {
    //                 studentDetail : {
    //                     studentID : true,
    //                 },
    //                 classDetail : {
    //                     classID : true,
    //                     roomNumber : true,
    //                     shiftNumber : true,
    //                     classType : true,
    //                     group : true,
    //                     subGroup : true,
    //                     teacher : {
    //                         teacherID : true,
    //                         teacherName : true
    //                     },
    //                     course : {
    //                         courseID : true,
    //                         courseName : true,
    //                         totalWeeks : true
    //                     }
    //                 }
    //             },
    //             relations: {
    //                 studentDetail: true,
    //                 classDetail : {
    //                     teacher : true,
    //                     course : true,
    //                 }
    //             }
    //         });
    
    //         // return 
    //         return {data:await StudentClassDTO.injectTotalDetails(studentClasses), error: null};

    //     } catch (e) {
    //         return null;
    //     }
    // }

    //oke used in studentcontroller
    // getClassesByStudentID = async (studentID) => {
    //     try {
    //         let data = await studentClassRepository.createQueryBuilder("student_class"). 
    //             innerJoinAndMapOne('student_class.classDetail', Classes, 'classes', "student_class.classID = classes.classID").
    //             innerJoinAndMapOne('classes.course', Course, 'course', "course.courseID = classes.courseID").
    //             innerJoinAndMapOne('classes.teacher', Teacher, 'teacher', "classes.teacherID = teacher.teacherID").
    //             innerJoinAndMapMany('student_class.attendancedetails', AttendanceDetail, "attendancedetail", "attendancedetail.studentID = student_class.studentID AND student_class.classID = attendancedetail.classDetail").
    //             select('student_class.*').addSelect('COUNT(*) as Total').addSelect(`SUM(CASE WHEN result = 1 THEN 1 ELSE 0 END) AS TotalPresence`,).
    //             addSelect(`SUM(CASE WHEN result = 0 THEN 1 ELSE 0 END) AS TotalAbsence`,).addSelect(`SUM(CASE WHEN result = 0.5 THEN 1 else 0 END) AS TotalLate`,).
    //             addSelect('classes.*').addSelect('course.*').addSelect('teacher.teacherID, teacher.teacherEmail ,teacher.teacherName').
    //             groupBy('student_class.classID').
    //             where("student_class.studentID = :id", {id : studentID}).
    //             getRawMany();
        
    //         return {data, error: null};
    //     } catch(e){
    //         return {data: null, error: "Fetching failed"};
    //     }
    // }

    //oke used in studentcontroller
    getClassesByStudentID = async (studentID) => {
        try {
            // const studentID = studentID;
            let data = await studentClassRepository.createQueryBuilder("student_class"). 
            innerJoinAndMapOne('student_class.classDetail', Classes, 'classes', "student_class.classID = classes.classID").
            innerJoinAndMapOne('classes.course', Course, 'course', "course.courseID = classes.courseID").
            innerJoinAndMapOne('classes.teacher', Teacher, 'teacher', "classes.teacherID = teacher.teacherID").
            leftJoinAndMapMany('student_class.attendancedetails', AttendanceDetail, "attendancedetail", "attendancedetail.studentID = student_class.studentID AND student_class.classID = attendancedetail.classDetail").
            select('student_class.*').addSelect('COUNT(attendancedetail.formID) as total').addSelect(`SUM(CASE WHEN result = 1 THEN 1 ELSE 0 END) AS totalPresence`,).
            addSelect(`SUM(CASE WHEN result = 0 THEN 1 ELSE 0 END) AS totalAbsence`,).addSelect(`SUM(CASE WHEN result = 0.5 THEN 1 else 0 END) AS totalLate`,).
            addSelect('classes.*').addSelect('course.*').addSelect('teacher.teacherID, teacher.teacherEmail ,teacher.teacherName').
            groupBy('student_class.classID').
            where("student_class.studentID = :id", {id : studentID}).
            getRawMany();
    
        return {data, error: null};
        } catch(e){
            return {data: null, error: "Fetching failed"};
        }
    }

    //oke used in studentcontroller
    getStudentsAttendanceDetailsByClassID = async (classID) => {
        try {
            let data = await studentClassRepository.createQueryBuilder("student_class"). 
                innerJoinAndMapOne("student_class.student", Student, "student", "student.studentID = student_class.studentID").
                innerJoinAndMapMany('student_class.attendancedetails', AttendanceDetail, "attendancedetail", "attendancedetail.studentID = student_class.studentID AND student_class.classID = attendancedetail.classDetail").
                //will be sorted by created date
                orderBy('attendancedetail.dateAttendanced', 'ASC').
                where("student_class.classID = :id", {id : classID}).getMany();
            return {data: data, error: null};
        } catch (e) {
            return {data: [], error: "Failed fecthing"};
        }
    }
}

export default new StudentClassService();