import { AppDataSource, entityManager } from "../config/db.config";
import { Classes } from "../models/Classes";

const classRepository = AppDataSource.getRepository(Classes);
class ClassService {
    //oke check if teacher enrolled in this class
    getClassByID = async (classID) => {
        try {
            return await classRepository.findOne({
                where: {
                    classID: classID
                }, relations: {
                    teacher : true
                }
            })
        } catch (e) {
            return null;
        }
    }

    //oke used in attendance controller
    getClassByIDWithStudents = async (classID) => {
        try {
            let data = await classRepository.findOne({
                where : {classID : classID},
                relations : {studentClass : true, course: true, teacher: true}
            });
            return {data, error: null}
        } catch (e) {
            return {data: null, error: "Failed fecthing data"};
        }
    }

    getAllStudentsByClassID = async (classID) => {
        try {
            return null;
        } catch (e) {
            return null;
        }
    }

    getAllFormByClassID = async (classID) => {
        try {
            return await classRepository.findOne
            ({
                where: {
                    classID : classID
                },
                relations : {
                    attendanceForm : true
                }
            })

        } catch (e) {
            return null;
        }
    }

    getClassesByTeacherID = async (teacherID) => {
        try {
            return await classRepository.createQueryBuilder("classes").
            where("classes.teacherID = :teacherID", {teacherID : teacherID}). 
            getMany();
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    ////Oke used in ClassesController
    getClassesWithCoursesByTeacherID = async (teacherID) => {
        try {
            let data = await classRepository.find({where : {
                teacher : {
                    teacherID : teacherID
                },
            }, relations: {course : true}})

            return {data, error: null};
        } catch (e) {
            return {data: [], error: "Failed fetching data"};
        }
    }

    ////Oke used in StudentClassController
    getClassesWithStudentsCourseTeacher = async (classID) => {
        try {
            let data = await classRepository.findOne({
                where: {
                    classID: classID
                }, 
                select: {
                    teacher: {
                        teacherID: true,
                        teacherEmail: true,
                        teacherName: true
                    },
                },
                relations: {
                    teacher: true,
                    course: true,
                }
            });
            return {data, error: null};
        } catch (e) {
            return {data: null, error: "Failed fetching data"};
        }
    }

    //testable
    getClassesWithCourseAndTeacherByCourseID = async (courseID) => {
        try {
            let data = classRepository.find({
                where: {
                    course: {
                        courseID : courseID
                    }
                },
                select: {
                    teacher: {
                        teacherID: true,
                        teacherEmail: true,
                        teacherName: true
                    },
                },
                relations: {
                    teacher: true,
                    course: true
                }
            })
            return {data: data, error: null};
        } catch (e) {
            return {data: [], error: "Failed getting classes"};
        }
    }

    //testable
    getClasses = async () => {
        try {
            let data = await classRepository.find({
                select: {
                    teacher: {
                        teacherID: true,
                        teacherEmail: true,
                        teacherName: true
                    }
                },
                relations: {
                    teacher: true,
                    course: true
                }
            })
            return {data: data, error: null};
        } catch (e) {
            return {data: [], error: "Failed getting classes"};
        }
    }

    //testable
    getClassesByID = async (classID) => {
        try {
            let data = await classRepository.find({
                where: {
                    classID: classID,
                },
                select: {
                    teacher: {
                        teacherID: true,
                        teacherEmail: true,
                        teacherName: true
                    }
                },
                relations: {
                    teacher: true,
                    course: true
                }
            })
            return {data: data, error: null};
        } catch (e) {
            return {data: null, error: "Failed getting classes"};
        }
    }

    //must test
    editClass = async (classID, roomNumber, shiftNumber, startTime, endTime, classType ,group, subGroup, courseID, teacherID) => {
        try {
            await classRepository.update({classID: classID}, 
            {roomNumber: roomNumber, shiftNumber: shiftNumber, startTime: startTime, endTime: endTime, 
            classType: classType, group: group, subGroup: subGroup, course: courseID, teacher: teacherID});
            return true;
        } catch (e) {
            return false;
        }
    }

    //must test
    getClassesWithPagination = async (page) => {
        try {
            if (page <= 0) {
                page = 1;
            }
            let skip = (page - 1) * 6;

            let data = await classRepository.find({
                select: {
                    teacher: {
                        teacherID: true,
                        teacherEmail: true,
                        teacherName: true
                    }
                },
                relations: {
                    teacher: true,
                    course: true
                },
                skip: skip,
                take: 6
            })
            return {data: data, error: null};
        } catch (e) {
            return {data: [], error: "Failed getting classes"};
        }
    }

    //must test
    getClassesWithCourseAndTeacherByCourseIDWithPagination = async (courseID, page) => {
        try {
            if (page <= 0) {
                page = 1;
            }
            let skip = (page - 1) * 6;

            let data = classRepository.find({
                where: {
                    course: {
                        courseID : courseID
                    }
                },
                select: {
                    teacher: {
                        teacherID: true,
                        teacherEmail: true,
                        teacherName: true
                    },
                },
                relations: {
                    teacher: true,
                    course: true
                },
                skip: skip,
                take: 6
            })
            return {data: data, error: null};
        } catch (e) {
            return {data: [], error: "Failed getting classes"};
        }
    }

    //must test
    deleteClass = async (classID) => {
        try {
            await classRepository.delete({
                classID: classID,
            })
            return true;
        } catch (e) {
            return false;
        }
    }
}

export default new ClassService();