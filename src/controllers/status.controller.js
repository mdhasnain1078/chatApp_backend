import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";

const online = asyncHandler(async (req, res)=>{
    await User.updateOne({
        _id:req.user?._id
    },
    {
        status:true
    },
    {new: true}
    )

    return res.status(200).json(new ApiResponse(200, true, "Online"))
    // return res.status(200).json(new ApiResponse(200, {message, chaitRoomId}, "Message send succesfully"))

})
const offline = asyncHandler(async (req, res)=>{
    await User.updateOne({
        _id:req.user?._id
    },
    {
        status:false
    },
    {new: true}
    )

    return res.status(200).json(new ApiResponse(200, false, "Offline"))
})

export {offline, online}