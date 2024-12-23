// routes/userRoutes.js
import express from "express";
import {registerUser, loginUser,recentRegisteredUser,editProfile,userDetails,deleteProfile,logout} from '../controller/userController.js'
import authMiddleware from "../middleware/authMiddleware.js";
const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/resent-resister-user",recentRegisteredUser)
userRouter.put("/edit-profile",authMiddleware,editProfile)
userRouter.get('/user-details/:id',authMiddleware,userDetails)
userRouter.delete("/delete-profile", authMiddleware, deleteProfile);
userRouter.get("/logout",authMiddleware,logout)


export default userRouter
