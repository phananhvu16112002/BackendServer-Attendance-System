import express from "express";
import { AppDataSource } from "../config/db.config";
import { AttendanceDetail } from "../models/AttendanceDetail";
import { StudentClass } from "../models/StudentClass";

const attendanceDetailRepository = AppDataSource.getRepository(AttendanceDetail);
const studentClassRepository = AppDataSource.getRepository(StudentClass);

const TestAPIRouter = express.Router();

TestAPIRouter.get("/data", (req,res) => {
    const data = [
        {id: 1, name: "T.rex"},
        {id: 2, name: "Triceratops"}
    ]
    res.status(200).json(data);
})

TestAPIRouter.get("/", (req,res) => {
    res.send("index.html");
})

TestAPIRouter.get("/detail/:id", (req,res) => {
    const id = req.params.id; 
    const data = [
        {id: 1, name: "T.rex"},
        {id: 2, name: "Triceratops"}
    ]
    res.status(200).json(data.at(id-1));
})

TestAPIRouter.get("/attendanceDetail", async (req,res) => {
    const classID = req.query.classID;
    const studentID = "520H0380";
    
    const result = await attendanceDetailRepository.find({where: {
            studentDetail : studentID,
            classDetail: classID,
        },
        select: {
            result: true,
            dateAttendanced: true,
            location: true, 
            note: true,
            latitude: true,
            longitude: true,
            url: true,
            attendanceForm: {
                formID: true,
                status: true,
                type: true,
                status: true,
                startTime: true,
                endTime: true,
                classes: {
                    roomNumber: true,
                    shiftNumber: true,
                    startTime: true,
                    endTime: true,
                    classType: true,
                    group: true,
                    subGroup: true,
                    course: {
                        courseID: true,
                        courseName: true
                    }
                }
            },
        },
        relations : {
            attendanceForm: {
                classes: {
                    course : true
                }
            }
        }
    })
    res.json(result);
})

TestAPIRouter.get("/getStudentsAttendanceDetails", async (req,res) => {
    const classID = '520300_09_t0133'
    const result = await studentClassRepository.find(
        {
            where: {
                classDetail: classID,
            },
            select: {
                studentDetail: {
                    studentID: true,
                    studentEmail: true,
                    studentName: true,
                }
            },
            relations: {
                studentDetail: true
            }
        }
    );

    let finalResult = []
    
    await AppDataSource.transaction(async (transactionalEntityManager) => {
        for (let index = 0; index < result.length; index++){
            const fetch = await attendanceDetailRepository.find(
                {
                    where: {
                        studentDetail: result[index].studentDetail.studentID,
                        classDetail: result[index].classDetail
                    },
                    select: {
                        attendanceForm: true,
                        result: true,
                        dateAttendanced: true,
                        location: true,
                        note: true,
                        url: true
                    }
                }
            )
            result[index].attendanceDetail = fetch
            finalResult.push(result[index]);
        }
    })
    let final = []
    for (let i = 0; i < 25; i++){
        final.push(finalResult[0]);
    }
    return res.json({data: final, all: 0, pass: 0, ban: 0, warning: 0});
})

export default TestAPIRouter


