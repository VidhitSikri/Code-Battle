const mongoose = require('mongoose');

async function connectToDb() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to db');
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
    }
}


module.exports = connectToDb;