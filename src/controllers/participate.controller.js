import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { StandingPerson } from "../models/standingPerson.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { json } from "express";


const getStandingPersons = async(req, res)=>{
    try {
        const allStandingPersons = await StandingPerson.aggregate([
            {
              $match: {} // This stage matches all documents
            },
            {
                $lookup: {
                  from: "users", // Assuming your User collection is named "users"
                  localField: "person",
                  foreignField: "_id",
                  as: "personData"
                }
              },
              {
                $lookup: {
                  from: "users", // Assuming your User collection is named "users"
                  localField: "voters",
                  foreignField: "_id",
                  as: "votersData"
                }
              },
              {
                  $addFields:{
                      votercount: {
                          $size: "$votersData",
                      },
                  }
              },
              {
                  $project:{
                      _id:1,
                      personData:1,
                      votersData:1,
                      votercount:1,
                  }
              }
          ]);
    
    return res.status(200).json(new ApiResponse(200, allStandingPersons, "All Participantes fatched"));
    } catch (error) {
        throw new ApiError(400, "Fail to fetched participants");
    }
}

const particiapte = asyncHandler(async(req, res)=>{
    const {userId} = req.params;

    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user id")
    }

    const isAlreadyparticiapted = await StandingPerson.findOne({
        person:userId
    });
    if(isAlreadyparticiapted){
        throw new ApiError(400, "you are already participated")
    }

    const user = await User.findOne({
        _id: userId,
        isAllowTOParticipate: true
      });

      if (!user) {
        throw new ApiResponse(404, null, "User not found or not allowed to participate");
      }

    const particiapted = await StandingPerson.create({
        person: userId,
        voters:[]
    })

    if (!particiapted) {
        throw new ApiError(400, "somthing went wrong while participating in election")
    }

    const standingPerson = await StandingPerson.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(particiapted._id)}
        },
        {
          $lookup: {
            from: "users", // Assuming your User collection is named "users"
            localField: "person",
            foreignField: "_id",
            as: "personData"
          }
        },
        {
          $lookup: {
            from: "users", // Assuming your User collection is named "users"
            localField: "voters",
            foreignField: "_id",
            as: "votersData"
          }
        },
        {
            $addFields:{
                votercount: {
                    $size: "$votersData",
                },
            }
        },
        {
            $project:{
                _id:1,
                personData:1,
                votersData:1,
                votercount:1,
            }
        }
      ]);
  
      // Check if the standingPerson is found
      if (standingPerson.length === 0) {
        return res.status(404).json(new ApiResponse(404, null, "StandingPerson not found"));
      }
  
      // If the standingPerson is found, return the result
      return res.status(200).json(new ApiResponse(200, standingPerson, "StandingPerson details retrieved"));

})


const deleteStandingPersonById = asyncHandler(async (req, res) => {
    const { standingPersonId } = req.params;
  
    try {
      console.log(`Deleting StandingPerson with ID: ${standingPersonId}`);
  
      const deletedStandingPerson = await StandingPerson.findByIdAndDelete(
        new mongoose.Types.ObjectId(standingPersonId)
      );
  
      // Check if the standing person was found and deleted
      if (!deletedStandingPerson) {
        console.log(`StandingPerson with ID ${standingPersonId} not found`);
        return res.status(404).json(new ApiResponse(404, null, "StandingPerson not found"));
      }
  
      console.log(`StandingPerson with ID ${standingPersonId} deleted successfully`);
      return res.status(200).json(new ApiResponse(200, deletedStandingPerson, "StandingPerson deleted successfully"));
    } catch (error) {
      console.error(error);
      return res.status(500).json(new ApiResponse(500, null, "Internal server error"));
    }
  });

  const getWinningParticipant = asyncHandler(async(req, res)=>{
    const standingPerson = await StandingPerson.aggregate([
      {
        $match: {}
      },

      {
        $lookup: {
          from: "users", // Assuming your User collection is named "users"
          localField: "person",
          foreignField: "_id",
          as: "personData"
        }
      },

      {
        $lookup: {
          from: "users", // Assuming your User collection is named "users"
          localField: "voters",
          foreignField: "_id",
          as: "votersData"
        }
      },

      {
          $addFields:{
              votercount: {
                  $size: "$votersData",
              },
          }
      },

      {
        $sort:{
          votercount:-1,
        }
      },

      {
          $project:{
              _id:1,
              personData:1,
              votersData:1,
              votercount:1,
          }
      }
    ]);
    return res.status(200).json(new ApiResponse(200, standingPerson, "get winning person suceesfull"));
  });
  
export {particiapte, getStandingPersons, deleteStandingPersonById, getWinningParticipant}
