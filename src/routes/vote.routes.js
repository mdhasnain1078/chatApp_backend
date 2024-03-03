import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleVote } from "../controllers/vote.controller.js";
const router = Router();

router.route("/:StandingPersonId").post(verifyJWT, toggleVote);
// router.route("/vote/toggleVote").post(verifyJWT, toggleVote);

export default router