import StudentClassService from "../services/StudentClassService";


class StudentClassController {
    getStudentClass = (req,res) => {
        res.json(StudentClassService.getStudentClass("520H0380", "5202111_09_t000"));
    }
}

export default new StudentClassController();