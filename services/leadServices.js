const { db } = require('../config/firebase');
const { collection, addDoc, getDoc, doc, setDoc, deleteDoc, getDocs } = require('firebase/firestore');

// Create a new lead in Firestore
const createLead = async (leadData) => {
    try {
        const docRef = await addDoc(collection(db, "leads"), leadData);
        return { id: docRef.id, ...leadData };
    } catch (error) {
        throw new Error("Error creating lead: " + error.message);
    }
};

// Get all leads from Firestore
const getLeads = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "leads"));
        const leads = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return leads;
    } catch (error) {
        throw new Error("Error fetching leads: " + error.message);
    }
};

// Get a single lead by ID from Firestore
const getLeadById = async (leadId) => {
    try {
        const leadRef = doc(db, "leads", leadId);
        const leadDoc = await getDoc(leadRef);

        if (!leadDoc.exists()) {
            throw new Error("Lead not found");
        }

        return { id: leadDoc.id, ...leadDoc.data() };
    } catch (error) {
        throw new Error("Error fetching lead: " + error.message);
    }
};

// Update lead data in Firestore
const updateLead = async (leadId, leadData) => {
    try {
        const leadRef = doc(db, "leads", leadId);
        await setDoc(leadRef, leadData, { merge: true });
        return { id: leadId, ...leadData };
    } catch (error) {
        throw new Error("Error updating lead: " + error.message);
    }
};

// Delete a lead from Firestore
const deleteLead = async (leadId) => {
    try {
        const leadRef = doc(db, "leads", leadId);
        await deleteDoc(leadRef);
        return { message: "Lead deleted successfully" };
    } catch (error) {
        throw new Error("Error deleting lead: " + error.message);
    }
};

module.exports = { createLead, getLeads, getLeadById, updateLead, deleteLead };
