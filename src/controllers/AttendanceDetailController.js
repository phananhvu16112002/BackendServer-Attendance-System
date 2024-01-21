import AttendanceDetailService from "../services/AttendanceDetailService";
import { JSDatetimeToMySQLDatetime, MySQLDatetimeToJSDatetime } from "../utils/TimeConvert";
import distanceInMeter from "../utils/Distance";
import UploadImageService from "../services/UploadImageService";
import FaceMatchingService from "../services/FaceMatchingService";
import { AppDataSource } from "../config/db.config";
import { AttendanceDetail } from "../models/AttendanceDetail";

const attendanceDetailRepository = AppDataSource.getRepository(AttendanceDetail); 
class AttendanceDetailController {
    takeAttendance = async (req, res) => {
        const studentID = req.body.studentID;
        const classID = req.body.classID;
        const formID = req.body.formID;
        const dateTimeAttendance = JSDatetimeToMySQLDatetime(new Date(req.body.dateTimeAttendance));

        const location = req.body.location;
        const latitude = req.body.latitude;
        const longtitude = req.body.longitude;
        const image = req.files.file;

        //Check
        console.log("StudentID: ", studentID);
        console.log("ClassID: ", classID);
        console.log("FormID ", formID);
        console.log("Location ", location);
        console.log("Latitude ", latitude);
        console.log("Longitude ", longtitude)
        console.log("Image ", image);
        //Call database to get attendance detail
        let attendanceDetail = await AttendanceDetailService.getAttendanceDetail(studentID, classID, formID);
        if (attendanceDetail == null){
            return res.status(422).json({message: "Your attendance detail is not recorded"});
        }
        let attendanceForm = attendanceDetail.attendanceForm;

        //Check location first (has a service to check)
        let lat = attendanceForm.latitude;
        let long = attendanceForm.longitude;

        //will emit later

        // if (distanceInMeter(latitude, longtitude, lat, long) > attendanceForm.radius){
        //     return res.status(422).json({message: "Your location is not in range"});
        // }

        //Check if attendance Detail exist
        if (attendanceDetail == null){
            return res.status(422).json({message : "Your attendance record does not exist"});
        }
        
        //Check form status and dateOpen
        if (attendanceForm.status == false){
            return res.status(422).json({message : "Form has been closed by lecturer"});
        }

        //Check form time will emit later

        // if (dateTimeAttendance < MySQLDatetimeToJSDatetime(attendanceForm.startTime) 
        //     || dateTimeAttendance > MySQLDatetimeToJSDatetime(attendanceForm.endTime)){
            
        //     return res.status(422).json({message : "Your attendance time is not in range. Please contact your lecturer"});
        // }

        //Send image to Imgur
        const data = await UploadImageService.uploadAttendanceEvidenceFile(image);
        if (data == null){
            return res.status(500).json({message: "Cannot upload image. Please take attendance again."});
        }

        if (attendanceForm.type == 1){
            let check = await FaceMatchingService.faceMatching(image, studentID);
            if (!check){
                await UploadImageService.deleteImageByImageHash(data.id);
                return res.status(422).json({message: "Your face does not match"});
            }
        }
        //If only type == 1
            //After send image success, do face matching


            //if face matching is not match, then delete image in Imgur


        //after all work successfully, store attendance detail in server
        attendanceDetail.url = data.link;
        attendanceDetail.location = location;
        attendanceDetail.latitude = latitude;
        attendanceDetail.longitude = longtitude;
        attendanceDetail.result = 1;
        attendanceDetail.dateAttendanced = dateTimeAttendance;
        attendanceDetailRepository.save(attendanceDetail);
        res.status(200).json(attendanceDetail);
    }

    getAttendanceRecordsOfStudents = async (req,res) => {
        
    }
}

export default new AttendanceDetailController();