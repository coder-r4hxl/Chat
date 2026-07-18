import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ ok: false, error: 'Missing or invalid Authorization header' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.auth = { userId: payload.userId };
    return next();
  } catch (err) {
    return res.status(401).json({ ok: false, error: 'Invalid or expired token' });
  }
}

