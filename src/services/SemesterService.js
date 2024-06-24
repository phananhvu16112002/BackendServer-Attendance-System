import { AppDataSource } from "../config/db.config";
import { Semester } from "../models/Semester";

const semesterRepository = AppDataSource.getRepository(Semester);
class SemesterService {
    addSemester = async (semesterName, semesterDescription, startDate, endDate) => {
        try {
            let semester = new Semester();
            semester.semesterName = semesterName;
            semester.semesterDescription = semesterDescription;
            semester.startDate = startDate;
            semester.endDate = endDate;
            await semesterRepository.save(semester);
            let data = await semesterRepository.find();
            return {data: data, error: null};
        } catch (e) {
            return {data: null, error: "Failed adding semester"};
        }
    }

    editSemester = async (semesterID, semesterName, semesterDescription, startDate, endDate) => {
        try {
            if (await semesterRepository.findOneBy({semesterID: semesterID}) == null){
                return {data: null, error: `Semester ${semesterID} does not exist`};
            }
            let semester = new Semester();
            semester.semesterID = semesterID;
            semester.semesterName = semesterName;
            semester.semesterDescription = semesterDescription;
            semester.startDate = startDate;
            semester.endDate = endDate;
            await semesterRepository.update({semesterID: semesterID}, 
                {semesterName: semesterName, semesterDescription: semesterDescription, startDate: startDate, endDate: endDate});
            let data = await semesterRepository.find();
            return {data: data, error: null};
        } catch (e) {
            console.log(e);
            return {data: null, error: "Failed editing semester"};
        }
    }

    deleteSemester = async (semesterID) => {
        try {
            await semesterRepository.delete({
                semesterID: semesterID
            });
            return true;
        } catch (e) {
            return false;
        }
    }

    deleteAllSemester = async () => {
        try {
            let {data, error} = await this.getAllSemester();
            if (error) return false;
            await semesterRepository.remove(data);
            return true;
        } catch (e) {
            return false;
        }
    }

    getAllSemester = async () => {
        try {
            let data = await semesterRepository.find();
            return {data, error: null}
        } catch (e) {
            return {data: [], error: "Failed getting semesters"};
        }
    }
}

export default new SemesterService();