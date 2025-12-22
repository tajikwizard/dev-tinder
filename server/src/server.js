const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const app = express();

app.get("/",(req,res)=>{
    res.json({
        message:"Success!"
    })
})

app.listen(PORT, ()=>{
    console.log(`Server runnning on port ${PORT}`);    
});

