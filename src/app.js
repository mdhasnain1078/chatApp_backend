import express from 'express'
import cors from 'cors'
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended: true, limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


// routes import
import userRouter from './routes/user.routes.js'
import messageRouter from './routes/message.routes.js'
import statusRouter from './routes/status.routes.js'
import chaitroomRouter from './routes/chaitroom.routes.js'
//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/status", statusRouter);
app.use("/api/v1/chaitroom", chaitroomRouter);


export {app}

