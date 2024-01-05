const Authorization = (role) => {
    return (req, res, next) => {
        if (req.payload.role == role){
            next();
        }else {
            res.status(403).json({message: "Access denied"});
        }
    }
}

export default Authorization;