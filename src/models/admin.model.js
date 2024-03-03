import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt'

const adminSchema = new mongoose.Schema({
    admin:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    password:{
        type:String,
        required:[true, "Password is required"],
    }
}, {timestamps: true})

adminSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

adminSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
}

export const Admin = mongoose.model("Admin", adminSchema);