import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import { addMessage, deleteMessage, updateMessage, getAllMessage } from "../controllers/message.controller.js";
const route = Router()

route.route("/addmessage").post(verifyJWT, addMessage);
route.route("/deletemessage").post(verifyJWT, deleteMessage);
route.route("/deletemessage").post(verifyJWT, deleteMessage);
route.route("/updatemessage").post(verifyJWT, updateMessage);
route.route("/getallmessage/:chaitRoomId").post(verifyJWT, getAllMessage);

export default route