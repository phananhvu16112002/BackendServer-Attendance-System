import express from "express";
import TokenController from "../controllers/TokenController";

const TokenRouter = express.Router();

TokenRouter.get("/refreshAccessToken", TokenController.refreshAccessToken);

export default TokenRouter;