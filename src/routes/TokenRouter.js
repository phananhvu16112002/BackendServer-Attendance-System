import express from "express";
import TokenController from "../controllers/TokenController";
import verifyRefreshToken from "../middlewares/verifyRefreshToken";

const TokenRouter = express.Router();

TokenRouter.post("/refreshAccessToken", verifyRefreshToken, TokenController.refreshAccessToken);

export default TokenRouter;