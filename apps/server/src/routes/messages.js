import express from 'express';
import mongoose from 'mongoose';
import { Message } from '../models/Message.js';
import { sendMessageSchema } from '../validation/schemas.js';


function toClientMessage(doc) {
  return {
    id: doc._id,
    senderId: doc.senderId,
    receiverId: doc.receiverId,
    messageText: doc.messageText,
    mediaUrl: doc.mediaUrl,
    createdAt: doc.createdAt
  };
}

// Factory so the route can emit socket.io events and use the userId -> socketId map
export default function messageRoutesFactory({ io, userIdToSocketId } = {}) {
  const router = express.Router();

  // GET /api/messages/:id?with=<otherUserId>
  // Retrieves the chat history between the authenticated user and `with`.
  router.get('/:id', async (req, res, next) => {
    try {
      const authUserId = req.auth?.userId;
      const otherUserId = req.query.with;

      if (!authUserId) return res.status(401).json({ ok: false, error: 'Unauthorized' });
      if (!otherUserId) return res.status(400).json({ ok: false, error: 'Missing query param: with' });
      if (!mongoose.Types.ObjectId.isValid(otherUserId)) return res.status(400).json({ ok: false, error: 'Invalid with user id' });

      const other = new mongoose.Types.ObjectId(otherUserId);
      const me = new mongoose.Types.ObjectId(authUserId);

      const messages = await Message.find({
        $or: [
          { senderId: me, receiverId: other },
          { senderId: other, receiverId: me }
        ]
      })
        .sort({ createdAt: 1 })
        .lean();

      return res.json({ ok: true, messages: messages.map(m => ({
        id: m._id,
        senderId: m.senderId,
        receiverId: m.receiverId,
        messageText: m.messageText,
        mediaUrl: m.mediaUrl,
        createdAt: m.createdAt
      })) });
    } catch (err) {
      return next(err);
    }
  });

  // POST /api/messages/:id/send?with=<receiverUserId>
  router.post('/:id/send', async (req, res, next) => {
    try {
      const authUserId = req.auth?.userId;
      const receiverId = req.query.with;

      if (!authUserId) return res.status(401).json({ ok: false, error: 'Unauthorized' });
      if (!receiverId) return res.status(400).json({ ok: false, error: 'Missing query param: with' });
      if (!mongoose.Types.ObjectId.isValid(receiverId)) return res.status(400).json({ ok: false, error: 'Invalid receiver user id' });

      const body = sendMessageSchema.parse(req.body ?? {});


      const doc = await Message.create({
        senderId: authUserId,
        receiverId,
        messageText: body.messageText,
        mediaUrl: body.mediaUrl
      });

      const messageData = toClientMessage(doc);

      // Hand-off: DB persistence -> socket emission
      try {
        const recipientSocketId = userIdToSocketId?.get?.(String(receiverId));
        if (recipientSocketId && io?.to) {
          io.to(recipientSocketId).emit('newMessage', { messageData });
        }
      } catch (socketErr) {
        // Don't fail the HTTP request if realtime delivery fails.
        console.error('[messages] socket emit failed', socketErr);
      }

      return res.status(201).json({ ok: true, message: messageData });
    } catch (err) {
      return next(err);
    }
  });

  return router;
}


