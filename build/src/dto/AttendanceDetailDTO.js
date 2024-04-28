"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AttendanceDetailDTO {
    constructor() {
        this.getStatusAndTotalStatsBasedOnAttendanceDetails = (attendanceDetails, offset) => {
            let count = 0;
            let total = 0;
            for (let i = 0; i < attendanceDetails.length; i++) {
                let attendanceDetail = attendanceDetails[i];
                if (attendanceDetail.result == 0) {
                    count += 1;
                }
                else if (attendanceDetail.result == 0.5) {
                    count += 0.5;
                    total += 0.5;
                }
                else {
                    total += 1;
                }
            }
            if (count >= offset) {
                return { totalstats: total, status: "Ban" };
            }
            if (count < offset && (offset - count) == 0.5) {
                return { totalstats: total, status: "Warning" };
            }
            return { totalstats: total, status: "Pass" };
        };
        this.transformStudentsAttendanceDetails = (studentDetails, offset) => {
            let total = studentDetails.length;
            let pass = 0;
            let ban = 0;
            let warning = 0;
            for (let i = 0; i < studentDetails.length; i++) {
                let studentDetail = studentDetails[i];
                let { totalstats, status } = this.getStatusAndTotalStatsBasedOnAttendanceDetails(studentDetail.attendancedetails, offset);
                studentDetail.status = status;
                studentDetail.total = totalstats.toString();
                this.extractSensitiveInformation(studentDetail);
                if (status == "Ban") {
                    ban += 1;
                }
                else if (status == "Warning") {
                    warning += 1;
                }
                else if (status == "Pass") {
                    pass += 1;
                }
            }
            return { total, pass, ban, warning, data: studentDetails };
        };
        this.extractSensitiveInformation = (StudentDetail) => {
            StudentDetail.studentID = StudentDetail.student.studentID;
            StudentDetail.studentName = StudentDetail.student.studentName;
            StudentDetail.studentEmail = StudentDetail.student.studentEmail;
            delete StudentDetail.studentDetail;
            delete StudentDetail.classDetail;
            delete StudentDetail.student;
        };
    }
}
exports.default = new AttendanceDetailDTO();
