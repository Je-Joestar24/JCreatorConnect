import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // useNewUrlParser and useUnifiedTopology are deprecated in MongoDB Driver v4.0.0+
    // They are now the default behavior and no longer needed
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

