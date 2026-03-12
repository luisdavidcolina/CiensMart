import { db } from "@/config/firebase";
import {
    collection,
    getDocs,
    getDoc,
    doc,
    addDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    DocumentData,
    QueryDocumentSnapshot
} from "firebase/firestore";

const COLLECTIONS = {
    PRODUCTS: "products",
    ORDERS: "orders",
    USERS: "users",
};

export const firebaseService = {
    // Productos
    getProducts: async (filter: any) => {
        try {
            filter = filter || {};
            console.log(`🔍 [Firestore Query] Input Filter:`, JSON.stringify(filter));

            let q = collection(db, COLLECTIONS.PRODUCTS);
            let constraints: any[] = [];

            // Normalize type - Firestore is case-sensitive
            const normalizedType = filter.type ? String(filter.type).toLowerCase() : null;

            // 1. Category Filter - ONLY apply if specifically requested and NOT "all"
            if (normalizedType && normalizedType !== "all" && normalizedType !== "undefined") {
                constraints.push(where("type", "==", normalizedType));
            }

            // 1.1 Source Filter - Only apply if it's a specific requirement
            if (filter.source && filter.source !== "all") {
                constraints.push(where("source", "==", filter.source));
            }

            // 5. Pagination
            constraints.push(limit(filter.limit || 24));

            let finalQuery = query(q, ...constraints);
            let querySnapshot;

            try {
                querySnapshot = await getDocs(finalQuery);
                console.log(`📥 [Firestore Success] Found ${querySnapshot.size} products via DB query`);

                // EMERGENCY FALLBACK: If 0 products found with filters, just get the latest 20 products
                if (querySnapshot.size === 0) {
                    console.warn("⚠️ [Firestore] 0 products found with strict filters. Falling back to broader search...");
                    const fallbackConstraints = [];
                    if (filter.source) fallbackConstraints.push(where("source", "==", filter.source));
                    fallbackConstraints.push(limit(12));

                    const broadQuery = query(collection(db, COLLECTIONS.PRODUCTS), ...fallbackConstraints);
                    querySnapshot = await getDocs(broadQuery);

                    // ULTIMATE FALLBACK: If still 0, get anything
                    if (querySnapshot.size === 0) {
                        console.error("🚨 [Firestore] Absolute zero results. Fetching anything available...");
                        querySnapshot = await getDocs(query(collection(db, COLLECTIONS.PRODUCTS), limit(10)));
                    }
                    console.log(`📥 [Firestore Fallback] Found ${querySnapshot.size} products`);
                }
            } catch (queryError: any) {
                console.warn("⚠️ [Firestore Query Failed] Probable missing index/complex filter. Fetching random batch.", queryError.message);
                querySnapshot = await getDocs(query(q, limit(24)));
            }

            let items = querySnapshot.docs.map(doc => ({
                fireId: doc.id,
                ...doc.data() as any
            }));

            // In-memory filtering (Apply only if we have many items and want to refine)
            if (items.length > 5 && normalizedType && normalizedType !== "all") {
                const refined = items.filter(item => item.type?.toLowerCase() === normalizedType);
                if (refined.length > 0) items = refined;
            }

            // Sorting in memory (Saves us from Firestore index hell)
            if (filter.sortBy) {
                items.sort((a, b) => {
                    if (filter.sortBy === "HIGH_TO_LOW") return (b.price || 0) - (a.price || 0);
                    if (filter.sortBy === "LOW_TO_HIGH") return (a.price || 0) - (b.price || 0);
                    if (filter.sortBy === "NEWEST") return (b.id || 0) - (a.id || 0);
                    return 0;
                });
            }

            // Slice for final pagination limit
            const finalItems = items.slice(0, filter.limit || 12);

            return {
                total: items.length,
                hasMore: items.length > finalItems.length,
                items: finalItems,
            };
        } catch (error: any) {
            console.error("🔥 Firestore Service Fatal Error:", error.message);
            return { total: 0, hasMore: false, items: [] };
        }
    },
    getProductById: async (id: string | number) => {
        // Si el ID es numérico (viniendo de los datos locales antiguos)
        // Buscamos por el campo 'id'
        const q = query(collection(db, COLLECTIONS.PRODUCTS), where("id", "==", Number(id)));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const docData = querySnapshot.docs[0];
            return { fireId: docData.id, ...docData.data() };
        }

        // Si no, intentamos por Document ID de Firestore
        const docRef = doc(db, COLLECTIONS.PRODUCTS, String(id));
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { fireId: docSnap.id, ...docSnap.data() };
        }

        return null;
    },

    // Pedidos
    saveOrder: async (order: any) => {
        try {
            const docRef = await addDoc(collection(db, COLLECTIONS.ORDERS), {
                ...order,
                createdAt: new Date().toISOString()
            });
            return { fireId: docRef.id, ...order };
        } catch (e) {
            console.error("Error adding document: ", e);
            throw e;
        }
    },

    getOrderById: async (id: string) => {
        try {
            const docRef = doc(db, COLLECTIONS.ORDERS, id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { fireId: docSnap.id, ...docSnap.data() };
            }
            return null;
        } catch (e) {
            console.error("Error fetching order: ", e);
            return null;
        }
    },

    getOrdersByUser: async (email: string) => {
        const q = query(
            collection(db, COLLECTIONS.ORDERS),
            where("email", "==", email)
        );
        const querySnapshot = await getDocs(q);
        const orders = querySnapshot.docs.map(doc => ({ fireId: doc.id, ...doc.data() as any }));

        // Sort in memory to avoid mandatory composite index
        return orders.sort((a, b) => {
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return dateB - dateA; // Descending
        });
    },

    deleteOrder: async (id: string) => {
        await deleteDoc(doc(db, COLLECTIONS.ORDERS, id));
    },

    // Perfiles de Usuario
    saveUserProfile: async (uid: string, profileData: any) => {
        try {
            await addDoc(collection(db, COLLECTIONS.USERS), {
                uid,
                ...profileData,
                updatedAt: new Date().toISOString()
            });
        } catch (e) {
            console.error("Error saving user profile: ", e);
            throw e;
        }
    },

    getUserProfile: async (uid: string) => {
        const q = query(collection(db, COLLECTIONS.USERS), where("uid", "==", uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            return { fireId: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
        }
        return null;
    },

    deleteUserProfileByUid: async (uid: string) => {
        const q = query(collection(db, COLLECTIONS.USERS), where("uid", "==", uid));
        const querySnapshot = await getDocs(q);
        await Promise.all(querySnapshot.docs.map((profileDoc) => deleteDoc(profileDoc.ref)));
    },

    deleteOrdersByEmail: async (email: string) => {
        const q = query(collection(db, COLLECTIONS.ORDERS), where("email", "==", email));
        const querySnapshot = await getDocs(q);
        await Promise.all(querySnapshot.docs.map((orderDoc) => deleteDoc(orderDoc.ref)));
    }
};
