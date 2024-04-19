const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // for password hashing
const jwt = require('jsonwebtoken'); // for JWT generation

// User model (replace with your actual model)
const User = require('../Models/user'); // Likely a typo, should be User

// Admin model (replace with your actual model)
const Admin = require('../Models/user');

// Function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};
router.post('/signUp', async (req, res) => {
    // Extract admin data from request body
    const { name, email, password } = req.body;
  
    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
  
    // Check for existing admin with email (assuming unique email for admins)
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Email already exists' });
    }
  
    try {
      const newAdmin = new Admin({ name, email, password: hashedPassword });
      const savedAdmin = await newAdmin.save();
      // Generate JWT token with admin ID
      const token = generateToken(savedAdmin._id);
      res.json({ message: 'Admin created successfully', token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

// Improved middleware function for token verification (replace with your actual implementation)
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized access: Missing token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user data to the request object
    next();
  } catch (error) {
    console.error(error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    } else {
      // Handle other errors (e.g., server errors)
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
};

// Admin Signup Route (**make sure this is a POST request**)

// Route to add a new Ingredient (assuming this functionality belongs to admins)
router.post('/ingredients', async (req, res) => {
  
  const { name, description } = req.body;

  try {
    const newIngredient = new Ingredient({ name, description });
    const savedIngredient = await newIngredient.save();
    res.json({ message: 'Ingredient created successfully', ingredient: savedIngredient });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to add a new Recipe (assuming this functionality belongs to admins)
router.post('/recipes',  async (req, res) => {
  
  const { name, description, ingredients } = req.body;

  try {
    const newRecipe = new Recipe({ name, description, ingredients });
    const savedRecipe = await newRecipe.save();
    res.json({ message: 'Recipe created successfully', recipe: savedRecipe });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


