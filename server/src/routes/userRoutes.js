const express = require("express");
const { userAuth } = require("../middlewares/authMiddleware");
const userRouter = express.Router();
const User = require("../models/userSchema");
const Connection = require("../models/connectionSchema");


// ----- Get all the pending connection requests for the logged-in user -----
userRouter.get("/user/requests/pending", userAuth, async (req, res) => {
  const userId = req.userId;
  try {
    const connections = await Connection.find({
      toUserId: userId,
      status: "interested",
    }).populate("fromUserId", ["firstName", "email"]).populate("toUserId",["firstName","email"]);
    res.status(200).json({
      message:"All requests",
      data:connections
    })
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// --- Get all the matches ----
userRouter.get("/user/connections", userAuth, async (req,res)=>{
  try {
    const loginUserId = req.userId;

    const connections = await Connection.find({
      $or:[
        {toUserId:loginUserId, status:"accepted"},
        {fromUserId:loginUserId,status:"accepted"}
      ]
    }).populate("fromUserId",["firstName", "age", "email","skills",]).populate("toUserId",["firstName", "age", "email","skills",])


    const data = connections.map((row)=> {
      if(row.fromUserId._id.toString() ===loginUserId.toString()){
       return row.toUserId;
      }
       return row.fromUserId;
    });

    res.status(200).json({
      data
    })
  } catch (error) {
    res.status(400).json({
      message:err.message
    })
  }
})
module.exports = userRouter;