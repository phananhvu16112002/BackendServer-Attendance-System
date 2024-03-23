import { AppDataSource } from "../config/db.config";
import { Course } from "../models/Course";

const courseRepository = AppDataSource.getRepository(Course);

class CourseService {
    //testable
    loadCoursesToDatabase = async (courseList) => {
        try {
            let data = await courseRepository.insert(courseList);
            return {data: data, error: null}
        } catch (e) {
            return {data: null, error: e.message}
        }
    }

    //testable
    getCourses = async () => {
        try {
            let data = await courseRepository.find();
            return {data: data, error : null};
        } catch (e) {
            return {data: [], error: "Failed getting courses"};
        }
    }
}

export default new CourseService();