import bcrypt from "bcrypt";
import compareCaseInsentitive from "../utils/CompareCaseInsentitive";
import { AppDataSource } from "../config/db.config";
import { Employee } from "../models/Employee";

const adminRepository = AppDataSource.getRepository(Employee);
class AdminService {
    checkAdminExist = async (email) => {
        try {
            let admin = await adminRepository.findOneBy({
                employeeEmail: email
            });
            return admin;
        } catch(e) {
            return null;
        }
    }
    //testable
    login = async (admin, email, password) => {
        try {
            let result = await bcrypt.compare(password, admin.employeeHashedPassword);
            if (compareCaseInsentitive(email, admin.employeeEmail) && result){
                return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    }
}

export default new AdminService();