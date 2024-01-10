class AttendanceFormDTO {
    excludeClasses = (attendanceForm) => {
        //const {classes, ...form} = attendanceForm;
        attendanceForm.classes = attendanceForm.classes.classID
        return attendanceForm;
    }
}

export default new AttendanceFormDTO();