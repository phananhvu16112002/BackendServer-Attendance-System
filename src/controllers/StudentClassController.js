import AttendanceDetailDTO from "../dto/AttendanceDetailDTO";
import StudentClassDTO from "../dto/StudentClassDTO";
import ClassService from "../services/ClassService";
import StudentClassService from "../services/StudentClassService";
import BusinessUtils from "../utils/BusinessUtils";
import compareCaseInsentitive from "../utils/CompareCaseInsentitive";

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
            
            if (compareCaseInsentitive(teacherID, classData.teacher.teacherID) == false){
                return res.status(422).json({message: "Teacher is not in charge of this class"});
            }

            //get all students along with their attendance Detail
            let {data, error: err} = await StudentClassService.getStudentsAttendanceDetailsByClassID(classID);
            if (err){
                return res.status(500).json({message: err});
            } 
            if (data.length == 0){
                return res.status(204).json({message: "There are no records for students' attendance details"});
            }

            let totalDays = classData.attendanceForm.length
            let offset = totalDays - (0.2)*(totalDays);
            let {total, pass, ban, warning, data: result} = AttendanceDetailDTO.transformStudentsAttendanceDetails(data, offset); 

            classData.total = total;
            classData.pass = pass;
            classData.ban = ban;
            classData.warning = warning;
            classData.totalWeeks = totalDays;

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

            StudentClassDTO.transformStudentClassesDTO(data);
            return res.status(200).json(data);
        } catch (e) {
            return res.status(500).json({message: "Internal Server Error"});
        }
    }

    //must test 
    getStudentsByClassIDForTeacher = async (req,res) => {
        try {
            const classID = req.params.id;
            const teacherID = req.payload.userID; 

            let checkAuth = await ClassService.getClassByID(classID);
            if (checkAuth == null){
                return res.status(503).json({message: "Cannot authorize teacher to perform this action"});
            }     
            if (compareCaseInsentitive(teacherID, checkAuth.teacher.teacherID) == false){
                return res.status(403).json({message: "Action Denied. Teacher is not authorized"});
            }

            let {data, error} = await StudentClassService.getStudentsByClassID(classID);
            if (error){
                return res.status(500).json({message: error});
            }
            if (data.length == 0){
                return res.status(204).json({message: "No content"});
            }
            return res.status(200).json(data);
        } catch (e) {
            return res.status(500).json({message: "Internal Server Error"});
        }
    }

    //must test 
    getStudentsByClassIDForStudent = async (req,res) => {
        try {
            const classID = req.params.id;
            const studentID = req.payload.userID; 

            let {data: data1,error: error1} = await StudentClassService.checkStudentEnrolledInClass(studentID, classID);

            if (error1){
                return res.status(503).json({message: error1});
            }
            if (data1 == null){
                return res.status(422).json({message: "Student is not enrolled in this class"});
            }


            let {data, error} = await StudentClassService.getStudentsByClassID(classID);
            if (error){
                return res.status(500).json({message: error});
            }
            if (data.length == 0){
                return res.status(204).json({message: "No content"});
            }
            return res.status(200).json(data);
        } catch (e) {
            return res.status(500).json({message: "Internal Server Error"});
        }
    }

    uploadStudentClass = async (req,res) => {
        try {
            let fileExcel = req.files.file;
            let semesterID = req.body.semesterID;
            const buffer = fileExcel.data;
            const workbook = new Excel.Workbook();
            const content = await workbook.xlsx.load(buffer, { type: "buffer" });
            const worksheet = content.worksheets[0];
            let studentClasses = BusinessUtils.generateStudentClassFromExcel(worksheet, semesterID);
            if (await StudentClassService.uploadStudentsInClass(studentClasses)){
                return res.status(200).json(studentClasses);
            }
            return res.status(503).json({message: "Fail adding students in class"});
        } catch (e) {
            return res.status(500).json({message: "Internal Server Error"});
        }
    }
}

export default new StudentClassController();