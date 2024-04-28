"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AttendanceFormDTO {
    constructor() {
        this.excludeClasses = (attendanceForm) => {
            //const {classes, ...form} = attendanceForm;
            attendanceForm.classes = attendanceForm.classes.classID;
            return attendanceForm;
        };
    }
}
exports.default = new AttendanceFormDTO();
