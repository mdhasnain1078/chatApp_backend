import mongoose, { Schema } from "mongoose";

const standingPersonSchema = new mongoose.Schema({
    person: {
        type:Schema.Types.ObjectId,
        ref: "User"
    },
    voters:[
        {
            type:Schema.Types.ObjectId,
            ref: "User" 
        }
    ]
}, {timestamps: true});

export const StandingPerson = mongoose.model("StandingPerson", standingPersonSchema);