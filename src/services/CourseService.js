import { where } from "@tensorflow/tfjs-node";
import { AppDataSource } from "../config/db.config";
import { Course } from "../models/Course";

const courseRepository = AppDataSource.getRepository(Course);

class CourseService {
    //testable
    loadCoursesToDatabase = async (courseList) => {
        try {
            let data = await courseRepository.insert(courseList);
            return {data: data.generatedMaps, error: null}
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

    //testable 
    postCourse = async (courseID, courseName, totalWeeks, requiredWeeks, credit) => {
        try {
            let course = new Course();
            course.courseID = courseID;
            course.courseName = courseName;
            course.totalWeeks = totalWeeks;
            course.requiredWeeks = requiredWeeks;
            course.credit = credit;
            let data = await courseRepository.insert(course);
            return {data: data.generatedMaps[0], error: null}
        } catch (e) {
            return {data: null, error: "Failed adding course"};
        }
    }
}

export default new CourseService();