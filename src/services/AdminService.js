import bcrypt from "bcrypt";
import compareCaseInsentitive from "../utils/CompareCaseInsentitive";
import { AppDataSource } from "../config/db.config";
import { Admin } from "../models/Admin";

const adminRepository = AppDataSource.getRepository(Admin);

class AdminService {
    checkAdminExist = async (email) => {
        try {
            let admin = await adminRepository.findOneBy({
                adminEmail: email
            });
            return admin;
        } catch(e) {
            return null;
        }
    }
    //testable
    login = async (admin, email, password) => {
        try {
            let result = await bcrypt.compare(password, admin.adminHashedPassword);
            if (compareCaseInsentitive(email, admin.adminEmail) && result){
                return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    }
}

export default new AdminService();