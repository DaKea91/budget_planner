import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

if (!uri) {
    throw new Error("Please add your MongoDB URI to the environment variables.");
}

// Only create a new MongoClient instance if one doesn’t already exist
if (!client) {
    client = new MongoClient(uri);
    clientPromise = client.connect();
}

async function getDatabase() {
    await clientPromise; // Wait for the client to connect if it's not already
    return client.db('budget-planner-cluster');
}

export { getDatabase };
