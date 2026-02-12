# CiensMart - E-commerce Application

CiensMart is a modern e-commerce application built with Next.js, React, and TypeScript. It features a fully simulated local backend and integration with a custom payment gateway.

## Features

-   **Product Browsing**: Browse products with filtering (Price, Brand, Color) and sorting.
-   **Local Backend Simulation**:
    -   Uses `localStorage` to simulate a persistent database for Products, Users, and Orders.
    -   No external backend dependencies for core functionality.
    -   Mock data stored in `src/data/simulated/products.json`.
-   **Authentication**:
    -   Register and Login functionality (Simulated).
    -   User sessions persisted locally.
-   **Shopping Cart**: Fully functional cart with persistent state.
-   **Checkout & Payment**:
    -   Simplified checkout process.
    -   **Credit Card Integration**: Integrated with Bancobsidiana payment gateway.
    -   **Fallback Mechanism**: If payment fails, users can choose to "Buy anyway" to save the order for later processing.

## Getting Started

### Prerequisites

-   Node.js (v14 or higher)
-   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

### Running the Application

1.  Start the development server:
    ```bash
    npm run dev
    # or
    yarn dev
    ```
2.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

-   `src/components`: Reusable UI components.
-   `src/views`: Page layouts and views.
-   `src/services`: Service layer for business logic.
    -   `localData.service.ts`: Manages simulated database operations.
    -   `auth.service.ts`: Manages user authentication.
    -   `order.service.ts`: Manages order creation.
    -   `payment.service.ts`: Handles communication with the payment gateway.
-   `src/hooks`: Custom React hooks.
    -   `useLocalQuery.ts`: A drop-in replacement for Apollo's `useQuery` to fetch local data.
-   `src/data/simulated`: Contains mock JSON data.

## Payment Integration

The application integrates with the Bancobsidiana API for processing transactions.

-   **Endpoint**: `https://ecommerce-bancobsidiana-team5-production.up.railway.app/API/v1/transaction/process`
-   **Merchant ID**: `ciens-mart`

### Test Cards

You can use the following test card (or any random valid format for simulation):
-   **Card Number**: `0572818983980488`
-   **Expiry**: `05/27`
-   **CVV**: `881`

If the API is down or rejects the card, an error message will be displayed, and a "Buy anyway (Pay Later)" option will appear to allow completing the order flow.
