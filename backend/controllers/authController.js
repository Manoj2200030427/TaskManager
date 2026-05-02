const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ msg: "User already exists" });

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hash,
      role: role || "member" // default user
    });

    res.json({ msg: "Registered", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login
// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Wrong password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ FIX: send user info
    res.json({
      msg: "Login success",
      token,
      user: {
        id: user._id,
        role: user.role,
        email: user.email,
        name: user.name
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};