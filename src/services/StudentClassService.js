import { AppDataSource } from "../config/db.config";
import { StudentClass } from "../models/StudentClass";
import { Course } from "../models/Course";
import { Teacher } from "../models/Teacher";
import { AttendanceDetail } from "../models/AttendanceDetail";
import { Classes } from "../models/Classes";
import { Student } from "../models/Student";
import StudentClassDTO from "../dto/StudentClassDTO";
import { StudentDeviceToken } from "../models/StudentDeviceToken";


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
                leftJoinAndMapMany('student_class.attendancedetails', AttendanceDetail, "attendancedetail", "attendancedetail.studentID = student_class.studentID AND student_class.classID = attendancedetail.classDetail").
                //will be sorted by created date
                orderBy('attendancedetail.createdAt', 'ASC').
                where("student_class.classID = :id", {id : classID}).getMany();
            return {data: data, error: null};
        } catch (e) {
            return {data: [], error: "Failed fecthing"};
        }
    }

    //oke
    getStudentsAttendanceDetailsWithDeviceTokenByClassID = async (classID) => {
        try {
            let data = await studentClassRepository.createQueryBuilder("student_class").
            innerJoinAndMapOne("student_class.student", Student, "student", "student.studentID = student_class.studentID").
            leftJoinAndMapMany("student_class.tokens", StudentDeviceToken, "tokens", "tokens.studentID = student_class.studentID").
            leftJoinAndMapMany('student_class.attendancedetails', AttendanceDetail, "attendancedetail", "attendancedetail.studentID = student_class.studentID AND student_class.classID = attendancedetail.classDetail").
            where("student_class.classID = :id", {id : classID}).getMany();
            return {data: data, error: null};
        } catch (e) {
            return {data: [], error: "Failed fetching"};
        }
    }

    //upload class for student 
    uploadClass = async (classes, studentclass) => {
        try {
            await AppDataSource.transaction(async (transactionalEntityManager) => {
                await transactionalEntityManager.save(classes);
                await transactionalEntityManager.save(studentclass);
            })
            return true;
        } catch (e) {
            return false;
        }
    }

    //must test
    uploadStudentsInClass = async (studentClass) => {
        try {
            await studentClassRepository.save(studentClass);
            return true;
        } catch (e) {
            return false;
        }
    }

    //must test
    getStudentsByClassID = async (classID) => {
        try {
            let data = await studentClassRepository.find({
                where: {
                    classDetail: classID
                }, 
                select: {
                    studentDetail: {
                        studentID: true,
                        studentEmail: true,
                        studentName: true
                    }
                },
                relations: {
                    studentDetail: true,
                    classDetail: false 
                }
            })
            return {data: data, error: null};
        } catch (e) {
            return {data: [], error: "Cannot fetch all the student inside this class"};
        }
    }

    //must test
    addStudentInClass = async (classID, studentID) => {
        try {
            let studentClass = new StudentClass();
            studentClass.classDetail = classID;
            studentClass.studentID = studentID;
            await studentClassRepository.insert(studentClass);
            return true;
        } catch (e) {
            return false;
        }
    }

    //must test
    removeStudentFromClass = async (classID, studentID) => {
        try {
            await studentClassRepository.delete({
                studentDetail: studentID,
                classDetail: classID
            })
            return true;
        } catch (e) {
            return false;
        }
    }

    //must test
    removeAllStudentsFromClass = async (classID) => {
        try {
            await studentClassRepository.delete({
                classDetail: classID
            })
            return true;
        } catch (e) {
            return false;
        }
    }
}

export default new StudentClassService();