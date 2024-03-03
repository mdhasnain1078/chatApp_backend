import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {allowTOparticipate, dontallowTOparticipate} from '../controllers/admin.controller.js'

const router = Router();

// secure routes

router.route("/allow/:userId").post(verifyJWT, allowTOparticipate);
router.route("/dontallow/:userId").post(verifyJWT, dontallowTOparticipate);

export default router