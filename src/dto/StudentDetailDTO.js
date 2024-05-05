class StudentDetailDTO {
    studentDetail = (studentModel) => {
        return {
            studentDetail: {
                studentID: studentModel.studentID,
                studentName: studentModel.studentName,
                studentEmail: studentModel.studentEmail,
            }
        }
    }
}

export default new StudentDetailDTO();