import express from "express";
import { adminLogin,adminLogout } from "../controllers/adminAuth.controller.js";
import { isAdmin } from "../../middleware/isAdmin.js";
import authMiddleware from "../../middleware/auth.middleware.js";
const router = express.Router();

router.post("/login", adminLogin);
router.get("/check", isAdmin, (req, res) => {
  res.json({ ok: true });
});
router.post("/logout", authMiddleware,isAdmin, adminLogout);

export default router;
