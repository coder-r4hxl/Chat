import mongoose from 'mongoose';
import { env } from '../config/env.js';

let isConnected = false;

export async function connectMongo() {
  if (isConnected) return mongoose.connection;

  mongoose.set('strictQuery', true);

  await mongoose.connect(env.MONGODB_URI, {
    dbName: process.env.MONGODB_DB_NAME,
    serverSelectionTimeoutMS: 10000
  });

  isConnected = true;
  return mongoose.connection;
}

export async function disconnectMongo() {
  isConnected = false;
  await mongoose.disconnect();
}

