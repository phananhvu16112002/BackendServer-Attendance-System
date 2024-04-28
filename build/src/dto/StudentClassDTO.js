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
const db_config_1 = require("../config/db.config");
const AttendanceDetail_1 = require("../models/AttendanceDetail");
const attendanceDetailRepository = db_config_1.AppDataSource.getRepository(AttendanceDetail_1.AttendanceDetail);
class StudentClassDTO {
    constructor() {
        this.injectTotalDetails = (studentClasses) => __awaiter(this, void 0, void 0, function* () {
            try {
                for (let i in studentClasses) {
                    const total = yield attendanceDetailRepository.countBy({
                        studentDetail: studentClasses[i].studentDetail.studentID,
                        classDetail: studentClasses[i].classDetail.classID,
                    });
                    let totalPresence = 0;
                    let totalLate = 0;
                    let totalAbsence = 0;
                    yield db_config_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                        totalPresence = yield attendanceDetailRepository.countBy({
                            studentDetail: studentClasses[i].studentDetail.studentID,
                            classDetail: studentClasses[i].classDetail.classID,
                            result: 1
                        });
                        totalLate = yield attendanceDetailRepository.countBy({
                            studentDetail: studentClasses[i].studentDetail.studentID,
                            classDetail: studentClasses[i].classDetail.classID,
                            result: 0.5
                        });
                        totalAbsence = yield attendanceDetailRepository.countBy({
                            studentDetail: studentClasses[i].studentDetail.studentID,
                            classDetail: studentClasses[i].classDetail.classID,
                            result: 0
                        });
                    }));
                    const progress = (total / studentClasses[i].classDetail.course.totalWeeks);
                    studentClasses[i].progress = progress;
                    studentClasses[i].total = total;
                    studentClasses[i].totalPresence = totalPresence;
                    studentClasses[i].totalAbsence = totalAbsence;
                    studentClasses[i].totalLate = totalLate;
                }
                return studentClasses;
            }
            catch (e) {
                return null;
            }
        });
        this.transformStudentClassDTO = (data) => {
            return {
                studentID: data.studentID,
                total: data.Total,
                totalPresence: data.TotalPresence,
                totalAbsence: data.TotalAbsence,
                totalLate: data.TotalLate,
                attendanceDetails: []
            };
        };
        this.transformAttendanceDetailDTO = (data) => {
            return {
                formID: data.formID,
                dateAttendanced: data.dateAttendanced,
                location: data.location,
                note: data.note,
                latitude: data.latitude,
                longitude: data.longitude,
                result: data.result,
                url: data.url
            };
        };
        this.listOfStudentsWithAttendanceDetails = (data) => {
            let list = [];
            let temp;
            for (let i = 0; i < data.length; i++) {
                if (list.length == 0) {
                    temp = transformStudentClassDTO(data[i]);
                    temp.attendanceDetails.push(transformAttendanceDetailDTO(data[i]));
                    list.push(temp);
                }
                else if (temp.studentID == data[i].studentID) {
                    temp.attendanceDetails.push(transformAttendanceDetailDTO(data[i]));
                }
                else {
                    temp = transformStudentClassDTO(data[i]);
                    temp.attendanceDetails.push(transformAttendanceDetailDTO(data[i]));
                    list.push(temp);
                }
            }
            return list;
        };
        //oke
        this.transformStudentClassesDTO = (studentClassList) => {
            for (let i = 0; i < studentClassList.length; i++) {
                let studentClass = studentClassList[i];
                studentClass.total = parseInt(studentClass.total);
                studentClass.totalPresence = parseInt(studentClass.totalPresence);
                studentClass.totalAbsence = parseInt(studentClass.totalAbsence);
                studentClass.totalLate = parseInt(studentClass.totalLate);
                let progress = studentClass.total / studentClass.totalWeeks;
                studentClass.progress = progress;
            }
        };
    }
}
exports.default = new StudentClassDTO();
