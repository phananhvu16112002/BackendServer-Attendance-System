import ClassService from "../services/ClassService";

const classService = ClassService;

class ClassesController {
    getClassesWithCourse = async (req,res) => {
        try{
            const teacherID = req.payload.userID; 
            const {data, error} = await classService.getClassesWithCoursesByTeacherID(teacherID);

            if (error){
                return res.status(500).json({message: error});
            }
            if (data.length == 0){
                return res.status(204).json({message: "Teacher is not in charge of any class"});
            }
            return res.status(200).json(data);
        } catch (e) {
            return res.status(500).json({message: "Internal Server Error"});
        }
    }
}

export default new ClassesController();