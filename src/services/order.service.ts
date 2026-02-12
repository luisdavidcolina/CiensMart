import { localDataService } from "./localData.service";

export const orderService = {
    createOrder: (orderData: any) => {
        // Enriched order data with more details if needed
        return localDataService.saveOrder(orderData);
    },

    getOrderHistory: (email: string) => {
        return localDataService.getOrdersByUser(email);
    },

    getOrderById: (id: any) => {
        return localDataService.getOrderById(id);
    }
}
