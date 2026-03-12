import { db } from "@/config/firebase";
import {
    collection,
    getDocs,
    getDoc,
    doc,
    addDoc,
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
            console.log(`🔍 [Firestore Query] Input Filter:`, JSON.stringify(filter));

            let q = collection(db, COLLECTIONS.PRODUCTS);
            let constraints: any[] = [];

            // Normalize type - Firestore is case-sensitive
            const normalizedType = filter.type ? String(filter.type).toLowerCase() : null;

            // 1. Category Filter (Skip if "ALL")
            if (normalizedType && normalizedType !== "all") {
                constraints.push(where("type", "==", normalizedType));
            }

            // 1.1 Source Filter (Only if explicitly requested)
            if (filter.source) {
                constraints.push(where("source", "==", filter.source));
            }

            // 5. Pagination
            constraints.push(limit(filter.limit || 50));

            const finalQuery = query(q, ...constraints);
            let querySnapshot;

            try {
                querySnapshot = await getDocs(finalQuery);
                console.log(`📥 [Firestore Success] Found ${querySnapshot.size} products via DB query`);

                // If 0 products found with filters, try a broader search
                if (querySnapshot.size === 0) {
                    console.warn("⚠️ [Firestore] 0 products found with filters. Trying broad search (limit 20)...");
                    const broadQuery = query(collection(db, COLLECTIONS.PRODUCTS), limit(20));
                    querySnapshot = await getDocs(broadQuery);
                    console.log(`📥 [Firestore Broad] Found ${querySnapshot.size} products as fallback`);
                }
            } catch (queryError: any) {
                console.warn("⚠️ [Firestore Query Failed] Falling back to full scan (limit 50).", queryError.message);
                const fallbackQuery = query(q, limit(50));
                querySnapshot = await getDocs(fallbackQuery);
            }

            let items = querySnapshot.docs.map(doc => ({
                fireId: doc.id,
                ...doc.data() as any
            }));

            // In-memory filtering (Apply only if we have items)
            if (items.length > 0) {
                // If we did a broad search, we still try to filter in-memory if possible, 
                // but we are more lenient.
                if (normalizedType && normalizedType !== "all") {
                    const filtered = items.filter(item => item.type?.toLowerCase() === normalizedType);
                    // Only apply if it doesn't leave us with 0 items
                    if (filtered.length > 0) items = filtered;
                }

                if (filter.priceMin !== undefined) {
                    items = items.filter(item => item.price >= filter.priceMin);
                }

                if (filter.priceMax !== undefined) {
                    items = items.filter(item => item.price <= filter.priceMax);
                }

                // Sorting in memory
                if (filter.sortBy) {
                    items.sort((a, b) => {
                        if (filter.sortBy === "HIGH_TO_LOW") return b.price - a.price;
                        if (filter.sortBy === "LOW_TO_HIGH") return a.price - b.price;
                        if (filter.sortBy === "NEWEST") return b.id - a.id;
                        return 0;
                    });
                }
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
    }
};
