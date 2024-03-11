import { AppDataSource } from "../config/db.config";
import { StudentClass } from "../models/StudentClass";
import { Course } from "../models/Course";
import { Teacher } from "../models/Teacher";
import { AttendanceDetail } from "../models/AttendanceDetail";
import { Classes } from "../models/Classes";
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
    
    //         return await StudentClassDTO.injectTotalDetails(studentClasses);

    //     } catch (e) {
    //         return null;
    //     }
    // }

    checkStudentEnrolledInClass = async (studentID, classID) => {
        try {
            let data = await studentClassRepository.findOne({
                where: {
                    studentDetail: studentID,
                    classDetail: classID
                }
            });
            return {data, error: null};
        } catch (e){
            return {data: null, error: "Failed fetching data"};
        }
    }

    //oke used in studentcontroller
    getClassesByStudentID = async (studentID) => {
        try {
            let data = await studentClassRepository.createQueryBuilder("student_class"). 
                innerJoinAndMapOne('student_class.classDetail', Classes, 'classes', "student_class.classID = classes.classID").
                innerJoinAndMapOne('classes.course', Course, 'course', "course.courseID = classes.courseID").
                innerJoinAndMapOne('classes.teacher', Teacher, 'teacher', "classes.teacherID = teacher.teacherID").
                innerJoinAndMapMany('student_class.attendancedetails', AttendanceDetail, "attendancedetail", "attendancedetail.studentID = student_class.studentID AND student_class.classID = attendancedetail.classDetail").
                select('student_class.*').addSelect('COUNT(*) as Total').addSelect(`SUM(CASE WHEN result = 1 THEN 1 ELSE 0 END) AS TotalPresence`,).
                addSelect(`SUM(CASE WHEN result = 0 THEN 1 ELSE 0 END) AS TotalAbsence`,).addSelect(`SUM(CASE WHEN result = 0.5 THEN 1 else 0 END) AS TotalLate`,).
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
                innerJoin(AttendanceDetail, "attendancedetails", "attendancedetails.studentID = student_class.studentID AND student_class.classID = attendancedetails.classDetail").
                innerJoinAndMapMany('student_class.attendancedetails', AttendanceDetail, "attendancedetail", "attendancedetail.studentID = student_class.studentID AND student_class.classID = attendancedetail.classDetail").
                select('student_class.*').addSelect('COUNT(attendancedetails.studentDetail) as Total').addSelect(`SUM(CASE WHEN attendancedetails.result = 1 THEN 1 ELSE 0 END) AS TotalPresence`,).
                addSelect(`SUM(CASE WHEN attendancedetails.result = 0 THEN 1 ELSE 0 END) AS TotalAbsence`,).addSelect(`SUM(CASE WHEN attendancedetails.result = 0.5 THEN 1 else 0 END) AS TotalLate`,).
                groupBy('student_class.studentID, attendancedetails.formID').addSelect('attendancedetails.*').
                //will be order by created date
                orderBy('student_class.studentID', 'ASC').addOrderBy('attendancedetails.dateAttendanced', 'ASC').
                where("student_class.classID = :id", {id : classID}).getRawMany()
            return {data: StudentClassDTO.listOfStudentsWithAttendanceDetails(data), error: null};
        } catch (e) {
            return {data: [], error: "Failed fecthing"};
        }
    }
}

export default new StudentClassService();