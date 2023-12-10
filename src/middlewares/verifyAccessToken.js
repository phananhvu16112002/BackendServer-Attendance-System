import jwt from "jsonwebtoken";
const secretKey = process.env.STUDENT_ACCESS_TOKEN_SECRET;

const verifyAccessToken = (req, res, next) => {
    try{
        const token = req.headers.authorization;
        if (!token) {
            return res.status(403).json({ message: 'Access Token is not provided' })
        }else{
            const decoded = jwt.verify(token, secretKey);
            req.user = decoded;
            next();
        }
    }catch(e){
        if (e.message == "invalid token"){
            return res.status(403).json({ message: 'Access Token is invalid' })
        }else if (e.message == "jwt expired"){
            return res.status(403).json({ message: 'Access Token is expired' })
        }else {
            res.status(500).json({message: "Internal Server"});
        }
    }
};

export default verifyAccessToken;