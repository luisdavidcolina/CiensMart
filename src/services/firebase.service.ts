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
        let q = collection(db, COLLECTIONS.PRODUCTS);
        let constraints: any[] = [];

        if (filter.type) {
            constraints.push(where("category", "==", filter.type));
        }

        if (filter.brand && filter.brand.length > 0) {
            constraints.push(where("brand", "in", filter.brand));
        }

        if (filter.priceMin !== undefined && filter.priceMax !== undefined) {
            constraints.push(where("price", ">=", filter.priceMin));
            constraints.push(where("price", "<=", filter.priceMax));
        }

        // Sorting
        if (filter.sortBy) {
            switch (filter.sortBy) {
                case "HIGH_TO_LOW":
                    constraints.push(orderBy("price", "desc"));
                    break;
                case "LOW_TO_HIGH":
                    constraints.push(orderBy("price", "asc"));
                    break;
                default:
                    constraints.push(orderBy("id", "asc"));
            }
        }

        // Pagination (Basic implementation for now)
        constraints.push(limit(filter.limit || 12));

        const finalQuery = query(q, ...constraints);
        const querySnapshot = await getDocs(finalQuery);

        const items = querySnapshot.docs.map(doc => ({
            fireId: doc.id,
            ...doc.data()
        }));

        return {
            total: items.length, // Firestore count requires extra call, keeping it simple for now
            hasMore: items.length === (filter.limit || 12),
            items,
        };
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
    }
};
