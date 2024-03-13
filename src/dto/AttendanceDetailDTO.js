class AttendanceDetailDTO {
    getStatusBasedOnAttendanceDetails = (attendanceDetails, offset) => {
        let count = 0;
        for (let i = 0; i < attendanceDetails.length; i++){
            let attendanceDetail = attendanceDetails[i];
            if (attendanceDetail.result == 0){
                count += 1
            }else if (attendanceDetail.result == 0.5) {
                count += 0.5
            }
        }

        if (count >= offset){
            return "Ban";
        }

        if (count < offset && (offset - count) == 0.5) {
            return "Warning";
        }

        return "Pass";
    }

    transformStudentsAttendanceDetails = (studentDetails, offset) => {
        let total = studentDetails.length;
        let pass = 0;
        let ban = 0;
        let warning = 0;

        for (let i = 0; i < studentDetails.length; i++){
            let studentDetail = studentDetails[i];
            let status = this.getStatusBasedOnAttendanceDetails(studentDetail.attendancedetails, offset);
            studentDetail.status = status;
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

    extractSensitiveInformation = (studentDetail) => {
        // let student = {studentHashedPassword, hashedOTP, accessToken, refreshToken, 
        //     resetToken, timeToLiveOTP, active, ...studentDetail.student};
        // console.log(student);
        // console.log(student);
        // studentDetail.student = student;
        // studentDetail = {studentDetail, classDetail, ... studentDetail};
    }
}

export default new AttendanceDetailDTO();