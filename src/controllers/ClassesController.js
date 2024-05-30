import ClassesDTO from "../dto/ClassesDTO";
import ClassService from "../services/ClassService";
import Excel from "exceljs";
import BusinessUtils from "../utils/BusinessUtils";

const classService = ClassService;

class ClassesController {
    getClassesWithCourse = async (req,res) => {
        try{
            const teacherID = req.payload.userID; 
            let semesterID = req.query.semester;
            const {data, error} = (semesterID) ? await classService.getClassesInSemesterWithCoursesByTeacherID(teacherID, semesterID) : await classService.getClassesWithCoursesByTeacherID(teacherID);

            if (error){
                return res.status(500).json({message: error});
            }
            if (data.length == 0){
                return res.status(204).json({message: "Teacher is not in charge of any class"});
            }
            return res.status(200).json(ClassesDTO.appendRecentLesson(data));
        } catch (e) {
            return res.status(500).json({message: "Internal Server Error"});
        }
    }

    getClassesWithCourseWithPagination = async (req,res) => {
        try{
            const teacherID = req.payload.userID; 
            let semesterID = req.query.semester;
            let page = req.params.page;
            if (page <= 0) {page = 1;}
            let skip = (page - 1) * 9;
            const {data, error} = (semesterID) ? await classService.getClassesInSemesterWithCoursesByTeacherIDWithPagination(teacherID, semesterID, skip, 9) : await classService.getClassesWithCoursesByTeacherIDWithPagination(teacherID, skip, 9);
            let total = (semesterID) ? await classService.getTotalPagesForClassesInSemesterByTeacherID(teacherID, semesterID, 9) : await classService.getTotalPagesForClassesByTeacherID(teacherID, 9);
            if (error){
                return res.status(500).json({message: error});
            }
            if (data.length == 0){
                return res.status(204).json({message: "Teacher is not in charge of any class"});
            }
            return res.status(200).json({totalPage: total, classes: ClassesDTO.appendRecentLesson(data)});
        } catch (e) {
            return res.status(500).json({message: "Internal Server Error"});
        }
    }

    uploadClasses = async (req,res) => {
        try {
            let fileExcel = req.files.file;
            let semesterID = req.body.semesterID;
            const buffer = fileExcel.data;
            const workbook = new Excel.Workbook();
            const content = await workbook.xlsx.load(buffer, { type: "buffer" });
            const worksheet = content.worksheets[0];
            let classes = BusinessUtils.generateClassesFromExcel(worksheet, semesterID);
            let attendanceForms = classes.flatMap(c => c.attendanceForm);
            let {data, error} = await ClassService.uploadClasses(classes, attendanceForms);
            if (error){
                return res.status(503).json({message: error});
            }
            return res.status(200).json(data);
        } catch (e) {
            return res.status(500).json({message: "Internal Server Error"});
        }
    }
}

export default new ClassesController();