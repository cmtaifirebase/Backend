const express = require("express");
const { 
    createBankAccount, 
    getBankAccounts, 
    getBankAccountById, 
    getBankAccountsByUserId, 
    updateBankAccountByUserId, 
    deleteBankAccount 
} = require("../services/bankServices");
const { successResponse, errorResponse } = require("../utils/responseManager");

const router = express.Router();

// Create a new bank account
router.post("/newBankAccount", async (req, res) => {
    try {
        const accountData = req.body;
        const newAccount = await createBankAccount(accountData);
        successResponse(res, newAccount, "Bank account created successfully", 201);
    } catch (error) {
        errorResponse(res, error, "Error creating bank account");
    }
});

// Get all bank accounts
router.get("/getAllBankAccounts", async (req, res) => {
    try {
        const accounts = await getBankAccounts();
        successResponse(res, accounts, "Bank accounts fetched successfully");
    } catch (error) {
        errorResponse(res, error, "Error fetching bank accounts");
    }
});

// Get a single bank account by ID
router.get("/getBankAccountById/:id", async (req, res) => {
    try {
        const accountId = req.params.id;
        const account = await getBankAccountById(accountId);
        successResponse(res, account, "Bank account fetched successfully");
    } catch (error) {
        errorResponse(res, error, "Bank account not found", 404);
    }
});

// Get bank accounts by user ID
router.get("/getBankAccountsByUser/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const accounts = await getBankAccountsByUserId(userId);
        successResponse(res, accounts, "Bank accounts fetched successfully for user");
    } catch (error) {
        errorResponse(res, error, "Error fetching bank accounts for user");
    }
});

// Update bank account data
router.put("/updateBankAccount/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const accountData = req.body;

        if (!userId) {
            return errorResponse(res, "User ID is required", "Missing userId", 400);
        }
        if (!accountData || Object.keys(accountData).length === 0) {
            return errorResponse(res, "No account data provided", "Empty request body", 400);
        }

        const updatedAccount = await updateBankAccountByUserId(userId, accountData);

        return successResponse(res, updatedAccount, "Bank account updated successfully");
    } catch (error) {
        return errorResponse(res, error.message, "Error updating bank account", 500);
    }
});

// Delete a bank account
router.delete("/deleteBankAccount/:id", async (req, res) => {
    try {
        const accountId = req.params.id;
        const result = await deleteBankAccount(accountId);
        successResponse(res, result, "Bank account deleted successfully");
    } catch (error) {
        errorResponse(res, error, "Error deleting bank account");
    }
});

module.exports = router;
