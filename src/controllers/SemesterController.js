import SemesterService from "../services/SemesterService";

class SemesterController {
    addSemester = async (req,res) => {
        try {
            let semesterName = req.body.semesterName;
            let semesterDescription = req.body.semesterDescription;
            let startDate = req.body.startDate;
            let endDate = req.body.endDate;
            let {data, error} = await SemesterService.addSemester(semesterName, semesterDescription, startDate, endDate);
            if (error){
                return res.status(503).json({message: error});
            }
            return res.status(200).json(data);
        } catch (e) {
            return res.status(500).json({message: "Internal Server Error"});
        }
    }

    editSemester = async (req,res) => {
        try {
            let semesterID = req.params.id;
            let {data, error} = await SemesterService.editSemester(semesterID, semesterName, semesterDescription, startDate, endDate);
            if (error){
                return res.status(503).json({message: error});
            }
            return res.status(200).json(data);
        } catch (e) {
            return res.status(500).json({message: "Internal Server Error"});
        }
    }

    deleteSemester = async (req,res) => {
        try {
            let semesterID = req.params.id;
            if (await SemesterService.deleteSemester(semesterID)){
                return res.status(200).json({message: `Successfully deleting semester ${semesterID}`});
            }
            return res.status(503).json({message: `Failed deleting semester ${semesterID}`});
        } catch (e) {
            return res.status(500).json({message: "Internal Server Error"});
        }
    }

    deleteAllSemester = async (req,res) => {
        try {
            if (await SemesterService.deleteAllSemester()){
                return res.status(200).json({message: "Successfully deleting all semesters"});
            }
            return res.status(503).json({message: "Failed deleting all semesters"});
        } catch (e) {
            return res.status(500).json({message: "Internal Server Error"});
        }
    }

    getAllSemester = async (req,res) => {
        try {
            let {data, error} = await SemesterService.getAllSemester();
            if (error){
                return res.status(503).json({message: error});
            }
            return res.status(200).json(data);
        } catch (e) {
            return res.status(500).json({message: "Internal Server Error"});
        }
    }
}

export default new SemesterController();