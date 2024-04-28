"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const TokenController_1 = __importDefault(require("../controllers/TokenController"));
const TokenRouter = express_1.default.Router();
TokenRouter.get("/refreshAccessToken", TokenController_1.default.refreshAccessToken);
exports.default = TokenRouter;
