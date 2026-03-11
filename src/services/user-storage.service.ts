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
    },

    /**
     * Saves a payment card to the user's vault.
     */
    saveCard: async (uid: string, card: any) => {
        try {
            const userDoc = doc(db, COLLECTIONS.USER_DATA, uid);
            const docSnap = await getDoc(userDoc);
            let cards = [];

            if (docSnap.exists()) {
                cards = docSnap.data().cards || [];
            }

            // Simple check to avoid duplicates by last 4 digits
            const last4 = card.cardNumber.slice(-4);
            const exists = cards.find((c: any) => c.last4 === last4);

            if (!exists) {
                cards.push({
                    ...card,
                    last4,
                    id: Date.now(),
                    addedAt: new Date().toISOString()
                });

                await setDoc(userDoc, {
                    cards: cards,
                    updatedAt: new Date().toISOString()
                }, { merge: true });
                return true;
            }
            return false;
        } catch (e) {
            console.error("Error saving card: ", e);
            return false;
        }
    },

    /**
     * Retrieves saved cards for the user.
     */
    getSavedCards: async (uid: string) => {
        try {
            const userDoc = doc(db, COLLECTIONS.USER_DATA, uid);
            const docSnap = await getDoc(userDoc);
            if (docSnap.exists()) {
                return docSnap.data().cards || [];
            }
            return [];
        } catch (e) {
            console.error("Error fetching saved cards: ", e);
            return [];
        }
    }
};
