export interface PaymentResponse {
    success: boolean;
    data?: any;
    error?: string;
}

const API_URL = "https://ecommerce-bancobsidiana-team5-production.up.railway.app/api/v1/transaction/process";

export const paymentService = {
    async processTransaction(cardDetails: any, amount: number, description: string) {
        try {
            const payload = {
                card_number: cardDetails.cardNumber.replace(/\s/g, ""),
                expiry: cardDetails.expiry,
                cvv: cardDetails.cvv,
                amount: amount,
                merchant_id: "ciens-mart",
                description: description,
            };

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok && data.status === "APPROVED") {
                return { success: true, data: data };
            } else {
                return { success: false, error: data.message || "Transaction Declined" };
            }
        } catch (error) {
            console.error("Payment Error:", error);
            return { success: false, error: "Network or Server Error" };
        }
    },
};
