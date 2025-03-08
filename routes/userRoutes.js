const express = require("express");
const {
  getUsers,
  getUserById,
  updateUser,
  updateReferredBy,
  deleteUser,
} = require("../services/userServices");
const ResponseManager = require("../utils/responseManager");

const router = express.Router();


// Get all users
router.get("/getUsers", async (req, res) => {
  try {
    const users = await getUsers();
    return ResponseManager.successResponse(res, users, "Users fetched successfully");
  } catch (error) {
    return ResponseManager.errorResponse(res, error, "Error fetching users");
  }
});

// Get a single user by ID
router.get("/getUserById/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await getUserById(userId);

    if (!user) {
      return ResponseManager.notFoundResponse(res, "User not found");
    }

    return ResponseManager.successResponse(res, user, "User fetched successfully");
  } catch (error) {
    return ResponseManager.errorResponse(res, error, "Error fetching user");
  }
});

// Update user data
router.put("/updateUser/:id", async (req, res) => {
  const userId = req.params.id;
  const userData = req.body;

  try {
    const updatedUser = await updateUser(userId, userData);

    if (!updatedUser) {
      return ResponseManager.notFoundResponse(res, "User not found");
    }

    return ResponseManager.successResponse(res, updatedUser, "User updated successfully");
  } catch (error) {
    return ResponseManager.errorResponse(res, error, "Error updating user");
  }
});

// Update referredBy field of a user
router.put("/updateReferredBy/:id", async (req, res) => {
  const userId = req.params.id;
  const { referredBy } = req.body;

  if (!referredBy) {
    return ResponseManager.errorResponse(res, "Missing referredBy field", "Invalid request");
  }

  try {
    const result = await updateReferredBy(userId, referredBy);

    if (!result.success) {
      return ResponseManager.errorResponse(res, result.message, "Error updating referredBy");
    }

    return ResponseManager.successResponse(res, result, "ReferredBy updated successfully");
  } catch (error) {
    return ResponseManager.errorResponse(res, error.message, "Error updating referredBy");
  }
});

// Delete a user
router.delete("/deleteUser/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await deleteUser(userId);

    if (!result) {
      return ResponseManager.notFoundResponse(res, "User not found");
    }

    return ResponseManager.successResponse(res, result, "User deleted successfully");
  } catch (error) {
    return ResponseManager.errorResponse(res, error, "Error deleting user");
  }
});

module.exports = router;
