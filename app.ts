import express, {Request, Response} from "express";
import DB from './src/config/db.config';
import bodyParser from "body-parser";
import StudentRouter from "./src/routes/StudentRouter";

const app = express();
DB();
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json());
app.use("/api/student", StudentRouter)

app.listen(8080, () => console.log("Hello"))
