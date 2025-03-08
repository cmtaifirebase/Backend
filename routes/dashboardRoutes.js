const express = require("express");
const {
  getUsersCount,
  getRechargeRequestsCount,
  getWithdrawRequestsCount,
  getLeadsCount,
} = require("../services/dashboardServices"); // Import dashboard service functions
const { successResponse, errorResponse } = require("../utils/responseManager");

const router = express.Router();

// Get all counts in a single request
router.get("/getCounts", async (req, res) => {
  try {
    // Get counts
    const usersCount = await getUsersCount();
    const rechargeRequestsCount = await getRechargeRequestsCount();
    const withdrawRequestsCount = await getWithdrawRequestsCount();
    const leadsCount = await getLeadsCount();

    // Return all counts in a single response
    successResponse(res, {
      usersCount,
      rechargeRequestsCount,
      withdrawRequestsCount,
      leadsCount,
    }, "Dashboard counts fetched successfully");
  } catch (error) {
    errorResponse(res, error, "Error fetching dashboard counts");
  }
});

module.exports = router;
