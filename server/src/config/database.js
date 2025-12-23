const mongoose = require("mongoose");

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("DB connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = dbConnect;
