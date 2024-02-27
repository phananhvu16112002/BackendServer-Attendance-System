import express from "express";
import { AppDataSource } from "../config/db.config";
import { AttendanceDetail } from "../models/AttendanceDetail";
import { StudentClass } from "../models/StudentClass";
import { idText } from "typescript";
import { Classes } from "../models/Classes";

const attendanceDetailRepository = AppDataSource.getRepository(AttendanceDetail);
const studentClassRepository = AppDataSource.getRepository(StudentClass);
const classRepository = AppDataSource.getRepository(Classes);

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
    const classID = await classRepository.findOne({where: {classID: '520300_09_t0133'}, relations: {course: true}});
    const result = await studentClassRepository.find(
        {
            where: {
                classDetail: classID.classID
            },
            select: {
                studentDetail: {
                    studentID: true,
                    studentEmail: true,
                    studentName: true,
                }
            },
            relations: {
                studentDetail: true,
            }
        }
    );

    let finalResult = []
    
    await AppDataSource.transaction(async (transactionalEntityManager) => {
        for (let index = 0; index < result.length; index++){
            let fetch = await attendanceDetailRepository.find(
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
            );
            result[index].attendanceDetail = fetch
            
            let sum = 0;
            for (let id = 0; id < fetch.length; id ++){
                if (fetch[id].result == 0){
                    sum+=1;
                }else if (fetch[id].result == 0.5){
                    sum+=0.5;
                }
            }

            let status;
            if (sum > (classID.course.totalWeeks - classID.course.requiredWeeks)){
                status = "Ban";
            } else if (sum == (classID.course.totalWeeks - classID.course.requiredWeeks)){
                status = "Warning";
            }

            result[index].status = status 
            //result[index].status = fetch.map(f => {if (f.result != 1) return f.result})
            finalResult.push(result[index]);
        }
    })
    let final = []
    for (let i = 0; i < 25; i++){
        final.push(finalResult[0]);
    }
    return res.status(200).json({data: final, all: 0, pass: 0, ban: 0, warning: 0});
})

export default TestAPIRouter


