import AttendanceDetailService from "../services/AttendanceDetailService";
import FeedbackService from "../services/FeedbackService";
import NotificationService from "../services/NotificationService";

class NotificationController {
    //must test
    getNotificationsByStudentID = async (req,res) => {
        try {
            let studentID = req.payload.userID;
            let {data: feedbacks, error: e1} = await FeedbackService.getFeedBackByStudentID(studentID);
            if (e1){
                return res.status(503).json({message: e1});
            }
            let {data: attendanceDetails, error: e2} = await AttendanceDetailService.getAttendanceDetailsByStudentID(studentID);
            if (e2){
                return res.status(503).json({message: e2});
            }
            return res.status(200).json(NotificationService.getNotificationsBasedOnFeedbackAndAttendanceDetail(feedbacks, attendanceDetails));
        } catch (e) {
            return res.status(500).json({message: "Internal Server"});
        }
    }
}

export default new NotificationController();