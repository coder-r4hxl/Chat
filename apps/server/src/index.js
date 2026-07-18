/*
  Phase 3: Real - Time Logic Implementation
  (Note: removed non-code text that broke syntax)
*/

import http from 'http';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import jwt from 'jsonwebtoken';

import { env } from './config/env.js';
import { connectMongo } from './db/connectMongo.js';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import messageRoutesFactory from './routes/messages.js';
import { requireAuth } from './middleware/authJwt.js';

import { initSocket } from './socket/index.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));

app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/api/test', async (_req, res) => {
  try {
    const conn = await connectMongo();
    const dbName = conn?.db?.databaseName;
    res.json({ ok: true, dbName });
  } catch (e) {
    res.status(500).json({ ok: false, error: e?.message ?? String(e) });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/users', requireAuth, userRoutes);

import { errorHandler } from './middleware/error.js';

app.use(errorHandler);


const start = async () => {
  await connectMongo();

  const server = http.createServer(app);

  // Phase 3: Socket.io init (must happen before messageRoutesFactory)
  const { io, userIdToSocketId } = initSocket(server, {
    getUserIdFromSocket: (socket) => {
      // Client should connect with: io(API_URL, { auth: { token }})
      const token = socket.handshake?.auth?.token;
      if (!token) return null;
      const payload = jwt.verify(token, env.JWT_SECRET);
      return payload?.userId ?? null;
    }
  });

  // Now that io + presence map exist, wire real-time aware message routes
  app.use('/api/messages', requireAuth, messageRoutesFactory({ io, userIdToSocketId }));

  server.listen(env.PORT, () => {
    console.log(`[server] listening on port ${env.PORT}`);
  });
};

start().catch((e) => {
  console.error('[server] failed to start', e);
  process.exit(1);
});