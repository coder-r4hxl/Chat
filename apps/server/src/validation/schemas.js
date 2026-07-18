import { z } from 'zod';

export const signupSchema = z.object({
  username: z.string().min(2).max(30).trim(),
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(8)
});

export const loginSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(1)
});

export const sendMessageSchema = z.object({
  messageText: z.string().max(2000).optional().default(''),
  mediaUrl: z.string().url().optional().default('')
});

export const typingPayloadSchema = z.object({
  toUserId: z.string().min(1)
});

export const userIdQuerySchema = z.object({
  with: z.string().min(1)
});

