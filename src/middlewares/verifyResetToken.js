import jwt from "jsonwebtoken";
const secretKey = process.env.STUDENT_RESET_TOKEN_SECRET;

const verifyResetToken = (req, res, next) => {
    try{
        const token = req.headers.authorization;
        if (!token) {
            return res.status(403).json({ message: 'Reset Token is not provided' })
        }
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Reset Token is invalid' })
            }
            req.user = decoded;
            next();
        });
    }catch(e){
        res.status(500).json({message: "Internal Server"});
    }
};

export default verifyResetToken;