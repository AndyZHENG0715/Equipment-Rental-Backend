const { MongoClient } = require('mongodb');

process.env.MONGODB_URI = 'mongodb://andy-comp3047-assignment:UvJvDXB0lDOelAGYWskiRqZSh6zpv29zz9ipbU1kSlSiRzxFUYZ6uvHnE2fwUGaqCrq7vLD2OUMdACDbYkrEOQ%3D%3D@andy-comp3047-assignment.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&replicaSet=globaldb&maxIdleTimeMS=120000&appName=@andy-comp3047-assignment@';

if (!process.env.MONGODB_URI) {
    // throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
    process.env.MONGODB_URI = 'mongodb://localhost:27017';
}

// Connect to MongoDB
async function connectToDB() {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db('equipmentDB');
    return db;
}

module.exports = { connectToDB };