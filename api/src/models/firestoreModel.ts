import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { User } from "./User.js";
// @ts-ignore
import { firebaseConfig } from "../firebaseConfig.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const COLLECTION = "First Collection OMG";
const USERS_DOC_ID = "3JPYNzVszuwVaYrGKefb";

/**
 * Add a single user to the users array in Firestore
 * @param user - The User instance to add
 * @returns Promise<void>
 */
export async function addUser(user: User): Promise<void> {
  try {
    const firestoreDoc = doc(db, COLLECTION, USERS_DOC_ID);
    
    // Get the current document
    const docSnap = await getDoc(firestoreDoc);
    
    if (docSnap.exists()) {
      // Document exists, append to the users array
      await updateDoc(firestoreDoc, {
        users: arrayUnion(user.toFirestore())
      });
      console.log("User added successfully to existing document");
    } else {
      // Document doesn't exist, create it with the user
      await setDoc(firestoreDoc, {
        users: [user.toFirestore()]
      });
      console.log("Document created and user added successfully");
    }
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
}

/**
 * Add multiple users to the users array in Firestore
 * @param users - Array of User instances to add
 * @returns Promise<void>
 */
export async function addUsers(users: User[]): Promise<void> {
  try {
    const firestoreDoc = doc(db, COLLECTION, USERS_DOC_ID);
    
    // Convert all users to Firestore format
    const usersData = users.map(user => user.toFirestore());
    
    // Get the current document
    const docSnap = await getDoc(firestoreDoc);
    
    if (docSnap.exists()) {
      // Document exists, merge with existing users
      const existingData = docSnap.data();
      const existingUsers = existingData.users || [];
      
      await setDoc(firestoreDoc, {
        users: [...existingUsers, ...usersData]
      }, { merge: true });
      console.log(`${users.length} users added successfully`);
    } else {
      // Document doesn't exist, create it
      await setDoc(firestoreDoc, {
        users: usersData
      });
      console.log(`Document created with ${users.length} users`);
    }
  } catch (error) {
    console.error("Error adding users:", error);
    throw error;
  }
}

/**
 * Update an existing user in the database
 * @param updatedUser - The updated User instance
 * @returns Promise
 */
export async function updateUser(updatedUser: User): Promise<void> {
  try {
    const firestoreDoc = doc(db, COLLECTION, USERS_DOC_ID);
    const docSnap = await getDoc(firestoreDoc);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      const usersData = data.users || [];
      
      const updatedUsers = usersData.map((userData: any) => {
        if (userData.uid === updatedUser.uid) {
          return updatedUser.toFirestore();
        }
        return userData;
      });
      
      await setDoc(firestoreDoc, {
        users: updatedUsers
      }, { merge: true });
      console.log("User updated successfully");
    } else {
      throw new Error("Document does not exist");
    }
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

/**
 * Delete a user from the database by uid
 * @param uid - The user ID to delete
 * @returns Promise
 */
export async function deleteUser(uid: number): Promise<void> {
  try {
    const firestoreDoc = doc(db, COLLECTION, USERS_DOC_ID);
    const docSnap = await getDoc(firestoreDoc);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      const usersData = data.users || [];
      
      const filteredUsers = usersData.filter((userData: any) => userData.uid !== uid);
      
      await setDoc(firestoreDoc, {
        users: filteredUsers
      }, { merge: true });
      console.log("User deleted successfully");
    } else {
      throw new Error("Document does not exist");
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

/**
 * Get all users from the database
 */
export async function getUsers(): Promise<User[]> {
  try {
    const firestoreDoc = doc(db, COLLECTION, USERS_DOC_ID);
    const docSnap = await getDoc(firestoreDoc);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      const usersData = data.users || [];
      
      const users: User[] = usersData.map((userData: any) => User.fromFirestore(userData));
      return users;
    } else {
      console.log("No such document!");
      return [];
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

/**
 * Get a single user by uid
 * @param uid - The user ID to fetch
 * @returns Promise<User | null>
 */
export async function getUserByUid(uid: string): Promise<User | null> {
  try {
    const users = await getUsers();
    const user = users.find(u => u.uid === uid);
    return user || null;
  } catch (error) {
    console.error("Error fetching user by uid:", error);
    throw error;
  }
}


const newUser = new User({
  uid: "12345",
  email: "test@test.com",
  name: "Test User",
  favouritePods: ["1", "2", "3"],
  currentPod: "1",
  routeHistory: [
    { startId: "10", endId: "20", startName: "Start", endName: "End" },
    { startId: "20", endId: "30", startName: "Start", endName: "End" }
  ],
  currentRoute:  { startId: "10", endId: "20" },
  favouriteRoutes: [
    { startId: "10", endId: "20" }
  ],
});

