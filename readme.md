# Order Processing System

## Overview

This is a scalable, event-driven order processing system built with Node.js, Express, MongoDB, Redis, AWS SQS, and AWS SES. It features JWT-based authentication, asynchronous order processing, inventory validation, caching, and email notifications.

## Setup Instructions

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Create a `.env` file in the root directory with the required environment variables (see sample above).
4. Start MongoDB and Redis locally (or point to your services).
5. Start the API server with `npm start` (or `npm run dev` for development with nodemon).
6. Start the order processor worker in a separate terminal using `npm run worker`.

## API Endpoints

-   **POST /api/auth/register** – Register a new user.
-   **POST /api/auth/login** – Login and receive access and refresh tokens.
-   **POST /api/auth/refresh** – Refresh the access token.
-   **POST /api/orders** – Create a new order (requires JWT).
-   **GET /api/orders/:id** – Retrieve order details (requires JWT, cached with Redis).

## Postman Collection

A Postman collection is included in the repository for testing the API endpoints.

## Architecture

-   **Authentication:** JWT and refresh tokens.
-   **Order Management:** Inventory check, order creation, caching.
-   **Asynchronous Processing:** AWS SQS and a dedicated worker.
-   **Notifications:** AWS SES for order confirmation emails.
