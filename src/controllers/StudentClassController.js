import StudentClassService from "../services/StudentClassService";


class StudentClassController {
    getStudentClass = (req,res) => {
        res.json(StudentClassService.getStudentClass("520H0380", "5202111_09_t000"));
    }

    getStudentClasses = async (req,res) => {
        try {
            const studentID = req.payload.userID; 
            const studentClasses = await StudentClassService.getClassesByStudentID(studentID);

            return res.status(200).json(studentClasses);
            
        } catch (e) {
            return res.status(500).json({message: "Cannot get classes"});
        }
    }
}

export default new StudentClassController();