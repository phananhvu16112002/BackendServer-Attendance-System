import express from "express";
import { AppDataSource } from "../config/db.config";
import { AttendanceDetail } from "../models/AttendanceDetail";

const attendanceDetailRepository = AppDataSource.getRepository(AttendanceDetail);

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

export default TestAPIRouter


