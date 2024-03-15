class ReportController {
    submitReport = async (req,res) => {
        const studentID = req.body.studentID;
        const classID = req.body.classID;
        const formID = req.body.formID;
        const topic = req.body.topic;
        const problem = req.body.problem;
        const message = req.body.message;

        let files = req.files;
        //send files to Imgur
     
        //transaction
        //create report

        //create report image
    }
}

export default new ReportController();