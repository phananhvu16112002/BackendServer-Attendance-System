import { AppDataSource } from "../config/db.config";
import { Classes } from "../models/Classes";

const classRepository = AppDataSource.getRepository(Classes);

class ClassService {
    getClassByID = async (classID) => {
        try {
            return await classRepository.findOne(classID);
        } catch (e) {
            return null;
        }
    }


}

export default new ClassService();