import firebaseAdmin from "../config/notification.config";
import AttendanceDetailDTO from "../dto/AttendanceDetailDTO";
import StudentClassService from "./StudentClassService";
import StudentService from "./StudentService";

class NotificationService {
    sendAttendanceFormToStudents = async (classID, offset) => {
        try{
            let {data, error} = await StudentClassService.getStudentsAttendanceDetailsWithDeviceTokenByClassID(classID);
            if (error) {return false};
            let {passTokens, warningTokens} = getPassTokensAndWarningTokens(data, offset);
            const messageToPassTokens = {
                notification: {
                    title: "Attendance Form",
                    body: "Your teacher has created attendance detail. Please take attendance!"
                },
                tokens: passTokens
            }
            const messageToWarningTokens = {
                notification: {
                    title: "Attendance Form",
                    body: "Please take attendance now! You cannot be absent today"
                },
                tokens: warningTokens
            }
            const message = [];
            message.push(...messageToPassTokens, ...messageToWarningTokens);
            firebaseAdmin.messaging().send(message);
            return true;
        } catch (e) {
            return false;
        }
    }

    sendFeedbackNotificationToStudentID = async (studentID, feedback) => { 
        try{
            let {data: studentDeviceTokens, error} = await StudentService.getDeviceTokensByStudentID(studentID);
            if (error){
                return false;
            }
            let tokens = this.getTokens(studentDeviceTokens);
            const message = {
                notification: {
                    title: "Feedback",
                    body: "Your teacher has sent a feedback to your report!"
                },
                tokens: tokens
            }
            firebaseAdmin.messaging().send(message);
            return true;
        } catch(e){
            return false;
        }
    }

    getTokensFromStudentDeviceTokens = (studentDeviceTokens) => {
        let tokens = [];
        for (let i=0; i < studentDeviceTokens.length; i++){
            tokens.push(studentDeviceTokens.token);
        }
        return tokens;
    }

    getPassTokensAndWarningTokens = (studentDetails, offset) => {
        let passTokens = []
        let warningTokens = []

        for (let i = 0; i < studentDetails.length; i++){
            let studentDetail = studentDetails[i];
            let status = AttendanceDetailDTO.getStatusBasedOnAttendanceDetails(studentDetail.attendancedetails, offset);
            studentDetail.status = status;

            if (studentDetail.tokens != null && status == "Warning"){
                warningTokens.push(...studentDetail.tokens);
            }else if (studentDetail.tokens != null && status == "Pass"){
                passTokens.push(...studentDetail.tokens);
            }
        }

        return {passTokens, warningTokens};
    }
}

export default new NotificationService();