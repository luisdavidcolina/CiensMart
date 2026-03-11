import { firebaseService } from "./firebase.service";

export const orderService = {
    createOrder: async (orderData: any) => {
        // Enriched order data with more details if needed
        return await firebaseService.saveOrder(orderData);
    },

    getOrderHistory: async (email: string) => {
        return await firebaseService.getOrdersByUser(email);
    },

    getOrderById: async (id: any) => {
        return await firebaseService.getProductById(id); // Using the general getById for now
    }
}
