import productsData from "../data/simulated/products.json";

const KEYS = {
    PRODUCTS: "simulated_products",
    ORDERS: "simulated_orders",
    USERS: "simulated_users",
    CART: "simulated_cart",
};

export const localDataService = {
    initializeData: () => {
        if (typeof window === "undefined") return;
        if (!localStorage.getItem(KEYS.PRODUCTS)) {
            localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(productsData));
        }
        if (!localStorage.getItem(KEYS.USERS)) {
            localStorage.setItem(KEYS.USERS, JSON.stringify([]));
        }
        if (!localStorage.getItem(KEYS.ORDERS)) {
            localStorage.setItem(KEYS.ORDERS, JSON.stringify([]));
        }
    },

    getAllProducts: () => {
        if (typeof window === "undefined") return [];
        // Ensure data is initialized
        if (!localStorage.getItem(KEYS.PRODUCTS)) {
            localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(productsData));
        }
        return JSON.parse(localStorage.getItem(KEYS.PRODUCTS) || "[]");
    },

    getProducts: (filter: any) => {
        let products = localDataService.getAllProducts();

        // Filtering logic similar to what the GraphQL resolver would do
        if (filter.type) {
            products = products.filter((p: any) => p.type === filter.type || p.category.toLowerCase() === filter.type.toLowerCase());
        }
        if (filter.brand && filter.brand.length > 0) {
            products = products.filter((p: any) => filter.brand.includes(p.brand));
        }
        if (filter.color) {
            // Basic check if any variant has this color or if it's a top-level property
            // products = products.filter((p: any) => p.variants?.some((v:any) => v.color === filter.color));
        }
        if (filter.priceMin !== undefined && filter.priceMax !== undefined) {
            products = products.filter((p: any) => p.price >= filter.priceMin && p.price <= filter.priceMax);
        }

        // Sorting
        if (filter.sortBy) {
            switch (filter.sortBy) {
                case "HIGH_TO_LOW":
                    products.sort((a: any, b: any) => b.price - a.price);
                    break;
                case "LOW_TO_HIGH":
                    products.sort((a: any, b: any) => a.price - b.price);
                    break;
                case "NEWEST":
                    products.sort((a: any, b: any) => (b.new === a.new ? 0 : b.new ? 1 : -1));
                    break;
                default:
                    break;
            }
        }

        // Pagination
        const total = products.length;
        const items = products.slice(filter.indexFrom, filter.indexFrom + filter.limit);
        const hasMore = filter.indexFrom + filter.limit < total;

        return {
            total,
            hasMore,
            items,
        };
    },

    getProductById: (id: number) => {
        const products = localDataService.getAllProducts();
        return products.find((p: any) => p.id === id);
    },

    getCollection: (collectionName: string) => {
        // For now just return all or random, or specific if we add collection logic
        // Simulating "special products"
        const products = localDataService.getAllProducts();
        return products;
    },

    getRelatedProducts: (type: string, id: number) => {
        const products = localDataService.getAllProducts();
        return products.filter((p: any) => p.id !== id).slice(0, 6); // Just return some others
    },

    // Orders
    saveOrder: (order: any) => {
        const orders = JSON.parse(localStorage.getItem(KEYS.ORDERS) || "[]");
        order.id = Date.now();
        order.createdAt = new Date().toISOString();
        orders.push(order);
        localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
        return order;
    },

    getOrdersByUser: (email: string) => {
        const orders = JSON.parse(localStorage.getItem(KEYS.ORDERS) || "[]");
        return orders.filter((o: any) => o.email === email || o.userId === email);
    },

    getOrderById: (id: any) => {
        const orders = JSON.parse(localStorage.getItem(KEYS.ORDERS) || "[]");
        // ID might be number or string in storage
        return orders.find((o: any) => o.id == id);
    }
};
