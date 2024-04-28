"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class TokenController {
    constructor() {
        this.refreshAccessToken = (req, res) => {
            try {
                const refreshToken = req.headers.authorization;
                console.log('RefreshToken AccessToken running' + refreshToken);
                if (!refreshToken) {
                    return res.status(498).json({ message: "Refresh Token is not provided" });
                }
                else {
                    const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                    let userID = decoded.userID;
                    let role = decoded.role;
                    const accessToken = jsonwebtoken_1.default.sign({ userID, role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' });
                    return res.status(200).json({ message: "Access Token Successfully Refreshed", accessToken: accessToken });
                }
            }
            catch (e) {
                if (e.message == "invalid token") {
                    return res.status(498).json({ message: 'Refresh Token is invalid' }); //Flutter recieved 498, send error message to client
                }
                else if (e.message == "jwt expired") {
                    return res.status(401).json({ message: 'Refresh Token is expired' }); //Flutter recieved 401, immediately send a refresh token to refresh new access token
                }
                else {
                    return res.status(500).json({ message: e.message });
                }
            }
        };
    }
}
exports.default = new TokenController();
