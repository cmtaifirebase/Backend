const { db } = require("../config/firebase");
const { collection, query, where, getDocs } = require("firebase/firestore");

// Generate a unique referral code (6 alphanumeric characters)
const generateReferralCode = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let referralCode = "";

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    referralCode += characters[randomIndex];
  }

  return referralCode;
};

// Function to check referral count and validate if more users can be referred
const checkReferralCount = async (referralCode) => {
  const usersRef = collection(db, "users");

  // Get the referrer details
  const referrerQuery = query(usersRef, where("referralCode", "==", referralCode));
  const referrerSnapshot = await getDocs(referrerQuery);

  if (referrerSnapshot.empty) {
    throw new Error("Invalid referral code");
  }

  const referrerData = referrerSnapshot.docs[0].data();
  const referrerRole = referrerData.role; // "broker" or "user"

  // Count how many users have been referred by this referral code
  const referredUsersQuery = query(usersRef, where("referredBy", "==", referralCode));
  const referredUsersSnapshot = await getDocs(referredUsersQuery);
  const referredCount = referredUsersSnapshot.size;

  // If referrer is a broker, allow unlimited referrals
  if (referrerRole === "broker") {
    return { canRefer: true, count: referredCount, message: "Broker can refer unlimited users" };
  }

  // If referrer is a user, allow only up to 3 referrals
  if (referrerRole === "user" && referredCount < 3) {
    return { canRefer: true, count: referredCount, message: `User can refer ${3 - referredCount} more users` };
  }

  return { canRefer: false, count: referredCount, message: "User has reached the referral limit of 3" };
};

// Function to generate a referral code only for brokers and users who can refer
const getReferralCodeForNewUser = async (referredBy) => {
  if (!referredBy) {
    return generateReferralCode(); // Return only the referral code string
  }

  const referralCheck = await checkReferralCount(referredBy);

  if (!referralCheck.canRefer) {
    throw new Error("Referrer has reached the referral limit");
  }

  return generateReferralCode(); // Return only the referral code string
};


module.exports = { getReferralCodeForNewUser, checkReferralCount };
