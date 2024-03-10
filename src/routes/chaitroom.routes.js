import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {getAllChaitRooms, deleteChaitRoom} from '../controllers/chaitroom.controller.js'
const route = Router();

route.route("/getallchaitrooms").get(verifyJWT, getAllChaitRooms)
route.route("/deleteChaitRoom/:userId").post(verifyJWT, deleteChaitRoom)


export default route;

