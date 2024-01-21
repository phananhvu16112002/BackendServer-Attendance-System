import { AppDataSource } from "../config/db.config";
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
}

export default new StudentClassService();