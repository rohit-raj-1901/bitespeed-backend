# Bitespeed Backend Assignment

## Overview
This project implements a backend service to identify and reconcile customer identities across multiple purchases.

## Setup

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/bitespeed-backend.git
    ```

2. Install dependencies:
    ```sh
    cd bitespeed-backend
    npm install
    ```

3. Set up the database:
    - Ensure MongoDB is running locally or use a MongoDB cloud service.

4. Start the server:
    ```sh
    npm start
    ```

## API Endpoints

### POST /identify

Identifies and reconciles customer identities based on email and/or phone number.

**Request:**
```json
{
    "email": "test@example.com",
    "phoneNumber": "123456"
}
