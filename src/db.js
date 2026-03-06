const mongoose = require('mongoose');

// Global flag for fallback
global.useInMemory = false;

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.warn('MONGODB_URI is not set. Falling back to in-memory store.');
            global.useInMemory = true;
            return;
        }

        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        global.useInMemory = false;
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        console.warn('Falling back to in-memory store.');
        global.useInMemory = true;
    }
};

module.exports = connectDB;
