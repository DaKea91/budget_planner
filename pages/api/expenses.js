// pages/api/expenses.js (API route)
import { ObjectId } from 'mongodb'; // Import ObjectId to convert string to ObjectId
import { getSession } from 'next-auth/react'; // Ensure you're importing getSession correctly
import { getExpensesCollection } from '../../lib/db'; // Assuming you have this function to get the expenses collection

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const expensesCollection = await getExpensesCollection();

  switch (req.method) {
    case 'GET':
      try {
        const userId = new ObjectId(session.user.id);
        const userExpenses = await expensesCollection
          .find({ userId })
          .toArray();

        res.setHeader('Cache-Control', 'no-store'); // Prevent caching

        if (userExpenses.length === 0) {
          res.status(404).json({ message: 'No expenses found.' });
        } else {
          res.status(200).json(userExpenses);
        }
      } catch (error) {
        res.status(500).json({ message: 'Failed to fetch expenses', error: error.message });
      }
      break;

    default:
      res.status(405).json({ message: 'Method Not Allowed' });
  }
}
