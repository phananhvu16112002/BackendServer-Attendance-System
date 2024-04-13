import firebaseAdmin from "../config/notification.config";
import StudentService from "./StudentService";

class NotificationService {
    sendFeedbackNotificationToStudentID = async (studentID, feedback) => { 
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
    }

    getTokens = (studentDeviceTokens) => {
        let tokens = [];
        for (let i=0; i < studentDeviceTokens.length; i++){
            tokens.push(studentDeviceTokens.token);
        }
        return tokens;
    }
}

export default new NotificationService();