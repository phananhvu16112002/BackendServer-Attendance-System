import express, {Request, Response} from "express";
import DB from './src/config/db.config';
import bodyParser from "body-parser";
import StudentRouter from "./src/routes/StudentRouter";
import TestRouter from "./src/routes/TestRouter";
import fileUpload from "express-fileupload";
import TokenRouter from "./src/routes/TokenRouter";

const app = express();
DB();

app.use(fileUpload());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());

app.use("/api/student", StudentRouter)
app.use("api/token", TokenRouter)
app.use("/test", TestRouter)

app.listen(8080, () => console.log("Hello"))
