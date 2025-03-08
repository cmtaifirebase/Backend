const { db } = require('../config/firebase');
const { collection, addDoc, getDoc, doc, setDoc, deleteDoc, getDocs, query, where, orderBy } = require('firebase/firestore');

// Create a new recharge request in Firestore
const createRechargeRequest = async (requestData) => {
    try {
        const timestamp = new Date(); // Current timestamp
        const docRef = await addDoc(collection(db, "rechargeRequests"), {
            ...requestData,
            createdOn: timestamp, // Add createdOn timestamp
            updatedOn: timestamp  // Initial update time is same as createdOn
        });
        return { id: docRef.id, ...requestData, createdOn: timestamp, updatedOn: timestamp };
    } catch (error) {
        throw new Error("Error creating recharge request: " + error.message);
    }
};

// Get all recharge requests from Firestore (latest first)
const getRechargeRequests = async () => {
    try {
        const q = query(collection(db, "rechargeRequests"), orderBy("createdOn", "desc"));
        const querySnapshot = await getDocs(q);
        const requests = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return requests;
    } catch (error) {
        throw new Error("Error fetching recharge requests: " + error.message);
    }
};

// Get a single recharge request by ID from Firestore
const getRechargeRequestById = async (requestId) => {
    try {
        const requestRef = doc(db, "rechargeRequests", requestId);
        const requestDoc = await getDoc(requestRef);

        if (!requestDoc.exists()) {
            throw new Error("Recharge request not found");
        }

        return { id: requestDoc.id, ...requestDoc.data() };
    } catch (error) {
        throw new Error("Error fetching recharge request: " + error.message);
    }
};

// Get recharge requests by user ID (latest first)
const getRechargeRequestsByUserId = async (userId) => {
    try {
        const q = query(
            collection(db, "rechargeRequests"), 
            where("userId", "==", userId), 
        );
        const querySnapshot = await getDocs(q);
        const requests = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return requests;
    } catch (error) {
        throw new Error("Error fetching recharge requests by user ID: " + error.message);
    }
};

// Update recharge request data in Firestore
const updateRechargeRequest = async (requestId, requestData) => {
    try {
        const requestRef = doc(db, "rechargeRequests", requestId);
        const updatedData = {
            ...requestData,
            updatedOn: new Date() // Set updatedOn timestamp
        };
        await setDoc(requestRef, updatedData, { merge: true });
        return { id: requestId, ...updatedData };
    } catch (error) {
        throw new Error("Error updating recharge request: " + error.message);
    }
};

// Delete a recharge request from Firestore
const deleteRechargeRequest = async (requestId) => {
    try {
        const requestRef = doc(db, "rechargeRequests", requestId);
        await deleteDoc(requestRef);
        return { message: "Recharge request deleted successfully" };
    } catch (error) {
        throw new Error("Error deleting recharge request: " + error.message);
    }
};

module.exports = { 
    createRechargeRequest, 
    getRechargeRequests, 
    getRechargeRequestById, 
    getRechargeRequestsByUserId, 
    updateRechargeRequest, 
    deleteRechargeRequest 
};
