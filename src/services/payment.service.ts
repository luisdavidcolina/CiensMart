export interface PaymentResponse {
    success: boolean;
    data?: any;
    error?: string;
    bankName?: string;
}

const BANK_ENDPOINTS = {
    OBSIDIANA: "https://ecommerce-bancobsidiana-team5-production.up.railway.app/api/v1/transaction/process",
    CREDITBANK: "https://core-banking-service-6pup.onrender.com/payments/card"
};

export const paymentService = {
    async processTransaction(cardDetails: any, amount: number, description: string): Promise<PaymentResponse> {
        const fullCardNumber = cardDetails.cardNumber.replace(/\s/g, "");
        const bin = fullCardNumber.slice(0, 4);

        console.log(`💳 [Payment Router] Detecting Bank for BIN: ${bin}`);

        if (bin === "0572") {
            return await this.payWithObsidiana(fullCardNumber, cardDetails, amount, description);
        } else if (bin === "5297") {
            return await this.payWithCreditBank(fullCardNumber, cardDetails, amount, description);
        } else {
            return {
                success: false,
                error: "Banco no soportado. Use tarjetas de Bancobsidiana (0572) o CreditBank (5297)."
            };
        }
    },

    async payWithObsidiana(cardNumber: string, details: any, amount: number, description: string): Promise<PaymentResponse> {
        try {
            const payload = {
                card_number: cardNumber,
                expiry: details.expiry,
                cvv: details.cvv,
                amount: amount,
                merchant_id: "ciens-mart",
                description: description,
            };

            const response = await fetch(BANK_ENDPOINTS.OBSIDIANA, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (response.ok && data.status === "APPROVED") {
                return { success: true, data: data, bankName: "Bancobsidiana" };
            }
            return { success: false, error: data.message || "Transacción Declinada por Obsidiana", bankName: "Bancobsidiana" };
        } catch (error) {
            return { success: false, error: "Error de conexión con Bancobsidiana" };
        }
    },

    async payWithCreditBank(cardNumber: string, details: any, amount: number, description: string): Promise<PaymentResponse> {
        try {
            const payload = {
                card_number: cardNumber,
                expiry: details.expiry,
                cvv: details.cvv,
                amount: Number(amount),
                description: description,
                destination_account: "1234567890" // Cuenta de CiensMart en CreditBank
            };

            const response = await fetch(BANK_ENDPOINTS.CREDITBANK, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            // Note: CreditBank might have a different success criteria (e.g. data.status === "SUCCESS")
            // Assuming standard fetch ok check if not specified
            if (response.ok) {
                return { success: true, data: data, bankName: "CreditBank" };
            }
            return { success: false, error: data.error || data.message || "Transacción Fallida en CreditBank", bankName: "CreditBank" };
        } catch (error) {
            console.error("CreditBank Error:", error);
            return { success: false, error: "Error de conexión con CreditBank" };
        }
    }
};
