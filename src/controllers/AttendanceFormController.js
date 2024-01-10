import AttendanceFormDTO from "../dto/AttendanceFormDTO";
import AttendanceDetailService from "../services/AttendanceDetailService";
import AttendanceFormService from "../services/AttendanceFormService";
import ClassService from "../services/ClassService";
import {JSDatetimeToMySQLDatetime} from "../utils/TimeConvert";

class AttendanceFormController {
    createAttendanceForm = async (req, res) => {
        try {
            const classID = req.body.classID;
            const startTime = req.body.startTime;
            const endTime = req.body.endTime;
            const dateOpen = JSDatetimeToMySQLDatetime(new Date());
            const type = req.body.type;

            const location = req.body.location;
            const latitude = req.body.latitude;
            const longtitude = req.body.longtitude;
            const radius = req.body.radius;

            const classes = await ClassService.getClassByID(classID);
            if (classes == null){
                return res.status(422).json({message : `Class with the id: ${classID} does not exist`});
            }

            //Create entities before inserting into database
            const attendanceFormEntity = AttendanceFormService.createFormEntity(classes, startTime, endTime, dateOpen, type);
            const attendanceDetailEntities = AttendanceDetailService.createDefaultAttendanceDetailEntitiesForStudents(classes.studentClass, attendanceForm);
        
            //Make transactions to insert into database
            const form = await AttendanceFormService.createFormTransaction(attendanceFormEntity, attendanceDetailEntities);
            if (form == null){
                return res.status(503).json({message : "Attendance Form cannot be created. Please try again!"});
            }

            res.status(200).json(AttendanceFormDTO.excludeClasses(form));
        } catch (e) {
            res.status(500).json({message : "Internal Server"});
        }
    }

    getAllFormByClassID = async (req, res) => {
        res.status(200).json(await ClassService.getAllFormByClassID("5202111_09_t000"));
    }
}

export default new AttendanceFormController();