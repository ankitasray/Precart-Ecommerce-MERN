import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔥 IMPORTANT: select +password
    const admin = await User.findOne({
      email,
      role: "admin",
    }).select("+password");

    if (!admin) {
      return res.status(403).json({
        message: "Admin access only",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        userId: admin._id,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // true in production
    });

    res.status(200).json({
      success: true,
      role: admin.role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Admin login failed" });
  }
};

export const adminLogout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,       // set false only for local http
    sameSite: "strict",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

