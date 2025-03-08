const express = require("express");
const { 
    createWithdrawRequest, 
    getWithdrawRequests, 
    getWithdrawRequestById, 
    getWithdrawRequestsByUserId, 
    updateWithdrawRequest, 
    deleteWithdrawRequest 
} = require("../services/withdrawRequestServices");
const { successResponse, errorResponse } = require("../utils/responseManager");

const router = express.Router();

// Create a new withdraw request
router.post("/newWithdrawRequest", async (req, res) => {
    try {
        const requestData = req.body;
        const newRequest = await createWithdrawRequest(requestData);
        successResponse(res, newRequest, "Withdraw request created successfully", 201);
    } catch (error) {
        errorResponse(res, error, "Error creating withdraw request");
    }
});

// Get all withdraw requests
router.get("/getWithdrawRequests", async (req, res) => {
    try {
        const requests = await getWithdrawRequests();
        successResponse(res, requests, "Withdraw requests fetched successfully");
    } catch (error) {
        errorResponse(res, error, "Error fetching withdraw requests");
    }
});

// Get a single withdraw request by ID
router.get("/getWithdrawRequestById/:id", async (req, res) => {
    try {
        const requestId = req.params.id;
        const request = await getWithdrawRequestById(requestId);
        successResponse(res, request, "Withdraw request fetched successfully");
    } catch (error) {
        errorResponse(res, error, "Withdraw request not found", 404);
    }
});

// Get withdraw requests by user ID
router.get("/getWithdrawRequestsByUserId/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const requests = await getWithdrawRequestsByUserId(userId);
        successResponse(res, requests, "Withdraw requests fetched successfully for user");
    } catch (error) {
        errorResponse(res, error, "Error fetching withdraw requests by user ID");
    }
});

// Update withdraw request data
router.put("/updateWithdrawRequest/:id", async (req, res) => {
    try {
        const requestId = req.params.id;
        const requestData = req.body;
        const updatedRequest = await updateWithdrawRequest(requestId, requestData);
        successResponse(res, updatedRequest, "Withdraw request updated successfully");
    } catch (error) {
        errorResponse(res, error, "Error updating withdraw request");
    }
});

// Delete a withdraw request
router.delete("/deleteWithdrawRequest/:id", async (req, res) => {
    try {
        const requestId = req.params.id;
        const result = await deleteWithdrawRequest(requestId);
        successResponse(res, result, "Withdraw request deleted successfully");
    } catch (error) {
        errorResponse(res, error, "Error deleting withdraw request");
    }
});

module.exports = router;
