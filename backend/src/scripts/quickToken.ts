import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { generateAccessToken } from '../utils/jwtUtils.js';
import User from '../models/userModel.js';

// Load environment variables
dotenv.config();

/**
 * Quick token generator - connects to DB and generates token for first user
 *
 * Usage:
 * cd backend
 * npx tsx src/scripts/quickToken.ts
 */

async function generateToken() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI not found in .env file');
    }

    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    // Find the first active user
    const user = await User.findOne({ isActive: true });

    if (!user) {
      console.error('❌ No active users found in the database');
      console.log('\n💡 Tip: Create a user first by:');
      console.log('   1. Running your backend server');
      console.log('   2. Going to http://localhost:5173/register');
      console.log('   3. Creating an account\n');
      await mongoose.disconnect();
      process.exit(1);
    }

    // Generate token
    const token = generateAccessToken(user._id.toString(), user.role);

    console.log('✅ Test JWT Token Generated Successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`User: ${user.firstName} ${user.lastName}`);
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.role}`);
    console.log(`User ID: ${user._id}`);
    console.log('Expires in: 15 minutes');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📋 Your Token (copy this):');
    console.log('\x1b[32m%s\x1b[0m', token); // Green color
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📝 Next Steps:');
    console.log('1. Copy the green token above');
    console.log('2. Open: frontend/src/pages/Inventory.tsx');
    console.log('3. Find line 21: const HARDCODED_TOKEN = "your-jwt-token-here";');
    console.log('4. Replace "your-jwt-token-here" with your token');
    console.log('5. Save the file and test your inventory page!');
    console.log('\n🚀 Or test directly in terminal:');
    console.log(`\x1b[36mcurl -H "Authorization: Bearer ${token}" http://localhost:3001/api/inventory\x1b[0m\n`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

generateToken();
