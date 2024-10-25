import { getDatabase } from './db.js'; // Adjust the path if needed
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { username, password, email } = req.body;

        // Simple validation (you can enhance this)
        if (!username || !password || !email) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

        try {
            const database = await getDatabase(); // Get the database connection
            const users = database.collection('users');

            // Insert the new user
            const result = await users.insertOne({
                username,
                passwordHash: hashedPassword,
                email,
            });

            res.status(201).json({ message: 'User registered', id: result.insertedId });
        } catch (error) {
            console.error(error); // Log the error for debugging
            res.status(500).json({ error: 'Failed to register user' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
