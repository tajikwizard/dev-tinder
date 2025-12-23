const express = require("express");
require("dotenv").config();
const dbConnect = require("./config/database");
const User = require("./models/user");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//Signup
app.post("/signup", async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({
                message: "Request body is missing"
            });
        }
        const { firstName, lastName, email, password } = req.body;
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }
        const user = await User.create({
            firstName,
            lastName,
            email,
            password
        });

        res.status(201).json({
            message: "User created",
            userId: user._id
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

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

        if (userFound.password !== password) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.json({
            message: "Login successful",
            userId: userFound._id
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
