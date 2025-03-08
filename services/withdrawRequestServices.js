const { db } = require('../config/firebase');
const { collection, addDoc, getDoc, doc, setDoc, deleteDoc, getDocs, query, where, orderBy } = require('firebase/firestore');

// Create a new withdraw request in Firestore
const createWithdrawRequest = async (requestData) => {
    try {
        const timestamp = new Date(); // Get current timestamp
        const docRef = await addDoc(collection(db, "withdrawRequests"), {
            ...requestData,
            createdOn: timestamp, // Add createdOn timestamp
            updatedOn: timestamp  // Initial updatedOn set to createdOn
        });
        return { id: docRef.id, ...requestData, createdOn: timestamp, updatedOn: timestamp };
    } catch (error) {
        throw new Error("Error creating withdraw request: " + error.message);
    }
};

// Get all withdraw requests from Firestore (latest first)
const getWithdrawRequests = async () => {
    try {
        const q = query(collection(db, "withdrawRequests"), orderBy("createdOn", "desc"));
        const querySnapshot = await getDocs(q);
        const requests = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return requests;
    } catch (error) {
        throw new Error("Error fetching withdraw requests: " + error.message);
    }
};

// Get a single withdraw request by ID from Firestore
const getWithdrawRequestById = async (requestId) => {
    try {
        const requestRef = doc(db, "withdrawRequests", requestId);
        const requestDoc = await getDoc(requestRef);

        if (!requestDoc.exists()) {
            throw new Error("Withdraw request not found");
        }

        return { id: requestDoc.id, ...requestDoc.data() };
    } catch (error) {
        throw new Error("Error fetching withdraw request: " + error.message);
    }
};

// Get Withdraw requests by user ID (latest first)
const getWithdrawRequestsByUserId = async (userId) => {
    try {
        const q = query(
            collection(db, "withdrawRequests"), 
            where("userId", "==", userId), 
        );
        const querySnapshot = await getDocs(q);
        const requests = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return requests;
    } catch (error) {
        throw new Error("Error fetching withdraw requests by user ID: " + error.message);
    }
};

// Update withdraw request data in Firestore
const updateWithdrawRequest = async (requestId, requestData) => {
    try {
        const requestRef = doc(db, "withdrawRequests", requestId);
        const updatedData = {
            ...requestData,
            updatedOn: new Date() // Set updatedOn timestamp
        };
        await setDoc(requestRef, updatedData, { merge: true });
        return { id: requestId, ...updatedData };
    } catch (error) {
        throw new Error("Error updating withdraw request: " + error.message);
    }
};

// Delete a withdraw request from Firestore
const deleteWithdrawRequest = async (requestId) => {
    try {
        const requestRef = doc(db, "withdrawRequests", requestId);
        await deleteDoc(requestRef);
        return { message: "Withdraw request deleted successfully" };
    } catch (error) {
        throw new Error("Error deleting withdraw request: " + error.message);
    }
};

module.exports = { 
    createWithdrawRequest, 
    getWithdrawRequests, 
    getWithdrawRequestById, 
    getWithdrawRequestsByUserId, 
    updateWithdrawRequest, 
    deleteWithdrawRequest 
};
