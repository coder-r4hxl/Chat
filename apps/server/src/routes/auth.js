import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { loginSchema, signupSchema } from '../validation/schemas.js';

const router = express.Router();


router.post('/signup', async (req, res, next) => {
  try {
    const body = signupSchema.parse(req.body);


    const existing = await User.findOne({ email: body.email }).lean();
    if (existing) return res.status(409).json({ ok: false, error: 'Email already in use' });

    const user = await User.create({
      username: body.username,
      email: body.email,
      password: body.password
      // bcrypt hashing happens via pre('save')
    });

    return res.status(201).json({
      ok: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
        status: user.status
      }
    });
  } catch (err) {
    return next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const body = loginSchema.parse(req.body);

    const user = await User.findOne({ email: body.email });
    if (!user) return res.status(401).json({ ok: false, error: 'Invalid credentials' });

    const ok = await user.comparePassword(body.password);
    if (!ok) return res.status(401).json({ ok: false, error: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      ok: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
        status: user.status
      }
    });
  } catch (err) {
    return next(err);
  }
});

export default router;

