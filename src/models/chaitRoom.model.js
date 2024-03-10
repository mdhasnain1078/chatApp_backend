import mongoose from "mongoose";

const chaitroomSchema = mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],

    messages:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"message"
        }
    ]
}, {timestams: true})

export const Chaitroom = mongoose.model("Chaitroom", chaitroomSchema);