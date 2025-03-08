const { db } = require("../config/firebase");
const {
  collection,
  getDoc,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy
} = require("firebase/firestore");

// Get all users from Firestore (sorted by latest createdOn)
const getUsers = async () => {
  try {
    const q = query(collection(db, "users"), orderBy("createdOn", "desc"));
    const querySnapshot = await getDocs(q);

    const users = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const userData = { id: doc.id, ...doc.data() };

        // If user has a referralCode, fetch referred users
        let referredUsers = [];
        if (userData.referralCode) {
          const referredUsersQuery = query(
            collection(db, "users"),
            where("referredBy", "==", userData.referralCode)
          );
          const referredUsersSnapshot = await getDocs(referredUsersQuery);

          referredUsers = referredUsersSnapshot.docs.map((refDoc) => ({
            id: refDoc.id,
            phone: refDoc.data().phone,
            createdOn: refDoc.data().createdOn || null,
          }));
        }

        return { ...userData, referredUsers };
      })
    );

    return users;
  } catch (error) {
    throw new Error("Error fetching users: " + error.message);
  }
};

// Get a single user by ID with referred users
const getUserById = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (!userDoc.exists()) {
      throw new Error("User not found");
    }

    // Extract user data
    const userData = { id: userDoc.id, ...userDoc.data() };

    // Check if user has a referralCode before querying
    if (!userData.referralCode) {
      return { ...userData, referredUsers: [] }; // Return empty referredUsers if no referralCode
    }

    // Query users who have this user's referralCode in their referredBy field
    const referredUsersQuery = query(
      collection(db, "users"),
      where("referredBy", "==", userData.referralCode),
    );
    const referredUsersSnapshot = await getDocs(referredUsersQuery);

    // Map referred users' data
    const referredUsers = referredUsersSnapshot.docs.map((doc) => ({
      id: doc.id,
      phone: doc.data().phone,
      createdOn: doc.data().createdOn || null,
    }));

    return { ...userData, referredUsers };
  } catch (error) {
    throw new Error("Error fetching user: " + error.message);
  }
};

// Update user data in Firestore (adds updatedOn timestamp)
const updateUser = async (userId, userData) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error("User not found");
    }

    const updatedData = {
      ...userData,
      updatedOn: new Date(), // Add updatedOn timestamp
    };

    await setDoc(userRef, updatedData, { merge: true });
    return { id: userId, ...updatedData };
  } catch (error) {
    throw new Error("Error updating user: " + error.message);
  }
};

const updateReferredBy = async (userId, referredBy) => {
  try {
    // Step 1: Check if the referral code (referredBy) exists in the users collection
    const referrerQuery = query(collection(db, "users"), where("referralCode", "==", referredBy));
    const referrerSnapshot = await getDocs(referrerQuery);

    if (referrerSnapshot.empty) {
      throw new Error("Invalid referral code. No user found with this referral code.");
    }


    // Step 2: Check if the referrer has already referred 3 users
    const referredUsersQuery = query(collection(db, "users"), where("referredBy", "==", referredBy));
    const referredUsersSnapshot = await getDocs(referredUsersQuery);

    if (referredUsersSnapshot.size >= 3) {
      throw new Error("This referral code has already been used by 3 users.");
    }

    // Step 3: Update the user's referredBy field
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { referredBy: referredBy });

    return { success: true, message: "ReferredBy updated successfully" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Delete a user from Firestore
const deleteUser = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error("User not found");
    }

    await deleteDoc(userRef);
    return { message: "User deleted successfully" };
  } catch (error) {
    throw new Error("Error deleting user: " + error.message);
  }
};

module.exports = { getUsers, getUserById, updateUser, updateReferredBy, deleteUser };
