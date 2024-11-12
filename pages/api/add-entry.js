import { ObjectId } from 'mongodb';
import { getSession } from 'next-auth/react';
import { getExpensesCollection } from '../../lib/db';

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const expensesCollection = await getExpensesCollection();

  if (req.method === 'POST') {
    try {
      const { amount, category, description, date, userId } = req.body;

      // Insert the new expense into the database
      const result = await expensesCollection.insertOne({
        amount,
        category,
        description,
        date,
        userId: new ObjectId(userId), // Ensure the userId is stored as an ObjectId
      });

      // Return the newly inserted expense
      res.status(201).json(result.ops[0]);  // Sending back the created expense
    } catch (error) {
      res.status(500).json({ message: 'Failed to create expense', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
