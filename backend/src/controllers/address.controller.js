import mongoose from "mongoose";
import Address from "../models/Address.js";

/* ================= ADD ADDRESS ================= */
export const addAddress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { isDefault, ...rest } = req.body;

    const makeDefault = isDefault === true || isDefault === "true";

    if (makeDefault) {
      await Address.updateMany(
        { userId },
        { isDefault: false }
      );
    }

    const address = await Address.create({
      ...rest,
      userId,
      isDefault: makeDefault, // ✅ FORCE BOOLEAN
    });

    res.status(201).json(address);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add address" });
  }
};


/* ================= GET ALL ADDRESSES ================= */
export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({
      userId: req.user.userId,
    }).sort({ isDefault: -1, createdAt: -1 });

    res.status(200).json(addresses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch addresses" });
  }
};

/* ================= UPDATE ADDRESS ================= */
export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { isDefault, ...rest } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid address ID" });
    }

    const makeDefault = isDefault === true || isDefault === "true";

    if (makeDefault) {
      await Address.updateMany(
        { userId },
        { isDefault: false }
      );
    }

    const address = await Address.findOneAndUpdate(
      { _id: id, userId },
      {
        ...rest,
        isDefault: makeDefault, // ✅ FORCE BOOLEAN
      },
      { new: true }
    );

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json(address);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update address" });
  }
};


/* ================= DELETE ADDRESS ================= */
export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid address ID" });
    }

    const deleted = await Address.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Address not found" });
    }

    // If deleted address was default → assign another as default
    if (deleted.isDefault) {
      const next = await Address.findOne({ userId }).sort({ createdAt: 1 });
      if (next) {
        next.isDefault = true;
        await next.save();
      }
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete address" });
  }
};
/* ================= SET DEFAULT ADDRESS ================= */
export const setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid address ID" });
    }

    // 1️⃣ Remove default from all addresses
    await Address.updateMany(
      { userId },
      { $set: { isDefault: false } }
    );

    // 2️⃣ Set selected address as default
    const address = await Address.findOneAndUpdate(
      { _id: id, userId },
      { $set: { isDefault: true } },
      { new: true }
    );

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json(address);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to set default address" });
  }
};

