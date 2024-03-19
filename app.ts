import express, {Request, Response} from "express";
import DB from './src/config/db.config';
import "reflect-metadata";
import bodyParser from "body-parser";
import StudentRouter from "./src/routes/StudentRouter";
import TestRouter from "./src/routes/TestRouter";
import fileUpload from "express-fileupload";
import UploadImageService from "./src/services/UploadImageService";
import StudentClassService from "./src/services/StudentClassService";
import TeacherRouter from "./src/routes/TeacherRouter";
import cors from "cors";
import TokenRouter from "./src/routes/TokenRouter";
import TestAPIRouter from "./src/routes/TestAPIRouter";
import AdminRouter from "./src/routes/AdminRouter";

const app = express();
app.use(cors())
DB();

app.use(fileUpload());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());

app.use("/api/admin", AdminRouter)
app.use("/api/student", StudentRouter)
app.use("/api/teacher", TeacherRouter)
app.use("/api/token", TokenRouter)
app.use("/test", TestRouter)

app.use("/test/api", TestAPIRouter)

app.listen(8080, () => {
    console.log("Hello");
})
