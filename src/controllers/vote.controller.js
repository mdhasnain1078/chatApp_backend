import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { StandingPerson } from "../models/standingPerson.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVote = asyncHandler(async (req, res) => {
    const { StandingPersonId } = req.params;
  
    if (!isValidObjectId(StandingPersonId)) {
      throw new ApiError(400, "Standing person id is invalid");
    }
  
    const standingPerson = await StandingPerson.findById(StandingPersonId);
  
    if (!standingPerson) {
      throw new ApiError(400, "Standing person does not exist");
    }
  
    const voterId = req.user?._id;
  
    // Check if the voter has already voted for this StandingPerson
    const isVoterVotedYou = standingPerson.voters.some((voter) => voter._id.equals(voterId));
  
    if (isVoterVotedYou) {
      // Remove the vote
      await StandingPerson.findByIdAndUpdate(
        StandingPersonId,
        { $pull: { voters: voterId } },
        { new: true } // Return the updated document
      );
  
      return res.status(200).json(new ApiResponse(200, { isVoted: false }, "Vote removed successfully"));
    }
  
    // Check if the voter has voted for any StandingPerson
    const isVoterVotedOther = standingPerson.voters.some((voter) => voter._id.equals(voterId));
  
    if (isVoterVotedOther) {
      return res.status(200).json(new ApiResponse(200, { isVoted: true }, "You already voted for another StandingPerson"));
    }
  
    // Add the vote
    await StandingPerson.findByIdAndUpdate(
      StandingPersonId,
      { $addToSet: { voters: { _id: voterId } } },
      { new: true } // Return the updated document
    );
  
    return res.status(200).json(new ApiResponse(200, { isVoted: true }, "Vote added successfully"));
  });
  
  


const getVoterById = asyncHandler(async(req, res)=>{
    const {userId} = req.params;
    if(!isValidObjectId(userId)){
        throw new ApiError(400, "invalid user id");
    }
    
    const user = User.findById(userId);

    if (!user) {
        throw new ApiError(400, "user not exist");
    }

    return res.status(200).json(new ApiResponse(200, user, "user fetched successfully"));
})

export {
    toggleVote,
    getVoterById
}