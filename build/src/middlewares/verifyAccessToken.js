"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretKey = process.env.ACCESS_TOKEN_SECRET;
const VerifyAccessToken = (req, res, next) => {
    try {
        const accessToken = req.headers.authorization;
        if (!accessToken) {
            return res.status(498).json({ message: 'Access Token is not provided' });
        }
        else {
            const decoded = jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            req.payload = decoded;
            console.log(req.payload);
            next();
        }
    }
    catch (e) {
        if (e.message == "invalid token") {
            return res.status(498).json({ message: 'Access Token is invalid' }); //Flutter recieved 498, send error message to client
        }
        else if (e.message == "jwt expired") {
            return res.status(401).json({ message: 'Access Token is expired' }); //Flutter recieved 401, immediately send a refresh token to refresh new access token
        }
        else {
            return res.status(501).json({ message: e.message });
        }
    }
};
exports.default = VerifyAccessToken;
