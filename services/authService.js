require("dotenv").config();
const axios = require("axios");
const jwt = require("jsonwebtoken");
const { db } = require("../config/firebase");
const { collection, addDoc, query, where, getDocs, doc, updateDoc } = require("firebase/firestore");
const { getReferralCodeForNewUser, checkReferralCount } = require("../utils/referralCodeGenerator");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "your_secret_key";
const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY;
const MSG91_SENDER_ID = process.env.MSG91_SENDER_ID;
const MSG91_TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID;

// Function to generate JWT token
const generateToken = (userId, phone) => {
  return jwt.sign({ userId, phone, role: "user" }, JWT_SECRET_KEY, { expiresIn: "7d" });
};

// Function to send OTP using MSG91
const sendOtp = async (phone) => {
  try {
    const response = await axios.post(
      "https://control.msg91.com/api/v5/otp",
      {
        template_id: MSG91_TEMPLATE_ID,
        mobile: phone,
        sender: MSG91_SENDER_ID,
      },
      {
        headers: {
          "authkey": MSG91_AUTH_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      success: true,
      message: "OTP sent successfully",
      request_id: response.data.request_id,
    };
  } catch (error) {
    throw new Error("Failed to send OTP");
  }
};

// Function to verify OTP and handle user login/signup
const verifyOtp = async (phone, otp, referredBy = null) => {
  try {
    const response = await axios.post(
      "https://control.msg91.com/api/v5/otp/verify",
      { mobile: phone, otp: otp },
      {
        headers: {
          "authkey": MSG91_AUTH_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.type !== "success") {
      throw new Error("Invalid OTP");
    }

    // Check if user already exists
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("phone", "==", phone));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const existingUserDoc = querySnapshot.docs[0];
      const existingUser = existingUserDoc.data();
      const userId = existingUserDoc.id;
      const token = generateToken(userId, phone);

      return {
        success: true,
        message: "Login successful",
        token,
        role: existingUser.role,
        userId,
      };
    }

    // If user doesn't exist, check referral code
    if (referredBy) {
      const referralCheck = await checkReferralCount(referredBy);
      if (!referralCheck.canRefer) {
        throw new Error("Invalid referral code or referrer has reached the limit");
      }
    }

    // Generate referral code for the new user
    const assignedReferralCode = await getReferralCodeForNewUser();

    // Create new user
    const newUserRef = await addDoc(collection(db, "users"), {
      phone,
      walletAmount: 0,
      referredBy: referredBy || null,
      referralCode: assignedReferralCode,
      role: "user",
      createdOn: new Date(),
      status: "active",
    });

    // Generate token for the new user
    const token = generateToken(newUserRef.id, phone);

    return {
      success: true,
      message: "User registered successfully",
      token,
      role: "user",
      userId: newUserRef.id,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Function to resend OTP
const resendOtp = async (phone) => {
  try {
    await axios.post(
      "https://control.msg91.com/api/v5/otp/retry",
      {
        mobile: phone,
        retrytype: "text",
      },
      {
        headers: {
          "authkey": MSG91_AUTH_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    return { success: true, message: "OTP resent successfully" };
  } catch (error) {
    throw new Error("Failed to resend OTP");
  }
};

module.exports = { sendOtp, verifyOtp, resendOtp };
