import express from 'express';
import { z } from 'zod';
import { User } from '../models/User.js';

const router = express.Router();

router.get('/me', async (req, res, next) => {
  try {
    const authUserId = req.auth?.userId;
    const me = await User.findById(authUserId).select('-password').lean();
    if (!me) return res.status(404).json({ ok: false, error: 'User not found' });

    return res.json({
      ok: true,
      user: {
        id: me._id,
        username: me.username,
        email: me.email,
        profilePic: me.profilePic,
        status: me.status,
        emailVerifiedAt: me.emailVerifiedAt,
        lastSeenAt: me.lastSeenAt
      }
    });
  } catch (err) {
    return next(err);
  }
});

router.get('/contacts', async (req, res, next) => {
  try {
    const authUserId = req.auth?.userId;
    const users = await User.find({ _id: { $ne: authUserId } })
      .select('username email profilePic status')
      .sort({ username: 1 })
      .lean();

    return res.json({ ok: true, users: users.map(u => ({
      id: u._id,
      username: u.username,
      email: u.email,
      profilePic: u.profilePic,
      status: u.status
    }))});
  } catch (err) {
    return next(err);
  }
});

export default router;

