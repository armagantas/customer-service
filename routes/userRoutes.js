const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  getUserById,
  updateUser,
  addUserAddress,
  updateUserAddress,
  setDefaultAddress,
  removeUserAddress,
  deleteUser,
  updateSellerStatus,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// All routes are protected
router.use(protect);

// User routes
router.get("/profile", getUserProfile);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.put("/:id/seller-status", updateSellerStatus);

// Address routes
router.post("/:id/addresses", addUserAddress);
router.put("/:id/addresses/:addressId", updateUserAddress);
router.put("/:id/addresses/:addressId/default", setDefaultAddress);
router.delete("/:id/addresses/:addressId", removeUserAddress);

module.exports = router;
