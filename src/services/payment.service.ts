export interface PaymentResponse {
    success: boolean;
    data?: any;
    error?: string;
    bankName?: string;
}

const BANK_ENDPOINTS = {
    OBSIDIANA: process.env.NEXT_PUBLIC_PAYMENT_URL_OBSIDIANA || "https://ecommerce-bancobsidiana-team5-production.up.railway.app/api/v1/transaction/process",
    CREDITBANK: process.env.NEXT_PUBLIC_PAYMENT_URL_CREDITBANK || "https://core-banking-service-6pup.onrender.com/payments/card",
    CIENSPAY: process.env.NEXT_PUBLIC_PAYMENT_URL_CIENSPAY || "http://3.144.142.161/api/transactions/simulate/"
};

export const paymentService = {
    async processTransaction(cardDetails: any, amount: number, description: string, manualBank?: string): Promise<PaymentResponse> {
        const cleanCardNumber = cardDetails.cardNumber.replace(/\D/g, "");
        const bin = cleanCardNumber.slice(0, 4);

        console.log(`💳 [Payment Router] Routing transaction. Manual: ${manualBank || 'None'}, BIN: ${bin}`);

        // 1. Priority: Manual Selection
        if (manualBank === "cienspay") {
            return await this.payWithCiensPay(cardDetails.cardNumber, cardDetails, amount, description);
        } else if (manualBank === "bancobsidiana") {
            return await this.payWithObsidiana(cardDetails.cardNumber, cardDetails, amount, description);
        } else if (manualBank === "creditbank") {
            return await this.payWithCreditBank(cardDetails.cardNumber, cardDetails, amount, description);
        }

        // 2. Fallback: Routing based on BIN
        if (bin === "4651") {
            return await this.payWithCiensPay(cardDetails.cardNumber, cardDetails, amount, description);
        } else if (bin === "0572" || bin === "0506") {
            return await this.payWithObsidiana(cardDetails.cardNumber, cardDetails, amount, description);
        } else if (bin === "5297") {
            return await this.payWithCreditBank(cardDetails.cardNumber, cardDetails, amount, description);
        } else {
            return {
                success: false,
                error: `Banco no soportado (BIN: ${bin}). Intente seleccionando el banco manualmente.`
            };
        }
    },

    /**
     * Specific payment logic for Ciens Pay (uses simulation API)
     */
    async payWithCiensPay(cardNumber: string, details: any, amount: number, description: string): Promise<PaymentResponse> {
        try {
            const payload = {
                button_bank_external: false,
                bank_identifier: "cienspay",
                card_number: cardNumber,
                expiry_date: details.expiry,
                cvv: details.cvv,
                amount: String(amount),
                description: description
            };

            const response = await fetch(BANK_ENDPOINTS.CIENSPAY, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error(`Server Error: ${response.status}`);

            const data = await response.json();
            return { success: true, data, bankName: "Ciens Pay" };
        } catch (error: any) {
            console.error("Ciens Pay Error:", error);
            return { success: false, error: "Error en Ciens Pay. Intente más tarde.", bankName: "Ciens Pay" };
        }
    },

    /**
     * Specific payment logic for CreditBank (Direct Endpoint)
     */
    async payWithCreditBank(cardNumber: string, details: any, amount: number, description: string): Promise<PaymentResponse> {
        try {
            const payload = {
                card_number: cardNumber,
                expiry: details.expiry,
                cvv: details.cvv,
                amount: amount,
                description: description,
                destination_account: process.env.NEXT_PUBLIC_CREDITBANK_ACCOUNT || "9368398521",
                bank_identifier: "creditbank"
            };

            const response = await fetch(BANK_ENDPOINTS.CREDITBANK, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error(`Server Error: ${response.status}`);

            const data = await response.json();
            return { success: true, data, bankName: "CreditBank" };
        } catch (error: any) {
            console.error("CreditBank Error:", error);
            return { success: false, error: "Error en CreditBank. Verifique sus datos.", bankName: "CreditBank" };
        }
    },

    /**
     * Specific payment logic for Bancobsidiana (Direct Endpoint)
     */
    async payWithObsidiana(cardNumber: string, details: any, amount: number, description: string): Promise<PaymentResponse> {
        try {
            const payload = {
                card_number: cardNumber.replace(/\s/g, ""),
                expiry: details.expiry,
                cvv: details.cvv,
                amount: amount,
                merchant_id: process.env.NEXT_PUBLIC_OBSIDIANA_MERCHANT_ID || "ciens-mart",
                description: description,
            };

            const response = await fetch(BANK_ENDPOINTS.OBSIDIANA, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (response.ok && (data.status === "APPROVED" || data.success)) {
                return { success: true, data, bankName: "Bancobsidiana" };
            }
            return { success: false, error: data.message || "Declinada por Obsidiana", bankName: "Bancobsidiana" };
        } catch (error: any) {
            console.error("Obsidiana Error:", error);
            return { success: false, error: "Error de conexión con Obsidiana", bankName: "Bancobsidiana" };
        }
    }
};
