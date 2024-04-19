const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // for password hashing
const jwt = require('jsonwebtoken'); // for JWT generation

// User model (replace with your actual model)
const User = require('../Models/user');

// Function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// User Signup Route
router.post('/signUp', async (req, res) => {
  // Extract user data from request body
  const { name, email, password } = req.body;

  // Hash password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  // Check for existing user with email
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'Email already exists' });
  }

  try {
    const newUser = new User({ name, email, password: hashedPassword });
    const savedUser = await newUser.save();
    // Generate JWT token with user ID
    const token = generateToken(savedUser._id);
    res.json({ message: 'User created successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User Login Route
router.post('/login', async (req, res) => {
  // Extract login credentials from request body
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare hashed passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token on successful login
    const token = generateToken(user._id);
    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;