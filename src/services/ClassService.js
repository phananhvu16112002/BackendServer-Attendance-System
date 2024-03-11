import { AppDataSource, entityManager } from "../config/db.config";
import { Classes } from "../models/Classes";

const classRepository = AppDataSource.getRepository(Classes);
class ClassService {
    getClassByID = async (classID) => {
        try {
            return await classRepository.findOneBy({classID : classID});
        } catch (e) {
            return null;
        }
    }

    //oke used in attendance controller
    getClassByIDWithStudents = async (classID) => {
        try {
            let data = await classRepository.findOne({
                where : {classID : classID},
                relations : {studentClass : true}
            });
            return {data, error: null}
        } catch (e) {
            return {data: null, error: "Failed fecthing data"};
        }
    }

    getAllStudentsByClassID = async (classID) => {
        try {
            return null;
        } catch (e) {
            return null;
        }
    }

    getAllFormByClassID = async (classID) => {
        try {
            return await classRepository.findOne
            ({
                where: {
                    classID : classID
                },
                relations : {
                    attendanceForm : true
                }
            })

        } catch (e) {
            return null;
        }
    }

    getClassesByTeacherID = async (teacherID) => {
        try {
            return await classRepository.createQueryBuilder("classes").
            where("classes.teacherID = :teacherID", {teacherID : teacherID}). 
            getMany();
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    ////Oke used in ClassesController
    getClassesWithCoursesByTeacherID = async (teacherID) => {
        try {
            let data = await classRepository.find({where : {
                teacher : {
                    teacherID : teacherID
                },
            }, relations: {course : true}})

            return {data, error: null};
        } catch (e) {
            return {data: [], error: "Failed fetching data"};
        }
    }

    ////Oke used in StudentClassController
    getClassesWithStudentsCourseTeacher = async (classID) => {
        try {
            let data = await classRepository.findOne({
                where: {
                    classID: classID
                }, 
                select: {
                    teacher: {
                        teacherID: true,
                        teacherEmail: true,
                        teacherName: true
                    },
                    studentClass: {
                        studentDetail: {
                            studentID: true,
                            studentEmail: true,
                            studentName: true
                        }
                    }
                },
                relations: {
                    teacher: true,
                    course: true,
                    studentClass: {
                        studentDetail: true
                    }
                }
            });
            return {data, error: null};
        } catch (e) {
            return {data: null, error: "Failed fetching data"};
        }
    }
}

export default new ClassService();