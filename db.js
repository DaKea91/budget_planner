import { MongoClient } from 'mongodb';

// Use environment variables for sensitive information
const uri = process.env.MONGODB_URI; // Ensure this is set in your environment variables
const client = new MongoClient(uri);

// Connect once when the module is loaded
async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
    }
}

// Call the connection function
connectToDatabase().catch(console.dir);

// You can create a function to interact with the database
async function getDatabase() {
    return client.db('budget-planner-cluster');
}

// Export the database connection
export { getDatabase };
