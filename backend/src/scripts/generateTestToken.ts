import { generateAccessToken } from '../utils/jwtUtils.js';

/**
 * Helper script to generate a test JWT token for manual API testing
 *
 * Usage:
 * 1. Make sure you have a user ID from your MongoDB database
 * 2. Run: npx tsx src/scripts/generateTestToken.ts <userId> <role>
 * 3. Copy the generated token and paste it into Inventory.tsx
 *
 * Example:
 * npx tsx src/scripts/generateTestToken.ts 507f1f77bcf86cd799439011 admin
 */

const userId = process.argv[2];
const role = process.argv[3] || 'staff';

if (!userId) {
  console.error('❌ Error: User ID is required');
  console.log('\nUsage: npx tsx src/scripts/generateTestToken.ts <userId> <role>');
  console.log('Example: npx tsx src/scripts/generateTestToken.ts 507f1f77bcf86cd799439011 admin');
  process.exit(1);
}

// Validate role
const validRoles = ['admin', 'manager', 'staff'];
if (!validRoles.includes(role)) {
  console.error(`❌ Error: Invalid role "${role}". Must be one of: ${validRoles.join(', ')}`);
  process.exit(1);
}

try {
  const token = generateAccessToken(userId, role as 'admin' | 'manager' | 'staff');

  console.log('\n✅ Test JWT Token Generated Successfully!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`User ID: ${userId}`);
  console.log(`Role: ${role}`);
  console.log('Expires in: 15 minutes');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\nYour Token:');
  console.log(token);
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\nTo use this token:');
  console.log('1. Copy the token above');
  console.log('2. Open frontend/src/pages/Inventory.tsx');
  console.log('3. Replace "your-jwt-token-here" with your token');
  console.log('4. Save and test your inventory API calls\n');
} catch (error) {
  console.error('❌ Error generating token:', error);
  process.exit(1);
}
