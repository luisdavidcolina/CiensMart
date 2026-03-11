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
            let q = collection(db, COLLECTIONS.PRODUCTS);
            let constraints: any[] = [];

            // 1. Category Filter (Skip if "ALL")
            if (filter.type && filter.type.toUpperCase() !== "ALL") {
                constraints.push(where("type", "==", filter.type.toLowerCase()));
            }

            // 1.1 Source Filter (to hide "fake" template products)
            if (filter.source) {
                constraints.push(where("source", "==", filter.source));
            }

            // 2. Brand Filter
            if (filter.brand && filter.brand.length > 0) {
                constraints.push(where("brand", "in", filter.brand));
            }

            // 3. Price Filter (Simplified to avoid index issues with orderBy)
            if (filter.priceMin !== undefined && filter.priceMax !== undefined && (filter.priceMin > 0 || filter.priceMax < 500)) {
                constraints.push(where("price", ">=", filter.priceMin));
                constraints.push(where("price", "<=", filter.priceMax));
            }

            // 4. Sorting & Index Safety
            // Note: Cloud Firestore requires composite indexes for combining equality + inequality + sorting.
            // If the user hasn't created them, it will throw an error with a link.
            if (filter.sortBy) {
                switch (filter.sortBy) {
                    case "HIGH_TO_LOW":
                        constraints.push(orderBy("price", "desc"));
                        break;
                    case "LOW_TO_HIGH":
                        constraints.push(orderBy("price", "asc"));
                        break;
                    case "NEWEST":
                        constraints.push(orderBy("id", "desc"));
                        break;
                    default:
                        // Sorting by ID is safe but might still need an index if combined with 'type'
                        constraints.push(orderBy("id", "asc"));
                }
            }

            // 5. Pagination
            constraints.push(limit(filter.limit || 12));

            console.log(`🔍 [Firestore Query] Type: ${filter.type}, Source: ${filter.source}, Limit: ${filter.limit}`);
            const finalQuery = query(q, ...constraints);
            const querySnapshot = await getDocs(finalQuery);

            console.log(`📥 [Firestore Result] Found ${querySnapshot.size} products`);
            const items = querySnapshot.docs.map(doc => {
                const d = doc.data();
                if (d.title.includes("Wheel") || d.title.includes("diamond")) {
                    console.warn("⚠️ [DANGER] Found template product in Firestore result:", d.title);
                }
                return {
                    fireId: doc.id,
                    ...d
                };
            });

            return {
                total: items.length,
                hasMore: items.length === (filter.limit || 12),
                items,
            };
        } catch (error: any) {
            console.error("🔥 Firestore Query Error:", error.message);
            if (error.message.includes("index")) {
                console.error("👉 Click the link above to create the required Firestore index!");
            }
            // Return empty set instead of crashing
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

    getOrdersByUser: async (email: string) => {
        const q = query(
            collection(db, COLLECTIONS.ORDERS),
            where("email", "==", email),
            orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ fireId: doc.id, ...doc.data() }));
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
