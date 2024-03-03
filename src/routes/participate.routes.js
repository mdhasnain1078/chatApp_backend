import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {particiapte, getStandingPersons, deleteStandingPersonById, getWinningParticipant} from'../controllers/participate.controller.js'
const router = Router();

// secure routes

router.route("/particiapte/:userId").post(verifyJWT, particiapte);
router.route("/allparticipates").get(verifyJWT, getStandingPersons);
router.route("/remove/:standingPersonId").post(verifyJWT, deleteStandingPersonById);
router.route("/winningperson").get(verifyJWT, getWinningParticipant);

export default router