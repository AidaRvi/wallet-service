# Wallet Service

The `wallet-service` manages user balances and transactions, built with Node.js and Nest.js using TypeScript. It integrates with a PostgreSQL database for secure data handling, includes detailed transaction logging, and tracks daily transaction totals. The service is well-tested to ensure accuracy.

## Installation

1. **Create a `.env` File**

   First, create a `.env` file at the root of the project and copy all the variables from the `.example.env` file into it. Fill in the variables based on your specific requirements.

2. **Install Dependencies**

   Run the following command to install the necessary dependencies:

   ```bash
   npm install
   ```

3. **Start the Application**

   Start the application using:

   ```bash
   npm run start
   ```

   When you run the application, it will automatically insert a new user into the database. The ID of the newly created user will be logged in the console. You can copy this user ID and use it in your requests.

## API Documentation

Access the API documentation by opening your browser and navigating to:

[http://localhost:5050/document](http://localhost:5050/document)

## Running Tests

To run the tests, use the following command:

```bash
npm run test
```
