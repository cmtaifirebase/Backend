const express = require("express");
const { createRechargeRequest, getRechargeRequests, getRechargeRequestById, getRechargeRequestsByUserId, updateRechargeRequest, deleteRechargeRequest } = require("../services/rechargeRequestServices");
const { successResponse, errorResponse } = require("../utils/responseManager");

const router = express.Router();

// Create a new recharge request
router.post("/newRechargeRequest", async (req, res) => {
    try {
        const requestData = req.body;
        const newRequest = await createRechargeRequest(requestData);
        successResponse(res, newRequest, "Recharge request created successfully", 201);
    } catch (error) {
        errorResponse(res, error, "Error creating recharge request");
    }
});

// Get all recharge requests
router.get("/getRechargeRequests", async (req, res) => {
    try {
        const requests = await getRechargeRequests();
        successResponse(res, requests, "Recharge requests fetched successfully");
    } catch (error) {
        errorResponse(res, error, "Error fetching recharge requests");
    }
});

// Get a single recharge request by ID
router.get("/getRechargeRequestById/:id", async (req, res) => {
    try {
        const requestId = req.params.id;
        const request = await getRechargeRequestById(requestId);
        successResponse(res, request, "Recharge request fetched successfully");
    } catch (error) {
        errorResponse(res, error, "Recharge request not found", 404);
    }
});

// Get recharge requests by user ID
router.get("/getRechargeRequestsByUserId/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const requests = await getRechargeRequestsByUserId(userId);
        successResponse(res, requests, "Recharge requests fetched successfully for user");
    } catch (error) {
        errorResponse(res, error, "Error fetching recharge requests by user ID");
    }
});

// Update recharge request data
router.put("/updateRechargeRequest/:id", async (req, res) => {
    try {
        const requestId = req.params.id;
        const requestData = req.body;
        const updatedRequest = await updateRechargeRequest(requestId, requestData);
        successResponse(res, updatedRequest, "Recharge request updated successfully");
    } catch (error) {
        errorResponse(res, error, "Error updating recharge request");
    }
});

// Delete a recharge request
router.delete("/deleteRechargeRequest/:id", async (req, res) => {
    try {
        const requestId = req.params.id;
        const result = await deleteRechargeRequest(requestId);
        successResponse(res, result, "Recharge request deleted successfully");
    } catch (error) {
        errorResponse(res, error, "Error deleting recharge request");
    }
});

module.exports = router;
