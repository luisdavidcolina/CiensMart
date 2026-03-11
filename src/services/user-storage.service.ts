import { db } from "../config/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const COLLECTIONS = {
    USER_DATA: "user_data"
};

export const userStorageService = {
    /**
     * Syncs the user's wishlist to Firestore.
     */
    syncWishlist: async (uid: string, wishlistItems: any[]) => {
        try {
            const userDoc = doc(db, COLLECTIONS.USER_DATA, uid);
            await setDoc(userDoc, {
                wishlist: wishlistItems,
                updatedAt: new Date().toISOString()
            }, { merge: true });
        } catch (e) {
            console.error("Error syncing wishlist: ", e);
        }
    },

    /**
     * Retrieves the saved wishlist from Firestore.
     */
    getSavedWishlist: async (uid: string) => {
        try {
            const userDoc = doc(db, COLLECTIONS.USER_DATA, uid);
            const docSnap = await getDoc(userDoc);
            if (docSnap.exists()) {
                return docSnap.data().wishlist || [];
            }
            return [];
        } catch (e) {
            console.error("Error fetching saved wishlist: ", e);
            return [];
        }
    }
};
