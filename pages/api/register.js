import { getDatabase } from '../../lib/db'; // Adjust the path if needed
import bcrypt from 'bcrypt';

// Email validation regex (simple check for user@domain.something format)
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

// Password validation regex (at least 10 characters, 1 uppercase letter, 1 number, 1 symbol)
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{10,}$/;

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password, email } = req.body;

    // Simple validation for missing fields
    if (!username || !password || !email) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate email format
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password format
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error: 'Password must be at least 10 characters long, include one uppercase letter, one number, and one special character.',
      });
    }

    try {
      const database = await getDatabase(); // Get the database connection
      const users = database.collection('users');

      // Check if the email is already taken
      const existingUser = await users.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email is already registered' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert the new user
      const result = await users.insertOne({
        username,
        passwordHash: hashedPassword,
        email,
      });

      // Send a success response
      res.status(201).json({ message: 'User registered successfully', id: result.insertedId });
    } catch (error) {
      console.error('Registration Error:', error); // Log the error for debugging
      res.status(500).json({ error: 'Failed to register user', details: error.message });
    }
  } else {
    // Handle method not allowed
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
