import mongoose, { isValidObjectId } from "mongoose";
import { ObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Chaitroom } from "../models/chaitRoom.model.js";
import { ApiError } from "../utils/apiError.js";
import { Message } from "../models/message.model.js";
import { ApiResponse } from "../utils/apiResponse.js";



const addMessage = asyncHandler(async (req, res)=>{
    const {userId, content} = req.body;
    const currentUserId = req.user?._id;
    
    if(!isValidObjectId(userId)){
        throw new ApiError(400, "invalid user id")
    }

    if (content.trim() === "") {
        throw new ApiError(400, "content is empty")
    }

    // find if chait room exist
    let chaitroom = await Chaitroom.findOne({
        participants: {
            $all : [userId, currentUserId]
        }
    })

    if(!chaitroom){
        chaitroom = await Chaitroom.create({
                participants: [
                    currentUserId,
                    userId
                ],
                messages: []
        })

        if (!chaitroom) {
            throw new ApiError(400, "facing problem in making chatroom please try again")
        }
    }


    const message = await Message.create({
        sender: currentUserId,
        reciever: userId,
        content: content
    })

    if(!message){
        throw new ApiError(400, "Can not message")
    }

    const chaitRoomId = chaitroom._id.toString();
    const messageId = message._id.toString();
    // console.log(chaitRoomId)
    // console.log(messageId)
    chaitroom = await Chaitroom.findByIdAndUpdate(chaitRoomId, {
        $push: { messages: messageId }
    },
    {
        new: true,
    });

    if (!chaitroom) {
        throw new ApiResponse(400, "do not add message")
    }
    return res.status(200).json(new ApiResponse(200, {message, chaitRoomId}, "Message send succesfully"))
    

})


const deleteMessage = asyncHandler( async (req, res)=>{
    const {chaitRoomId, messageId} = req.body;

    if(!isValidObjectId(messageId)){
        throw new ApiError(400, "invalid messageId")
    }
    if(!isValidObjectId(chaitRoomId)){
        throw new ApiError(400, "invalid chaitRoomId")
    }

    const chaitroom = await Chaitroom.findByIdAndUpdate(
        chaitRoomId,
        {
            $pull: { messages: messageId }
        },
        {
            new: true
        }
    );

    if(!chaitroom){
        throw new ApiError(200, "chaitroom not found")
    }

    const message = await Message.findByIdAndDelete(messageId);

    if(!message){
        throw new ApiError(200, "message not found")
    }

    return res.status(200).json(new ApiResponse(200, true, "Delete message successfully"))

})


const updateMessage = asyncHandler(async (req, res)=>{
    const {messageId, content} = req.body;
    if(!isValidObjectId(messageId)){
        throw new ApiError(400, "invalid messageId")
    }
    if (content.trim() === "") {
        throw new ApiError(400, "content is empty")
    }

    const message = await Message.updateOne({
        _id:messageId
    },
    {
        $set:{content: content}
    }
    )

    // if (message.modifiedCount === 0) {
    //     throw new ApiError(400, "not update")
    // }
    if (!message) {
        throw new ApiError(400, "not update")
    }

    return res.status(200).json(new ApiResponse(200, message, "update successfully"))
})

const getAllMessage = asyncHandler(async (req, res)=>{
    const {chaitRoomId} = req.params;

    const allMessage = await Chaitroom.aggregate([
        {
            $match:{_id: new mongoose.Types.ObjectId(chaitRoomId)}
        },
            {
              $lookup: {
                from: "messages",
                localField: "messages",
                foreignField: "_id",
                pipeline: [
                  {
                    $lookup: {
                      from: "users",
                      localField: "sender",
                      foreignField: "_id",
                      as: "senderDetails"
                    }
                  },
                  {$project: {
                    content: 1,
                    createdAt: 1,
                    senderDetails: { $arrayElemAt: ["$senderDetails", 0] },
                    recieverDetails: { $arrayElemAt: ["$recieverDetails", 0] }
                  }},
                  
                ],
                as: "allMessages"
              }
            },
            {
                $sort: {
                  "allMessages.createdAt": -1 // Sort in descending order based on createdAt
                }
              },
          ]
        )

    return res.status(200).json(new ApiResponse(200, allMessage, "Got all contects"))

})


export {addMessage, deleteMessage, updateMessage, getAllMessage}