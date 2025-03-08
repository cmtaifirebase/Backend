const { db } = require('../config/firebase');
const { collection, addDoc, getDoc, doc, setDoc, deleteDoc, getDocs, query, where } = require('firebase/firestore');

// Create a new bank account in Firestore
const createBankAccount = async (accountData) => {
    try {
        const docRef = await addDoc(collection(db, "bankAccounts"), accountData);
        return { id: docRef.id, ...accountData };
    } catch (error) {
        throw new Error("Error creating bank account: " + error.message);
    }
};

// Get all bank accounts from Firestore
const getBankAccounts = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "bankAccounts"));
        const accounts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return accounts;
    } catch (error) {
        throw new Error("Error fetching bank accounts: " + error.message);
    }
};

// Get a single bank account by ID from Firestore
const getBankAccountById = async (accountId) => {
    try {
        const accountRef = doc(db, "bankAccounts", accountId);
        const accountDoc = await getDoc(accountRef);

        if (!accountDoc.exists()) {
            throw new Error("Bank account not found");
        }

        return { id: accountDoc.id, ...accountDoc.data() };
    } catch (error) {
        throw new Error("Error fetching bank account: " + error.message);
    }
};

// Get bank accounts by user ID
const getBankAccountsByUserId = async (userId) => {
    try {
        const q = query(collection(db, "bankAccounts"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        const accounts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return accounts;
    } catch (error) {
        throw new Error("Error fetching bank accounts for user: " + error.message);
    }
};

// Update bank account data in Firestore
const updateBankAccountByUserId = async (userId, accountData) => {
    try {
        const bankAccountsRef = collection(db, "bankAccounts");
        const q = query(bankAccountsRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            throw new Error("No bank account found for this user.");
        }

        const accountDoc = querySnapshot.docs[0]; // Assuming each user has only one account
        const accountRef = doc(db, "bankAccounts", accountDoc.id);

        await setDoc(accountRef, accountData, { merge: true });

        return { id: accountDoc.id, ...accountData };
    } catch (error) {
        throw new Error("Error updating bank account: " + error.message);
    }
};

// Delete a bank account from Firestore
const deleteBankAccount = async (accountId) => {
    try {
        const accountRef = doc(db, "bankAccounts", accountId);
        await deleteDoc(accountRef);
        return { message: "Bank account deleted successfully" };
    } catch (error) {
        throw new Error("Error deleting bank account: " + error.message);
    }
};

module.exports = { createBankAccount, getBankAccounts, getBankAccountById, getBankAccountsByUserId, updateBankAccountByUserId, deleteBankAccount };
