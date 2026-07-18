# Real-Time Chat System (MERN + Socket.io) - TODO

## Phase 0: Repo scaffolding
- [ ] Create monorepo structure: `apps/server`, `apps/client` (or single root with both)
- [ ] Add root scripts (optional) and `.env.example` for both apps

## Phase 1: Database & schema design
- [x] Create MongoDB collections + indexes (Users, Messages)
- [x] Implement Mongoose models: User, Message
- [ ] Verify MongoDB Atlas connection using `GET /api/test` (Postman)

## Phase 2: Backend API & Auth development
- [x] Scaffold Express server with CORS + JSON middleware
- [x] Implement Auth routes: `POST /api/auth/signup`, `POST /api/auth/login`
- [x] Implement User routes: `GET /api/users/me`, `GET /api/users/contacts`
- [ ] Implement Message routes: `GET /api/messages/:id`, `POST /api/messages/:id/send`
- [x] Implement JWT middleware to protect routes
- [x] Add centralized error handling + input sanitization

## Phase 3: Real-Time logic (Socket.io)
- [ ] Initialize Socket.io with JWT handshake/auth
- [ ] Track `onlineUsers` (userId -> socketId) + emit `getOnlineUsers`
- [ ] Implement `newMessage` listener: persist + emit to recipient

## Phase 4: Frontend development
- [ ] Scaffold React (Vite) + TailwindCSS + DaisyUI
- [ ] Install axios, socket.io-client, zustand, react-router-dom
- [ ] Implement Zustand stores: `useAuthStore`, `useChatStore`
- [ ] Implement Sidebar (online/offline)
- [ ] Implement ChatWindow (auto-scroll)
- [ ] Implement MessageInput with typing indicator
- [ ] Implement Dark Mode toggle (DaisyUI)

## Phase 5: Security & error handling
- [ ] Add frontend Error Boundary
- [ ] Sanitize inputs server-side; validate request bodies
- [ ] Ensure secure cookie/token handling patterns

## Phase 6: Deployment prep
- [ ] Add production-ready build configs
- [ ] Prepare Vercel env vars (`VITE_API_URL`)
- [ ] Prepare Railway env vars (Mongo connection string, JWT secret)
- [ ] Document UptimeRobot setup (ping every 5 minutes)

## Phase 7: Testing
- [ ] Basic backend tests (auth + message endpoints)
- [ ] Manual end-to-end test checklist
- [ ] Socket.io event test checklist

