import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register = async (req, res) => {
  try {
    const {
      name,        // ✅ added
      email,
      password,
      dob,
      gender,
      subscribe,
    } = req.body;

    // 1️⃣ Validation
    if (!name || !email || !password || !dob || !gender) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    // 2️⃣ Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Create user
    const user = await User.create({
      name: name.trim(),           // ✅ saved
      email: email.trim(),
      password: hashedPassword,
      dob: new Date(dob),          // yyyy-mm-dd
      gender,
      subscribe: Boolean(subscribe),
    });

    // 5️⃣ Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 6️⃣ Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // set true in production (HTTPS)
    });

    // 7️⃣ Response
    res.status(201).json({
      message: "Registration successful",
      user: {
        id: user._id,
        name: user.name,           // ✅ returned
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};




export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send token in HTTP-only cookie
    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production", // true in production
      })
      .status(200)
      .json({
        message: "Logged in successfully",
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};





export const logout = async (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    })
    .status(200)
    .json({ message: "Logged out successfully" });
};


export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
