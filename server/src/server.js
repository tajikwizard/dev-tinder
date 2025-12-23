const express = require("express");
require("dotenv").config();
const dbConnect = require("./config/database");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
