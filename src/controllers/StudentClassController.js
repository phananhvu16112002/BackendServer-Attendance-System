import AttendanceDetailDTO from "../dto/AttendanceDetailDTO";
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
            console.log(req.payload);
            console.log(teacherID);
            const classID = req.params.id;

            //Find class with id
            let {data: classData, error} = await ClassService.getClassesWithStudentsCourseTeacher(classID);
            if (error){
                return res.status(500).json({message: error});
            }
            if (classData == null){
                return res.status(204).json({message: "Class with this ID does not exist"});
            }
            
            //Check if teacher is in charge of this class
            if (teacherID != classData.teacher.teacherID){
                return res.status(422).json({message: "Teacher is not in charge of this class"});
            }

            //get all students along with their attendance Detail
            let {data, error: err} = await StudentClassService.getStudentsAttendanceDetailsByClassID(classID);
            if (err){
                return res.status(500).json({message: error});
            } 
            if (data.length == 0){
                return res.status(204).json({message: "There are no records for students' attendance details"});
            }

            let offset = classData.course.totalWeeks - classData.course.requiredWeeks;
            let {total, pass, ban, warning, data: result} = AttendanceDetailDTO.transformStudentsAttendanceDetails(data, offset); 

            classData.total = total;
            classData.pass = pass;
            classData.ban = ban;
            classData.warning = warning;

            return res.status(200).json({classData: classData, data: result});
        } catch(e){
            return res.status(500).json({message: "Internal Server Error"});
        }
    }

    //oke
    getClassesByStudentID = async (req,res) => {
        try{
            const studentID = req.payload.userID;
            let {data, error} = await StudentClassService.getClassesByStudentID(studentID);
            
            if (error){
                return res.status(500).json({message: error});
            }
            if (data.length == 0){
                return res.status(204).json({message: "Student's not been enrolled in any class"});
            }
            return res.status(200).json(data);
        } catch (e) {
            return res.status(500).json({message: "Internal Server Error"});
        }
    }
}

export default new StudentClassController();