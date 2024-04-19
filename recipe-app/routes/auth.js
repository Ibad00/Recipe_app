const bcrypt = require("bcrypt");
const User = require("../Models/user"); // Replace with your user model path
const jwt = require("jsonwebtoken");
const express =require("express");

const router = express.Router();

router.post("/signUp", async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });

    if (user) return res.json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 5);
    user = new User({ ...req.body, password: hashedPassword }); // Assuming role isn't included in request
    await user.save();

    return res.json({ msg: "CREATED" });
  } catch (error) {
    console.error(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.json({ msg: "User does not exist" });

    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) return res.json({ msg: "Invalid credentials" });

    const token = jwt.sign({
      email,
      createdAt: new Date(),
      role: user.role || "user" // Default to "user" if role isn't defined
    }, "MY_SECRET", { expiresIn: "1d" });

    res.json({ msg: "Logged in", token });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;

