import express from "express";
import { AppDataSource } from "../config/db.config";
import { AttendanceDetail } from "../models/AttendanceDetail";
import { StudentClass } from "../models/StudentClass";
import { Classes } from "../models/Classes";
import { AttendanceForm } from "../models/AttendanceForm";

const attendanceDetailRepository = AppDataSource.getRepository(AttendanceDetail);
const studentClassRepository = AppDataSource.getRepository(StudentClass);
const classRepository = AppDataSource.getRepository(Classes);
const attendanceFormRepository = AppDataSource.getRepository(AttendanceForm);

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

// 6th pass, 7th ban, 15th warning, 11 th tuan kiet waning
TestAPIRouter.get("/getStudentFakeAPI", (req,res) => {
    let data = [];
    let a = {
        studentDetail: {
            studentID: "a",
            studentName: "a",
            studentEmail: "a",
        },
        attendanceDetail: [
            {
                attendanceForm: "fa80bf1f-7256-4ffd-9550-b6a1656c6997",
                result: 1,
                dateAttendanced: "2024-01-17T14:15:00.000Z",
                location: "Ton Duc Thang",
                note: "",
                url: "https://i.imgur.com/4bSNcPK.jpg"
            },
            {
                attendanceForm: "fa80bf1f-7256-4ffd-9550-b6a1656c6997",
                result: 1,
                dateAttendanced: "2024-01-17T14:15:00.000Z",
                location: "Ton Duc Thang",
                note: "",
                url: "https://i.imgur.com/4bSNcPK.jpg"
            },
            {
                attendanceForm: "fa80bf1f-7256-4ffd-9550-b6a1656c6997",
                result: 1,
                dateAttendanced: "2024-01-17T14:15:00.000Z",
                location: "Ton Duc Thang",
                note: "",
                url: "https://i.imgur.com/4bSNcPK.jpg"
            },
            {
                attendanceForm: "fa80bf1f-7256-4ffd-9550-b6a1656c6997",
                result: 1,
                dateAttendanced: "2024-01-17T14:15:00.000Z",
                location: "Ton Duc Thang",
                note: "",
                url: "https://i.imgur.com/4bSNcPK.jpg"
            },
        ],
        status: "Pass",
    }

    for (let passIndex = 0; passIndex < 6; passIndex++){
        let temp = JSON.parse(JSON.stringify(a));
        temp.studentDetail.studentID = passIndex + "id";
        temp.studentDetail.studentEmail = passIndex + "email";
        temp.studentDetail.studentName = passIndex + "name";
        temp.attendanceDetail[0].result = 1;
        temp.attendanceDetail[1].result = 1;
        temp.attendanceDetail[2].result = 1;
        temp.attendanceDetail[3].result = 1;
        temp.status = "Pass";
        data.push(temp);
    }

    for (let i = 0; i < 7; i++){
        let temp = JSON.parse(JSON.stringify(a));
        temp.studentDetail.studentID = i + "id";
        temp.studentDetail.studentEmail = i + "email";
        temp.studentDetail.studentName = i + "name";
        temp.attendanceDetail[0].result = 1;
        temp.attendanceDetail[1].result = 1;
        temp.attendanceDetail[2].result = 0;
        temp.attendanceDetail[3].result = 0;
        temp.status = "Ban";
        data.push(temp);
    }

    for (let warningIndex = 0; warningIndex < 4; warningIndex++){
        let temp = JSON.parse(JSON.stringify(a));
        temp.studentDetail.studentID = warningIndex + "id";
        temp.studentDetail.studentEmail = warningIndex + "email";
        temp.studentDetail.studentName = warningIndex + "name";
        temp.attendanceDetail[0].result = 0;
        temp.attendanceDetail[1].result = 1;
        temp.attendanceDetail[2].result = 1;
        temp.attendanceDetail[3].result = 1;
        temp.status = "Warning";
        data.push(temp);
    }

    for (let trungTen = 0; trungTen < 11; trungTen++){
        let temp = JSON.parse(JSON.stringify(a));
        temp.studentDetail.studentID = trungTen + "id";
        temp.studentDetail.studentEmail = trungTen + "email";
        temp.studentDetail.studentName = "Ho Tuan Kiet";
        temp.attendanceDetail[0].result = 0;
        temp.attendanceDetail[1].result = 1;
        temp.attendanceDetail[2].result = 1;
        temp.attendanceDetail[3].result = 1;
        temp.status = "Warning";
        data.push(temp);
    }

    let result = {data: data, all: 28, pass: 6, ban: 7, warning: 11};
    return res.status(200).json(result);
});

TestAPIRouter.get("/getStudentsAttendanceDetailsRecords", async (req,res) => {
    const classID = req.query.classID;
    const formID = req.query.formID;
    const attendanceForm = await attendanceFormRepository.findOne({where: {
        formID: formID,
        classes: {
            classID: classID
        }
    }});

    const attendanceDetails = await attendanceDetailRepository.find(
        {where: {
            attendanceForm: attendanceForm.formID,
        }}
    )

    res.status(200).json({attendanceForm, attendanceDetails});
})
////////////////////////////////////////////////////////////////////
TestAPIRouter.get("/fakeAttendanceDetailsRecord", async (req,res) => {
    const classID = req.query.classID || "";
    const formID = req.query.formID || "";

    let attendanceDetails = []
    
    for (let i = 10; i < 35; i++){
        let id = "520H03" + i;
        let a = {
            studentDetail : id,
            classDetail : classID,
            attendanceForm: formID,
            result: 0,
            dateAttendanced: "2024-03-03T10:57:55.000Z",
            location: "",
            note: "",
            latitude: 0,
            longitude: 0,
            url: "",
        }
        attendanceDetails.push(a);
    }

    res.status(200).json({data: attendanceDetails, all: attendanceDetails.length, present : 0, absent: attendanceDetails.length, late: 0});
})

TestAPIRouter.get("/fakeAttendanceDetailsRecordWith7Presence", async (req,res) => {
    const classID = req.query.classID || "";
    const formID = req.query.formID || "";

    let attendanceDetails = []
    
    for (let i = 10; i < 35; i++){
        let id = "520H03" + i;
        let a = {
            studentDetail : id,
            classDetail : classID,
            attendanceForm: formID,
            result: 0,
            dateAttendanced: "2024-03-03T10:57:55.000Z",
            location: "",
            note: "",
            latitude: 0,
            longitude: 0,
            url: "",
        }
        attendanceDetails.push(a);
    }

    attendanceDetails[0].result = 1;
    attendanceDetails[5].result = 1;
    attendanceDetails[6].result = 1;
    attendanceDetails[8].result = 1;
    attendanceDetails[9].result = 1;
    attendanceDetails[11].result = 1;
    attendanceDetails[16].result = 1;

    res.status(200).json({data: attendanceDetails, all: attendanceDetails.length, present : 7, absent: attendanceDetails.length - 7, late: 0});
})

TestAPIRouter.get("/fakeAttendanceDetailsRecordWith7PresenceAnd2Late", async (req,res) => {
    const classID = req.query.classID || "";
    const formID = req.query.formID || "";

    let attendanceDetails = []
    
    for (let i = 10; i < 35; i++){
        let id = "520H03" + i;
        let a = {
            studentDetail : id,
            classDetail : classID,
            attendanceForm: formID,
            result: 0,
            dateAttendanced: "2024-03-03T10:57:55.000Z",
            location: "",
            note: "",
            latitude: 0,
            longitude: 0,
            url: "",
        }
        attendanceDetails.push(a);
    }

    attendanceDetails[0].result = 1;
    attendanceDetails[5].result = 1;
    attendanceDetails[6].result = 1;
    attendanceDetails[8].result = 1;
    attendanceDetails[9].result = 1;
    attendanceDetails[11].result = 1;
    attendanceDetails[16].result = 1;
    attendanceDetails[12].result = 0.5;
    attendanceDetails[20].result = 0.5;

    res.status(200).json({data: attendanceDetails, all: attendanceDetails.length, present : 7, absent: attendanceDetails.length - 9, late: 2});
})

///////////////////////////////////////////////////////////////////
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


