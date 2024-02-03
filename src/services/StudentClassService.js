import { AppDataSource } from "../config/db.config";
import StudentClassDTO from "../dto/StudentClassDTO";
import { StudentClass } from "../models/StudentClass";

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

    getClassesByStudentID = async (studentID) => {
        try {
            const studentClasses = await studentClassRepository.find({
                where: {studentDetail : studentID},
                select : {
                    studentDetail : {
                        studentID : true,
                    },
                    classDetail : {
                        classID : true,
                        roomNumber : true,
                        shiftNumber : true,
                        classType : true,
                        group : true,
                        subGroup : true,
                        teacher : {
                            teacherID : true,
                            teacherName : true
                        },
                        course : {
                            courseID : true,
                            courseName : true,
                            totalWeeks : true
                        }
                    }
                },
                relations: {
                    studentDetail: true,
                    classDetail : {
                        teacher : true,
                        course : true,
                    }
                }
            });
    
            return await StudentClassDTO.injectTotalDetails(studentClasses);

        } catch (e) {
            return null;
        }
    }
}

export default new StudentClassService();