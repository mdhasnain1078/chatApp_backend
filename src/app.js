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
import adminRouter from './routes/admin.routes.js'
import particiapteRouters from './routes/participate.routes.js'
import voteRouters from './routes/vote.routes.js'

//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/takepart", particiapteRouters);
app.use("/api/v1/vote", voteRouters);

export {app}

