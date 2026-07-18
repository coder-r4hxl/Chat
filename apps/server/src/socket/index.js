import { Server } from 'socket.io';

const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

export function initSocket(httpServer, { getUserIdFromSocket } = {}) {

  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_ORIGIN,
      credentials: true
    }
  });

  // Presence mapping: userId -> socket.id
  const userIdToSocketId = new Map();

  const broadcastOnlineUsers = () => {
    io.emit('getOnlineUsers', Array.from(userIdToSocketId.keys()));
  };

  io.on('connection', (socket) => {
    console.log('[socket] connected', socket.id);

    let userId;
    try {
      if (typeof getUserIdFromSocket === 'function') {
        userId = getUserIdFromSocket(socket);
      }
    } catch {
      // ignore, treated as unauthenticated
    }

    if (userId) {
      userIdToSocketId.set(String(userId), socket.id);
      socket.data.userId = String(userId);
      broadcastOnlineUsers();
    }

    socket.on('typing-start', (payload) => {
      const fromId = socket.data.userId;
      const toId = payload?.toUserId;
      if (!fromId || !toId || typeof toId !== 'string') return;
      const recipientSocketId = userIdToSocketId.get(String(toId));
      if (!recipientSocketId) return;
      io.to(recipientSocketId).emit('typing-start', { fromUserId: fromId, toUserId: String(toId) });
    });

    socket.on('typing-stop', (payload) => {
      const fromId = socket.data.userId;
      const toId = payload?.toUserId;
      if (!fromId || !toId || typeof toId !== 'string') return;
      const recipientSocketId = userIdToSocketId.get(String(toId));
      if (!recipientSocketId) return;
      io.to(recipientSocketId).emit('typing-stop', { fromUserId: fromId, toUserId: String(toId) });
    });

    socket.on('bot-command', async (payload) => {
      const fromId = socket.data.userId;
      const rawText = payload?.messageText;
      const toUserId = payload?.toUserId;

      if (!fromId || typeof rawText !== 'string' || !toUserId) return;

      const cmd = rawText.trim();
      if (!cmd.startsWith('/')) return;

      const lower = cmd.toLowerCase();
      let response = null;

      try {
        if (lower.startsWith('/quote')) {
          const r = await fetch('https://api.quotable.io/random');
          const data = await r.json();
          const quote = data?.content;
          const author = data?.author;
          response = author ? `“${quote}” — ${author}` : `“${quote}”`;
        } else if (lower.startsWith('/weather')) {
          const parts = cmd.split(/\s+/);
          const city = parts.slice(1).join(' ');
          if (!city) {
            response = 'Usage: /weather <city>';
          } else {
            if (!WEATHER_API_KEY) {
              response = 'Weather service not configured (OPENWEATHER_API_KEY missing).';
            } else {
              const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${encodeURIComponent(WEATHER_API_KEY)}&units=metric`;
              const r = await fetch(url);
              const data = await r.json();
              if (data?.cod !== 200) {
                response = `Could not fetch weather for “${city}”.`;
              } else {
                const temp = data?.main?.temp;
                const desc = data?.weather?.[0]?.description;
                response = `Weather in ${city}: ${temp}°C, ${desc}.`;
              }
            }
          }
        }
      } catch (e) {
        response = 'Bot is having trouble right now. Try again in a moment.';
      }

      if (!response) return;

      const recipientSocketId = userIdToSocketId.get(String(toUserId));
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('newMessage', {
          messageData: {
            id: `bot_${Date.now()}`,
            senderId: 'bot',
            receiverId: String(toUserId),
            messageText: response,
            mediaUrl: '',
            createdAt: new Date().toISOString()
          }
        });
      }
    });

    socket.on('disconnect', () => {

      const uid = socket.data.userId;
      if (uid) userIdToSocketId.delete(String(uid));
      console.log('[socket] disconnected', socket.id, uid ?? 'unknown');
      broadcastOnlineUsers();
    });
  });

  return { io, userIdToSocketId };
}


