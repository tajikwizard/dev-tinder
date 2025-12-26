const express = require("express");
const User = require("../models/userSchema");
const requestRoutes = express.Router();


requestRoutes.post("/request", async (req, res) => {});

module.exports = requestRoutes;