
class AttendanceDetailController {
    takeAttendance = async (req, res) => {
        const studentID = req.body.studentID;
        const classID = req.body.classID;
        const formID = req.body.formID;

        const location = req.body.location;
        

        //Check student class exist (call database)

        //Check form exist (call database)

        //Check form status and dateOpen
        
        
    }
}

export default new AttendanceDetailController();