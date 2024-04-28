"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Authorization = (role) => {
    return (req, res, next) => {
        if (req.payload.role == role) {
            next();
        }
        else {
            res.status(403).json({ message: `Access denied. This service is intended only for ${role}` });
        }
    };
};
exports.default = Authorization;
