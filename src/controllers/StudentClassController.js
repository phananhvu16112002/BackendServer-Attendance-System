import ClassService from "../services/ClassService";
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

    //oke
    getStudentsWithAllAttendanceDetails = async (req,res) => {
        try {
            const teacherID = req.payload.userID;
            const classID = req.params.id;

            //Find class with id
            let {classData, error} = await ClassService.getClassesWithStudentsCourseTeacher(classID);
            if (error){
                return res.status(500).json({message: error});
            }
            if (classData == null){
                return res.status(204).json({message: "Class with this ID does not exist"});
            }
            
            //Check if teacher is in charge of this class
            if (teacherID != classData.teacher.teacherID){
                return res.status().json({message: "Teacher is not in charge of this class"});
            }

            //get all students along with their attendance Detail

        } catch(e){

        }
    }
}

export default new StudentClassController();