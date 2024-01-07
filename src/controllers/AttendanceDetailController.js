
class AttendanceDetailController {
    takeAttendance = async (req, res) => {
        const studentID = req.body.studentID;
        const classID = req.body.classID;
        const formID = req.body.formID;

        const location = req.body.location;
        const image = req.files.file;
        
        //Check if attendance Detail exist
        
        
        //Check form status and dateOpen
        
        
    }
}

export default new AttendanceDetailController();