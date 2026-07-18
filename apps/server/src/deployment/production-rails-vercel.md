# Production Deployment Guide (Railway + Vercel)

## Environment Variables

### Railway (Backend)
Set these environment variables in your Railway service:

- `NODE_ENV=production`
- `PORT=4000` (or whatever Railway assigns)
- `MONGODB_URI=...`
- `JWT_SECRET=...` (32+ chars, random)
- `CLIENT_ORIGIN=<your-vercel-domain>`
- `BCRYPT_SALT_ROUNDS=10` (optional)

### Vercel (Frontend)
In Vercel project settings -> Environment Variables:

- `VITE_API_URL=<railway-backend-url>`
- `VITE_SOCKET_URL=<railway-backend-url>` (optional if your app uses VITE_API_URL for sockets)

## CORS Policy
Backend uses `CLIENT_ORIGIN` for both Express CORS and Socket.IO CORS.

## UptimeRobot
1. Create a UptimeRobot monitor for your Railway backend URL.
2. Interval: every 5 minutes.
3. Use an endpoint that returns quickly, e.g.:
   - `GET https://<your-railway>/api/test`

## Notes
- Ensure you set `JWT_SECRET` to a non-default secret.
- Use HTTPS URLs for client/sockets.

