"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretKey = process.env.RESET_TOKEN_SECRET;
const VerifyResetToken = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(498).json({ message: 'Reset Token is not provided' });
        }
        jsonwebtoken_1.default.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.status(498).json({ message: 'Reset Token is invalid' });
            }
            req.payload = decoded;
            if (req.body.email != req.payload.email) {
                return res.status(403).json({ message: "Access denied" });
            }
            next();
        });
    }
    catch (e) {
        res.status(500).json({ message: "Internal Server" });
    }
};
exports.default = VerifyResetToken;
