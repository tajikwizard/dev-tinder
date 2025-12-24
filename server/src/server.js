const express = require("express");
require("dotenv").config();
const dbConnect = require("./config/database");
const User = require("./models/user");
const { validateSignupData } = require("./utils/validation");
const { hashPassword, verifyPassword } = require("./utils/password");
const { signToken,verifyToken } = require("./utils/token");
const cookieParser = require('cookie-parser');
const { userAuth } = require("./middlewares/auth");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


//Signup
app.post("/signup", async (req, res) => {
    
    try {
        validateSignupData(req);
       const hashedPwd = await hashPassword(req.body.password);
        req.body.password = hashedPwd;
        const emailTrimmed = req.body.email.trim().toLowerCase();
  
        const existingUser = await User.findOne({ email: emailTrimmed });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }
        const user = new User(req.body);
        await user.save();
        res.status(201).json({ message: "User created", userId: user._id });

    } catch (error) { 
        res.status(500).json({ message: error.message });
    }
});

//Login
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }
        const userFound = await User.findOne({ email });

        if (!userFound) {
          return res.status(401).json({ message: "Invalid credentials" });
        }
        const isPasswordValid = await verifyPassword(password, userFound.password);

        if (!isPasswordValid) {
          return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = userFound.getJWT()
        res.cookie("token", token, { httpOnly: true });
        res.json({
            message: "Login successful",
            userId: userFound
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Logout
app.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logout successful" });
});

//Get user by email
app.get("/user", userAuth, async (req,res)=>{
    const {email} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        res.status(200).json({
            message:"User fetched successfully",
            user
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

//Get profile
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      data: user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


//Get all users
app.get("/feed", userAuth, async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({
            message: "User list fetched successfully",
            users
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


//Delete user by ID
app.delete("/user",userAuth, async (req,res)=>{
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete(userId);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        res.status(200).json({
            message:"User deleted successfully",
            user
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Update user by ID
app.put("/user",userAuth, async (req, res) => {
    const userId = req.body.userId;
    const updateData = req.body;
    try {
        const user = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            message: "User updated successfully",
            user
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }   
});
// Database Connection
(async () => {
    try {
        await dbConnect(); 

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Server startup failed");
        process.exit(1);
    }
})();
