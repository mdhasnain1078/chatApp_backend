import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";

const allowTOparticipate = asyncHandler(async(req, res)=>{
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "UserId is not valid");
    }

    const user = await User.findById(userId)

    if(!user){
        throw new ApiError(400, "user is not exist");
    }

    user.isAllowTOParticipate = true;
    await user.save({ validateBeforeSave: false });

    return res
    .status(200)
    .json(new ApiResponse(200, user, "allowed for participation succesfull"));
});


const dontallowTOparticipate = asyncHandler(async(req, res)=>{
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "UserId is not valid");
    }

    const user = await User.findById(userId)

    if(!user){
        throw new ApiError(400, "user is not exist");
    }

    user.isAllowTOParticipate = false;
    await user.save({ validateBeforeSave: false });

    

    // return res
    // .status(200)
    // .json(new ApiResponse(200, user, "allowed for participation succesfull"));
});



export {allowTOparticipate, dontallowTOparticipate}
