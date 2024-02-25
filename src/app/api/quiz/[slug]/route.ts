import mongoose from 'mongoose'

// Export the connection
export default mongoose.connection

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  console.log('params: ', params)
  const slug = params.slug

  // Connect to MongoDB
  mongoose
    .connect(process.env.MONGO_DB_URI!)
    .then(() => console.log('MongoDB Connected'))
    .catch((err: any) => console.error('MongoDB connection error:', err))
}
