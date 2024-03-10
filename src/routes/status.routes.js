import { Router } from "express";
import { online, offline } from "../controllers/status.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const route = Router();

route.route("/online").patch(verifyJWT, online)
route.route("/offline").patch(verifyJWT, offline)

export default route