const { AppDataSource } = require("../config/db.config");
const { Student } = require("../models/Student");

const studentRepository = AppDataSource.getRepository(Student);

class StudentService {
    checkStudentExist = async (studentID) => {
        let student = await studentRepository.findOneBy({studentID: studentID});
        return student;
    } 

    checkStudentStatus = async (student) => {
        return student.active;
    }
}

export default new StudentService();