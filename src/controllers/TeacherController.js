import ClassService from "../services/ClassService";
import TeacherService from "../services/TeacherService";
import jwt from "jsonwebtoken";

const teacherService = TeacherService;
const classService = ClassService;

class TeacherController {
    register = async (req,res) => {
        const email = req.body.email;
        const password = req.body.password;
        const username = req.body.username;

        try {
            const teacher = await teacherService.checkTeacherExist(username);
            if (teacher == null) {
                return res.status(422).json({message: "Username must be your ID"});
            }
            if (teacher.active){
                return res.status(422).json({message: "Account's already been activated. Please login!"});
            }

            //Create OTP and hash OTP, password
            const OTP = otpGenerator.generate(6, { digits: true, upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false});
            const salt = await bcrypt.genSalt(10)
            const hashOTP = await bcrypt.hash(OTP, salt)
            const hashPassword = await bcrypt.hash(password, salt)

            //Use Google Access Token to send email
            if (await EmailService.sendEmail(email, OTP) == false){
                return res.status(503).json({ message: 'OTP failed' })
            }

            await teacherService.updateTeacherPasswordAndOTP(teacher, hashPassword, hashOTP);

            res.status(200).json({ message: 'OTP has been sent to your email' });
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    }

    verifyRegister = async (req,res) => {
        try {
            const email = req.body.email;
            const OTP = req.body.OTP;
            if (await teacherService.checkTeacherOTPRegister(email, OTP) == false){
                return res.status(422).json({message: "OTP is not valid"});
            }
            return res.status(200).json({ message: 'OTP is valid' });
        } catch (e) {
            return res.status(500).json({ message: 'OTP is not valid' });
        }
    }

    login = async (req,res) => {
        try{
            const email = req.body.email;
            const password = req.body.password;
            const teacherID = email.split('@')[0];

            let teacher = await teacherService.checkTeacherExist(teacher);

            if (teacher == null) {
                return res.status(422).json({message: "Account does not exist"});
            }

            if (teacher.active == false){
                return res.status(422).json({message : "Account has not been activated yet. Please register!"});
            }

            if (await teacherService.login(teacher, email, password) == false){
                return res.status(422).json({message: "Email or password incorrect"});
            }

            const accessToken = jwt.sign({userID: teacherID, role: "teacher"}, process.env.ACCESS_TOKEN_SECRET,{ expiresIn: '30s' })
            const refreshToken = jwt.sign({userID: teacherID, role: "teacher"}, process.env.REFRESH_TOKEN_SECRET,{ expiresIn: '1m' })

            await teacherService.updateTeacherAccessTokenAndRefreshToken(accessToken, refreshToken);
            return res.status(200).json({
                message: "Login Successfully",
                refreshToken: refreshToken,
                accessToken: accessToken,
                teacherID: teacherID,
                teacherEmail: email,
                teacherName: teacher.teacherName
            });
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    forgotPassword = async (req,res) => {
        try{
            const email = req.body.email;
            const teacherID = email.split('@')[0];

            let teacher = await teacherService.checkTeacherExist(teacherID);
            if (teacher == null){
                return res.status(422).json({message: "Email address does not exist"});
            }

            if (teacher.active == false){
                return res.status(422).json({message: "Account with this email address is not active"});
            }

            //Generate OTP
            const OTP = otpGenerator.generate(6, { digits: true, upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
            const salt = await bcrypt.genSalt(10)
            const hashOTP = await bcrypt.hash(OTP, salt)

            //Send OTP
            if (await EmailService.sendEmail(email, OTP) == false){
                return res.status(503).json({ message: 'OTP failed' });
            }

            await teacherService.updateTeacherOTP(teacher, hashOTP);
            res.status(200).json({ message: 'OTP has been sent to your email' });

        } catch (e){
            console.error(error);
            return res.status(500).json({ message: e.message });
        }
    }

    verifyForgotPassword = async (req,res) => {
        try {
            const email = req.body.email;
            const OTP = req.body.OTP;
            const teacherID = email.split('@')[0];

            let teacher = await teacherService.checkTeacherExist(teacherID);
            if (teacher == null){
                return res.status(422).json({message: "Email address does not exist"})
            }
            if (teacher.active == false){
                return res.status(422).json({message: "Account with this eamil address is not active"});
            }
            if (teacherService.checkTeacherOTPExpired(teacher)){
                return res.status(422).json({message: "OTP expired"});
            }
            if (await teacherService.checkTeacherOTPReset(teacher, OTP) == false){
                return res.status(422).json({message:"OTP is not valid"});
            }
            const resetToken = jwt.sign({email: email}, process.env.RESET_TOKEN_SECRET, {expiresIn: '1m'});
            await teacherService.updateTeacherResetToken(teacher, resetToken);
            res.status(200).json({message:"OTP is valid", resetToken: resetToken});
        } catch (e) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    resetPassword = async (req,res) => {
        try{
            const email = req.body.email;
            const newPassword = req.body.newPassword;
            const teacherID = email.split('@')[0];

            let teacher = await teacherService.checkTeacherExist(teacherID);
            if (teacher == null){
                return res.status(422).json({message: "Email address does not exist"});
            }
            if (teacher.active == false){
                return res.status(422).json({message: "Account with this email address is not active"});
            }
            await teacherService.updateTeacherPassword(teacher, newPassword);
            res.status(200).json({ message: "Reset Password successfully" });
        } catch (e) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    resendOTP = async (req,res) => {
        try{
            const email = req.body.email;
            const teacherID = email.split('@')[0];

            let teacher = await teacherService.checkTeacherExist(teacherID);
            if (teacher == null){
                return res.status(422).json({message: "Email address does not exist"});
            }
            if (teacher.active == false){
                return res.status(422).json({message: "Account with this email address is not active"});
            }
            //Generate OTP
            const OTP = otpGenerator.generate(6, { digits: true, upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
            const salt = await bcrypt.genSalt(10)
            const hashOTP = await bcrypt.hash(OTP, salt)
            //Send OTP
            if (await EmailService.sendEmail(email, OTP) == false){
                return res.status(503).json({ message: 'OTP failed' });
            }
            await teacherService.updateTeacherOTP(teacher, OTP);
            res.status(200).json({ message: 'OTP has been sent to your email' });
        } catch (e) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }


    getClasses = async (req,res) => {
        //Will need to change to get payload
        const teacherID = req.body.teacherID;

        const classes = await classService.getClassesByTeacherID(teacherID);

        if (classes == null){
            return res.status(503).json({message : "Teacher is not enrolled in any class"});
        }

        res.status(200).json(classes);
    }

    getClassesWithCourse = async (req,res) => {
        const teacherID = req.body.teacherID;
        const classes = await classService.getClassesWithCoursesByTeacherID(teacherID);

        if (classes == null){
            return res.status(503).json({message : "Teacher is not enrolled in any class"});
        }

        res.status(200).json(classes);
    }
}

export default new TeacherController();