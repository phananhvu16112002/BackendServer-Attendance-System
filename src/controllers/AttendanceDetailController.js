import AttendanceDetailService from "../services/AttendanceDetailService";
import { JSDatetimeToMySQLDatetime, MySQLDatetimeToJSDatetime } from "../utils/TimeConvert";

class AttendanceDetailController {
    takeAttendance = async (req, res) => {
        const studentID = req.body.studentID;
        const classID = req.body.classID;
        const formID = req.body.formID;
        const dateTimeAttendance = JSDatetimeToMySQLDatetime(req.body.dateTimeAttendance);

        const location = req.body.location;
        const latitude = req.body.latitude;
        const longtitude = req.body.longtitude;
        const image = req.files.file;

        //Call database to get attendance detail
        let attendanceDetail = await AttendanceDetailService.getAttendanceDetail(studentID, classID, formID);
        let attendanceForm = attendanceDetail.attendanceForm;
        
        //Check if attendance Detail exist
        if (attendanceDetail == null){
            return res.status(422).json({message : "Your attendance record does not exist"});
        }
        
        //Check form status and dateOpen
        if (attendanceForm.status == false){
            return res.status(422).json({message : "Form has been closed by lecturer"});
        }

        //Check form time
        if (dateTimeAttendance >= MySQLDatetimeToJSDatetime(attendanceForm.startTime) 
            && dateTimeAttendance <= MySQLDatetimeToJSDatetime(attendanceForm.endTime)){
            
            return res.status(422).json({message : "Your attendance time is not in range. Please contact your lecturer"});
        }

        
        
    }
}

export default new AttendanceDetailController();