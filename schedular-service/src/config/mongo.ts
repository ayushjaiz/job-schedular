import mongoose from 'mongoose';

export const connectMongoDB = async () => {
    const conn = mongoose
        .connect(process.env.MONGO_URI || '')
        .then(() => mongoose);

    await conn;
    return conn;
};

// connection status logging
mongoose.connection.on('connecting', () => {
    console.log('MongoDB connecting...');
});
mongoose.connection.on('connected', () => {
    console.log('MongoDB Connected!');
});
mongoose.connection.on('disconnecting', () => {
    console.log('MongoDB Disconnecting...');
});
mongoose.connection.on('disconnected', () => {
    console.log('MongoDB Disconnected!');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
    mongoose.connection.on('close', () => {
        console.log('MongoDB Connection Closed!');
        process.exit(0);
    });
});

export default mongoose;
