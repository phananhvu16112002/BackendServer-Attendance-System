import 'dotenv/config';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

//$2b$10$Jy/x6brNkjrtIpPRRbHrQu8jh8k8o.l9qXPxAORF6G9fFAvmHr4JO
//$2b$10$jf1lWevTaxoTjvYTr34l9.qDb0ZQoDNGFUK2uj2DPdrA7pXrgOc2G
class AdminController {
    login = async (req,res) => {
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash("520h0380password!", salt)
        console.log(hashPassword);

        const salt2 = await bcrypt.genSalt(10);
        const hashedPassword2 = await bcrypt.hash("520h0696password!", salt2)
        console.log(hashedPassword2);
    }

    uploadStudents = async (req,res) => {

    }

    uploadTeachers = async (req,res) => {

    }
}

export default new AdminController();