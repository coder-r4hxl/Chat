import { connectMongo, disconnectMongo } from '../db/connectMongo.js';

async function main() {
  try {
    await connectMongo();
    console.log('✅ MongoDB connection verified');
  } catch (e) {
    console.error('❌ MongoDB connection failed');
    console.error(e);
    process.exitCode = 1;
  } finally {
    try {
      await disconnectMongo();
    } catch (_) {
      // ignore
    }
  }
}

main();

