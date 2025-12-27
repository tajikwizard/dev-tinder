const express = require('express');
const { hashPassword, verifyPassword } = require('../utils/password');
const User = require('../models/userSchema');
const { validateSignupData } = require('../utils/validation');
const authRoutes = express.Router();

// ----- Signup -----
authRoutes.post('/signup', async (req, res) => {
  try {
    validateSignupData(req);
    const hashedPwd = await hashPassword(req.body.password);
    req.body.password = hashedPwd;
    const emailTrimmed = req.body.email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: emailTrimmed });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: 'User created', userId: user._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ------ Login ------
authRoutes.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }
    const userFound = await User.findOne({ email });

    if (!userFound) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isPasswordValid = await verifyPassword(password, userFound.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = userFound.getJWT();
    res.cookie('token', token, { httpOnly: true });
    res.json({
      message: 'Login successful',
      user: userFound,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ------ Logout -----
authRoutes.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logout successful' });
});

module.exports = authRoutes;
