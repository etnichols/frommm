import mongoose from 'mongoose'

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_DB_URI!)
  .then(() => console.log('MongoDB Connected'))
  .catch((err: any) => console.error('MongoDB connection error:', err))

// Export the connection
export default mongoose.connection
