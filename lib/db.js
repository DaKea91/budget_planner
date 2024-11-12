import dotenv from 'dotenv'; // Import dotenv to load environment variables
import { MongoClient } from 'mongodb';

// Load environment variables
dotenv.config();

const uri = process.env.MONGODB_URI; // Your MongoDB URI
let client;
let clientPromise;

// Check if the MongoDB URI is provided
if (!uri) {
    throw new Error("Please add your MongoDB URI to the environment variables.");
}

// Check if we are running in a serverless environment (like Vercel)
const isServerless = process.env.VERCEL || process.env.NOW;

if (isServerless) {
    // Serverless environments (like Vercel, Netlify) benefit from reusing client connections
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    // Regular environments (like local dev) create a new connection as before
    if (!client) {
        client = new MongoClient(uri);
        clientPromise = client.connect()
            .then(() => {
                console.log('Connected to MongoDB');
            })
            .catch((error) => {
                console.error('Failed to connect to MongoDB', error);
                throw error; // Propagate the error
            });
    }
}

// Function to get the database
async function getDatabase() {
    await clientPromise; // Wait for the client to connect if it's not already
    return client.db('budget-planner-db'); // Ensure this matches your MongoDB database name
}

// Function to get the users collection (for authentication data)
async function getUsersCollection() {
    const db = await getDatabase();
    return db.collection('users'); // Adjust collection name as needed
}

// Function to get the expenses collection (for expense management)
async function getExpensesCollection() {
    const db = await getDatabase();
    return db.collection('expenses'); // Adjust collection name as needed
}

// Export all necessary functions
export { getDatabase, getUsersCollection, getExpensesCollection };
