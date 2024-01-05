import jwt from "jsonwebtoken";
const secretKey = process.env.RESET_TOKEN_SECRET;

const VerifyResetToken = (req, res, next) => {
    try{
        const token = req.headers.authorization;
        if (!token) {
            return res.status(498).json({ message: 'Reset Token is not provided' })
        }
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.status(498).json({ message: 'Reset Token is invalid' })
            }
            req.payload = decoded;
            next();
        });
    }catch(e){
        res.status(500).json({message: "Internal Server"});
    }
};

export default VerifyResetToken;