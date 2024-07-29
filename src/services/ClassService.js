import { AppDataSource, entityManager } from "../config/db.config";
import { AttendanceForm } from "../models/AttendanceForm";
import { Classes } from "../models/Classes";
import { Course } from "../models/Course";
import { Teacher } from "../models/Teacher";

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
                relations : {studentClass : true, course: true, teacher: true, attendanceForm: true}
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
            }, relations: {course : true, attendanceForm: true}})

            return {data, error: null};
        } catch (e) {
            return {data: [], error: "Failed fetching data"};
        }
    }

    //migration
    getClassesInSemesterWithCoursesByTeacherID = async (teacherID, semesterID) => {
        try {
            let data = await classRepository.find({where : {
                semester: {
                    semesterID: semesterID
                },
                teacher : {
                    teacherID : teacherID
                },
            }, relations: {course : true, semester: true, attendanceForm: true}})

            return {data, error: null};
        } catch (e) {
            return {data: [], error: "Failed fetching data"};
        }
    }

    getClassesWithCoursesByTeacherIDWithPagination = async (teacherID, skip, take, isArchived) => {
        try {
            let data = (isArchived) ? 
            await classRepository.find({where : {
                isArchived: isArchived,
                teacher : {
                    teacherID : teacherID
                },
            }, relations: {course : true, attendanceForm: true}, skip: skip, take: take})
            :
            await classRepository.find({where : {
                isArchived: false,
                teacher : {
                    teacherID : teacherID
                },
            }, relations: {course : true, attendanceForm: true}, skip: skip, take: take})
            return {data, error: null};
        } catch (e) {
            return {data: [], error: "Failed fetching data"};
        }
    }

    //migration
    getClassesInSemesterWithCoursesByTeacherIDWithPagination = async (teacherID, semesterID, skip, take, isArchived) => {
        try {
            let data = (isArchived) ? 
            await classRepository.find({where : {
                isArchived: isArchived,
                semester: {
                    semesterID : semesterID
                },
                teacher : {
                    teacherID : teacherID
                },
            }, relations: {course : true, semester: true, attendanceForm: true}, skip: skip, take: take}) 
            :
            await classRepository.find({where : {
                isArchived: false,
                semester: {
                    semesterID : semesterID
                },
                teacher : {
                    teacherID : teacherID
                },
            }, relations: {course : true, semester: true, attendanceForm: true}, skip: skip, take: take})

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
                    attendanceForm: true
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
            let data = await classRepository.find({
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
                    course: true,
                    attendanceForm: true
                }
            })
            return {data: data, error: null};
        } catch (e) {
            return {data: [], error: "Failed getting classes"};
        }
    }

    //migration
    getClassesBySemester = async (semesterID) => {
        try {
            let data = await classRepository.find({
                where: {
                    semester: {
                        semesterID: semesterID
                    }
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
                    course: true,
                    semester: true,
                    attendanceForm: true
                }
            });
            return {data: data, error: null};
        } catch (e) {
            console.log(e);
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

    //migration
    getClassesWithPaginationAndSemester = async (page, semester) => {
        try {
            if (page <= 0) {
                page = 1;
            }
            let skip = (page - 1) * 6;

            let data = await classRepository.find({
                where: {
                    semester: {
                        semesterID: semester
                    }
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
                    course: true,
                    semester: true
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

            let data = await classRepository.find({
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
                where: {
                    course: {
                        courseID : courseID
                    }
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

    getTotalPagesForClasses = async (offset) => {
        try {
            let total = await classRepository.count();
            if (total == 0 || offset <= 0) return 0;
            return Math.ceil(total / offset);
        } catch (e) {
            return 0;
        }
    }

    getTotalPagesForClassesByTeacherID = async (teacherID, offset, isArchived) => {
        try {
            let total = (isArchived) ? 
            await classRepository.findAndCount({where : {
                isArchived: isArchived,
                teacher : {
                    teacherID : teacherID
                },
            }})
            :
            await classRepository.findAndCount({where : {
                isArchived: false,
                teacher : {
                    teacherID : teacherID
                },
            }})
            if (total[1] == 0 || offset <= 0) return 0;
            return Math.ceil(total[1] / offset);
        } catch (e) {
            return 0;
        }
    }

    //migration
    getTotalPagesForClassesInSemesterByTeacherID = async (teacherID, semesterID, offset, isArchived) => {
        try {
            let total = (isArchived) ? 
            await classRepository.findAndCount({where : {
                isArchived: isArchived,
                teacher : {
                    teacherID : teacherID
                },semester : {
                    semesterID: semesterID
                }
            }})
            :
            await classRepository.findAndCount({where : {
                isArchived: false,
                teacher : {
                    teacherID : teacherID
                },semester : {
                    semesterID: semesterID
                }
            }})
            if (total[1] == 0 || offset <= 0) return 0;
            return Math.ceil(total[1] / offset);
        } catch (e) {
            return 0;
        }
    }

    getTotalClasses = async () => {
        try {
            return await classRepository.count();
        } catch (e) {
            return 0;
        }
    }

    uploadClasses = async (classes, attendanceForms) => {
        try {
            await AppDataSource.transaction(async (transactionalEntityManager) => {
                await transactionalEntityManager.save(classes);
                await transactionalEntityManager.save(attendanceForms);
            })
            return {data: classes, error: null}
        } catch (e) {
            console.log(e);
            return {data: null, error: "Failed creating classes"};
        }
    }

    editClassesInArchive = async (classID, archived) => {
        try {
            await classRepository.update({classID: classID}, {isArchived : archived});
            return true;
        } catch (e) {
            return false;
        }
    }
}

export default new ClassService();