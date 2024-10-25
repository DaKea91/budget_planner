import dotenv from 'dotenv';
dotenv.config();

import { MongoClient } from 'mongodb';
import { getDatabase } from './db.js'; // Adjust the path to your db.js file

const uri = process.env.MONGODB_URI; // Ensure this is set in your environment variables
const client = new MongoClient(uri);

// Export the handler function
export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const database = await getDatabase(); // Get the database connection
            const expenses = database.collection('expenses');

            const result = await expenses.insertOne(req.body);
            res.status(201).json({ message: 'Expense added', id: result.insertedId });
        } catch (error) {
            console.error(error); // Log the error for debugging
            res.status(500).json({ error: 'Failed to add expense' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
