import { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newExpense, setNewExpense] = useState({
    amount: '',
    category: '',
    description: '',
    date: ''
  });

  const router = useRouter();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const session = await getSession();
        if (!session) {
          setError('User not authenticated');
          return;
        }

        const res = await fetch('/api/expenses');
        const data = await res.json();

        if (res.ok) {
          setExpenses(data);
        } else {
          setError('Failed to fetch expenses');
        }
      } catch (error) {
        setError('An error occurred while fetching expenses');
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const session = await getSession();
    if (!session) {
      setError('User not authenticated');
      return;
    }

    const newExpenseData = {
      amount: parseFloat(newExpense.amount),  // Ensure the amount is a number
      category: newExpense.category,
      description: newExpense.description,
      date: new Date(newExpense.date).toISOString(), // Convert date to ISO string
      userId: session.user.id // Associate the expense with the logged-in user
    };

    try {
      const res = await fetch('/api/add-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newExpenseData),
      });

      const data = await res.json();

      if (res.ok) {
        setExpenses((prevExpenses) => [...prevExpenses, data]);  // Add the new expense to the UI
        setNewExpense({ amount: '', category: '', description: '', date: '' });  // Reset form
      } else {
        setError('Failed to add expense');
      }
    } catch (error) {
      setError('An error occurred while adding the expense');
    }
  };

  return (
    <div>
      <h1>Expenses</h1>

      {/* Display error or loading message */}
      {error && <p>{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {expenses.map((expense) => (
            <li key={expense._id}>
              {expense.amount < 0 ? `-€${Math.abs(expense.amount).toFixed(2)}` : `€${expense.amount.toFixed(2)}`} - {expense.category} - {expense.description} - {new Date(expense.date).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}

      {/* Add Entry Form */}
      <h2>Add New Entry</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Amount</label>
          <input
            type="number"
            step="0.01"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
            required
          />
        </div>

        <div>
          <label>Category</label>
          <input
            type="text"
            value={newExpense.category}
            onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
            required
          />
        </div>

        <div>
          <label>Description</label>
          <input
            type="text"
            value={newExpense.description}
            onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
            required
          />
        </div>

        <div>
          <label>Date</label>
          <input
            type="date"
            value={newExpense.date}
            onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
            required
          />
        </div>

        <button type="submit">Add Entry</button>
      </form>
    </div>
  );
}
