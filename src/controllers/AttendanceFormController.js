import AttendanceFormService from "../services/AttendanceFormService";
import ClassService from "../services/ClassService";
import JSDatetimeToMySQLDatetime from "../utils/TimeConvert";

class AttendanceFormController {
    createForm = async (req, res) => {
        const classID = req.body.classID;
        const startTime = req.body.startTime;
        const endTime = req.body.endTime;
        const dateOpen = JSDatetimeToMySQLDatetime(new Date());
        const type = req.body.type;

        const classes = await ClassService.getClassByID(classID);
        if (classes == null){
            return res.status(422).json({message : `Class with the id: ${classID} does not exist`});
        }

        const attendanceForm = await AttendanceFormService.createForm(classes, startTime, endTime, dateOpen, type)
        if (attendanceForm == null){
            return res.status(503).json({message : "Form cannot be created. Please try again!"})
        }

        res.status(200).json(attendanceForm)
    }

    getAllFormByClassID = async (req, res) => {
        res.status(200).json(await ClassService.getAllFormByClassID("5202111_09_t000"));
    }
}

export default new AttendanceFormController();