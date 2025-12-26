import express from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress, // 🔥 ADD THIS
} from "../controllers/address.controller.js";

const router = express.Router();

router.get("/", authMiddleware, getAddresses);
router.post("/", authMiddleware, addAddress);
router.put("/:id", authMiddleware, updateAddress);
router.put("/:id/default", authMiddleware, setDefaultAddress); // 🔥 ADD THIS
router.delete("/:id", authMiddleware, deleteAddress);

export default router;
