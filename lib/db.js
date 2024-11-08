import dotenv from 'dotenv'; // Import dotenv to load environment variables
import { MongoClient } from 'mongodb';

// Load environment variables
dotenv.config();

const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

// Check if the MongoDB URI is provided
if (!uri) {
    throw new Error("Please add your MongoDB URI to the environment variables.");
}

// Only create a new MongoClient instance if one doesn’t already exist
if (!client) {
    client = new MongoClient(uri);  // Removed useNewUrlParser and useUnifiedTopology options

    clientPromise = client.connect()
        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch((error) => {
            console.error('Failed to connect to MongoDB', error);
            throw error; // Propagate the error
        });
}

async function getDatabase() {
    await clientPromise; // Wait for the client to connect if it's not already
    return client.db('budget-planner-db'); // Ensure this matches your MongoDB database name
}

export { getDatabase };
