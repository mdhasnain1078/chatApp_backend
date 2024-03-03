import mongoose from "mongoose";
import { DB_NAME } from "../contants.js";

const connectDB = async()=>{
    console.log(`OK`)
    try {
        // const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        const connectionInstance = await mongoose.connect(`mongodb+srv://hasnainshaikh62479:hasnainshaikh62479@cluster0.0zoz2r2.mongodb.net/${DB_NAME}`)
        console.log(`\n MongoDB Connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED: ", error);
        process.exit(1)
    }
}

export default connectDB