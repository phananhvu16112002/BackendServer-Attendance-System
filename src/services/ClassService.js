import { AppDataSource } from "../config/db.config";
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

    getAllStudentsByClassID = async (classID) => {
        try {
            return await classRepository.findOne
            ({
                where: {
                    classID : classID
                },
                relations : {
                    studentClass : true
                },
            })
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
}

export default new ClassService();