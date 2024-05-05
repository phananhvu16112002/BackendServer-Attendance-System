class AttendanceDetailDTO {
    getAttendanceDetailsStats = (attendanceForms) => {
        let classTotalPresent = 0;
        let classTotalLate = 0;
        let classTotalAbsent = 0;
        let groupBarCharts = [];
        for (let i = 0; i < attendanceForms.length; i++){
            let attendanceForm = attendanceForms[i];
            let {totalPresent, totalLate, totalAbsent} = this.getTotalStatsBasedOnAttendanceForm(attendanceForm.attendanceDetails);
            groupBarCharts.push(this.groupBarChart(attendanceForm.dateOpen, totalPresent, totalLate, totalAbsent, `Day ${i+1}`));
            classTotalPresent+=totalPresent;
            classTotalLate+=totalLate;
            classTotalAbsent+=totalAbsent;
        }
        let sum = classTotalPresent + classTotalLate + classTotalAbsent;
        let progressPresent = Math.floor(classTotalPresent / sum);
        let progressLate = Math.floor(classTotalLate / sum);
        let progressAbsent = Math.floor(classTotalAbsent / sum); 
        return {progressPresent, progressLate, progressAbsent, groupBarCharts};
    }

    groupBarChart = (date, totalPresent, totalLate, totalAbsent, label) => {
        return {label, date, totalPresent, totalLate, totalAbsent}
    }

    getTotalStatsBasedOnAttendanceForm = (attendanceDetails) => {
        let totalPresent = 0;
        let totalLate = 0;
        let totalAbsent = 0;
        for (let i = 0; i < attendanceDetails.length; i++){
            let attendanceDetail = attendanceDetails[i];
            if (attendanceDetail.result == 0){
                totalAbsent+=1;
            }else if (attendanceDetail.result == 0.5){
                totalLate+=1;
            }else {
                totalPresent+=1;
            }
        }
        return {totalPresent, totalLate, totalAbsent};
    }

    getStatusAndTotalStatsBasedOnAttendanceDetails = (attendanceDetails, offset) => {
        let count = 0;
        let total = 0;
        for (let i = 0; i < attendanceDetails.length; i++){
            let attendanceDetail = attendanceDetails[i];
            if (attendanceDetail.result == 0){
                count += 1
            }else if (attendanceDetail.result == 0.5) {
                count += 0.5
                total += 0.5
            }else {
                total +=1;
            }
        }

        if (count >= offset){
            return {totalstats: total, status: "Ban"};
        }

        if (count < offset && (offset - count) == 0.5) {
            return {totalstats: total, status: "Warning"};
        }

        return {totalstats: total, status: "Pass"};
    }

    transformStudentsAttendanceDetails = (studentDetails, offset) => {
        let total = studentDetails.length;
        let pass = 0;
        let ban = 0;
        let warning = 0;

        for (let i = 0; i < studentDetails.length; i++){
            let studentDetail = studentDetails[i];
            let {totalstats,status} = this.getStatusAndTotalStatsBasedOnAttendanceDetails(studentDetail.attendancedetails, offset);
            studentDetail.status = status;
            studentDetail.total = totalstats.toString();
            this.extractSensitiveInformation(studentDetail);
            if (status == "Ban"){
                ban+=1;
            } else if (status == "Warning"){
                warning+=1;
            } else if (status == "Pass"){
                pass+=1;
            }
        }

        return {total, pass, ban, warning, data: studentDetails};
    }

    extractSensitiveInformation = (StudentDetail) => {
        StudentDetail.studentID = StudentDetail.student.studentID;
        StudentDetail.studentName = StudentDetail.student.studentName;
        StudentDetail.studentEmail = StudentDetail.student.studentEmail;
        delete StudentDetail.studentDetail;
        delete StudentDetail.classDetail;
        delete StudentDetail.student;
    }
}

export default new AttendanceDetailDTO();