import express from "express";
import {
  createOrder,
  verifyPayment,
} from "../controllers/payment.controller.js";
import authMiddleware from "../../middleware/auth.middleware.js";
const router = express.Router();

router.post("/create-order", createOrder);


router.post("/verify-payment", authMiddleware, verifyPayment);


export default router;
