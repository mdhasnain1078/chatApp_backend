import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { Chaitroom } from "../models/chaitRoom.model.js";
import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";

const getAllChaitRooms = asyncHandler(async (req, res)=>{
    const userId = req.user?._id;
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid User Id")
    }

    const allChaitRooms = await Chaitroom.find({
        participants:{_id:userId}
    })

    if(!allChaitRooms){
        throw new ApiError(400, "allChaitRooms not found")
    }

    return res.status(200).json(new ApiResponse(200, allChaitRooms, "Fetch all Chaitrooms sucessfully"))
})

const deleteChaitRoom = asyncHandler(async(req, res) => {
    const { userId } = req.params;
    const chaitRooms = await Chaitroom.findOne({
        participants: { _id: userId, _id: req.user?._id }
    });

    if (!chaitRooms) {
        return res.status(404).json(new ApiResponse(404, null, "Chaitroom not found"));
    }

    const chaitRoomId = chaitRooms._id.toString();

    const chaitroom = await Chaitroom.findById(chaitRoomId);

    if (chaitroom) {
        const messageIdsToDelete = chaitroom.messages;

        if (messageIdsToDelete.length > 0) {
            const result = await Message.deleteMany({
                _id: { $in: messageIdsToDelete.map(id => new mongoose.Types.ObjectId(id)) }
            });

            console.log(`Deleted ${result.deletedCount} messages.`);
        }
    }

    await Chaitroom.findByIdAndDelete(chaitRoomId);

    return res.status(200).json(new ApiResponse(200, true, "Chaitroom and all messages deleted successfully"));
});


export {getAllChaitRooms, deleteChaitRoom}

  