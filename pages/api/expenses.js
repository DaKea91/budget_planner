import { getDatabase } from '../../lib/db'; // Adjust the path to your db.js file

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
