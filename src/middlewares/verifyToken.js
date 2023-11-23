import jwt from "jsonwebtoken";
const secretKey = process.env.SECRETKEY;

const verifyToken = (req,res,next) => {
    const token = req.headers.authorization;

    if (!token){
        return res.status(403).json({message: 'Token is not provided'})
    }
    jwt.verify(token, secretKey, (err,decoded) => {
        if (err){
            return res.status(401).json({message: 'Token is valid'})
        }
        req.user = decoded;
        next();
    });
};

module.exports = { verifyToken };