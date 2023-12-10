import 'dotenv/config';
import jwt from "jsonwebtoken";

class Token {
    refreshAccessToken = (req,res) => {
        try{
            const studentID = req.user.studentID;
            const accessToken = jwt.sign({studentID: studentID}, process.env.STUDENT_ACCESS_TOKEN_SECRET,{ expiresIn: '1h' })
            res.status(200).json({message: "Refresh access token successfully", accessToken: accessToken})
        }catch{
            res.status(500).json({message: "Internal Server"});
        }
    }
}

export default new Token();