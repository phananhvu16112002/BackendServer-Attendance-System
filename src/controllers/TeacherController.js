import ClassService from "../services/ClassService";
import TeacherService from "../services/TeacherService";

const teacherService = TeacherService;
const classService = ClassService;

class TeacherController {
    getClasses = async (req,res) => {
        //Will need to change to get payload
        const teacherID = req.body.teacherID;

        const classes = await classService.getClassesByTeacherID(teacherID);

        if (classes == null){
            return res.status(503).json({message : "Teacher is not enrolled in any class"});
        }

        res.status(200).json(classes);
    }
}

export default new TeacherController();