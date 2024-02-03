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

    getClassByIDWithStudents = async (classID) => {
        try {
            return await classRepository.findOne({
                where : {classID : classID},
                relations : {studentClass : true}
            });
        } catch (e) {
            return null;
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

    getClassesWithCoursesByTeacherID = async (teacherID) => {
        try {
            return await classRepository.find({where : {
                teacher : {
                    teacherID : teacherID
                },
            }, relations: {course : true}})
        } catch (e) {
            console.log(e);
            return null;
        }
    }
}

export default new ClassService();