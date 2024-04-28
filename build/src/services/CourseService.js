"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const tfjs_node_1 = require("@tensorflow/tfjs-node");
const db_config_1 = require("../config/db.config");
const Course_1 = require("../models/Course");
const courseRepository = db_config_1.AppDataSource.getRepository(Course_1.Course);
class CourseService {
    constructor() {
        //testable
        this.loadCoursesToDatabase = (courseList) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield courseRepository.insert(courseList);
                return { data: data.generatedMaps, error: null };
            }
            catch (e) {
                return { data: null, error: e.message };
            }
        });
        //testable
        this.getCourses = () => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield courseRepository.find();
                return { data: data, error: null };
            }
            catch (e) {
                return { data: [], error: "Failed getting courses" };
            }
        });
        //testable 
        this.postCourse = (courseID, courseName, totalWeeks, requiredWeeks, credit) => __awaiter(this, void 0, void 0, function* () {
            try {
                let course = new Course_1.Course();
                course.courseID = courseID;
                course.courseName = courseName;
                course.totalWeeks = totalWeeks;
                course.requiredWeeks = requiredWeeks;
                course.credit = credit;
                let data = yield courseRepository.insert(course);
                return { data: data.generatedMaps[0], error: null };
            }
            catch (e) {
                return { data: null, error: "Failed adding course" };
            }
        });
        //must test
        this.editCourse = (courseID, courseName, totalWeeks, requiredWeeks, credit) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield courseRepository.update({ courseID: courseID }, { courseName: courseName, totalWeeks: totalWeeks, requiredWeeks: requiredWeeks, credit: credit });
                return true;
            }
            catch (e) {
                return false;
            }
        });
        //must test
        this.getCoursesWithPagination = (page) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (page <= 0) {
                    page = 1;
                }
                let skip = (page - 1) * 6;
                let data = yield courseRepository.find({
                    skip: skip,
                    take: 6,
                });
                return { data: data, error: null };
            }
            catch (e) {
                return { data: [], error: "Failed getting courses" };
            }
        });
        //must test
        this.deleteCourse = (courseID) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield courseRepository.delete({
                    courseID: courseID,
                });
                return true;
            }
            catch (e) {
                return { data: null, error: `Failed deleting course with id: ${courseID}` };
            }
        });
    }
}
exports.default = new CourseService();
