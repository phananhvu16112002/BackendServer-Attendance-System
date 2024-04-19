import firebaseAdmin from "../config/notification.config";
import AttendanceDetailDTO from "../dto/AttendanceDetailDTO";
import StudentClassService from "./StudentClassService";
import StudentService from "./StudentService";

class NotificationService {
    sendAttendanceFormToStudents = async (classID, offset) => {
        try{
            let {data, error} = await StudentClassService.getStudentsAttendanceDetailsWithDeviceTokenByClassID(classID);
            if (error) {return false};
            let {passTokens, warningTokens} = this.getPassTokensAndWarningTokens(data, offset);
            console.log('passToken',passTokens)
            console.log('warningToken',warningTokens)

            // const messageToPassTokens = {
            //     notification: {
            //         title: "Attendance Form",
            //         body: "Your teacher has created attendance detail. Please take attendance!"
            //     },
            //     tokens: passTokens
            // }
            // const messageToWarningTokens = {
            //     notification: {
            //         title: "Attendance Form",
            //         body: "Please take attendance now! You cannot be absent today!"
            //     },
            //     tokens: warningTokens
            // }
            const message = [];
            // message.push(messageToPassTokens)
            // message.push(messageToWarningTokens)
            for (let i = 0; i < passTokens.length; i++){
                message.push(
                    {
                        notification: {
                            title: "Attendance Form",
                            body: "Your teacher has created attendance detail. Please take attendance!"
                        },
                        token: passTokens[i]
                    }
                )
            }
            for (let i = 0; i <warningTokens.length; i++){
                message.push(
                    {
                        notification: {
                            title: "Attendance Form",
                            body: "Please take attendance now! You cannot be absent today!"
                        },
                        token: warningTokens[i]
                    }
                )
            }

            console.log(message)
            firebaseAdmin.messaging().sendAll(message)
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
            let tokens = this.getTokensFromStudentDeviceTokens(studentDeviceTokens);
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
            tokens.push(studentDeviceTokens[i].token);
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
            let tokens = this.getTokensFromStudentDeviceTokens(studentDetail.tokens);
            if (studentDetail.tokens != null && status == "Warning"){
                warningTokens.push(...tokens);
            }else if (studentDetail.tokens != null && status == "Pass"){
                passTokens.push(...tokens);
            }
        }
        console.log('asd',passTokens)
        console.log('asasdad',warningTokens)

        return {passTokens, warningTokens};
        
    }

    // must test
    getNotificationsBasedOnFeedbackAndAttendanceDetail = (feedbacks, attendancedetails) => {
        let notifications = [];
        for (let i = 0; i < feedbacks.length; i++){
            let feedback = feedbacks[i];
            let notification = {
                type: "report",
                reportID: feedback.report.reportID,
                formID: null,
                course: feedback.course.courseName,
                lecturer: feedback.teacher.teacherName,
                createdAt: feedback.createdAt
            }
            notifications.push(notification);
        }
        for (let i = 0; i < attendancedetails.length; i++){
            let attendance = attendancedetails[i];
            let notification = {
                type: "attendance",
                reportID: null,
                formID: attendance.attendanceForm,
                course: attendance.course.courseName,
                lecturer: attendance.teacher.teacherName,
                createdAt: attendance.createdAt
            }
            notifications.push(notification);
        }
        return this.sortNotificationsByDate(notifications);
    }

    //must test
    sortNotificationsByDate = (notifications) => {
        notifications.sort((b, a) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
          
            // Handle invalid dates by placing them at the end
            if (isNaN(dateA.getTime())) {
              return 1;
            }
            if (isNaN(dateB.getTime())) {
              return -1;
            }
          
            return dateA.getTime() - dateB.getTime();
        });
        return notifications;
    }
}

export default new NotificationService();