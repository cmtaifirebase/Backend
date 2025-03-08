const { db } = require('../config/firebase');
const { collection, getCountFromServer } = require('firebase/firestore');

// Get count of users
const getUsersCount = async () => {
  try {
    const usersCollection = collection(db, "users");  // Assuming you have a "users" collection in Firestore
    const usersSnapshot = await getCountFromServer(usersCollection);
    return usersSnapshot.data().count;  // Returns the document count
  } catch (error) {
    throw new Error("Error fetching users count: " + error.message);
  }
};

// Get count of recharge requests
const getRechargeRequestsCount = async () => {
  try {
    const rechargeRequestsCollection = collection(db, "rechargeRequests");  // Assuming you have a "rechargeRequests" collection
    const rechargeRequestsSnapshot = await getCountFromServer(rechargeRequestsCollection);
    return rechargeRequestsSnapshot.data().count;  // Returns the document count
  } catch (error) {
    throw new Error("Error fetching recharge requests count: " + error.message);
  }
};

// Get count of withdraw requests
const getWithdrawRequestsCount = async () => {
  try {
    const withdrawRequestsCollection = collection(db, "withdrawRequests");  // Assuming you have a "withdrawRequests" collection
    const withdrawRequestsSnapshot = await getCountFromServer(withdrawRequestsCollection);
    return withdrawRequestsSnapshot.data().count;  // Returns the document count
  } catch (error) {
    throw new Error("Error fetching withdraw requests count: " + error.message);
  }
};

// Get count of leads
const getLeadsCount = async () => {
  try {
    const leadsCollection = collection(db, "leads");  // Assuming you have a "leads" collection
    const leadsSnapshot = await getCountFromServer(leadsCollection);
    return leadsSnapshot.data().count;  // Returns the document count
  } catch (error) {
    throw new Error("Error fetching leads count: " + error.message);
  }
};

module.exports = {
  getUsersCount,
  getRechargeRequestsCount,
  getWithdrawRequestsCount,
  getLeadsCount,
};
