import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    messageText: { type: String, default: '', trim: true, maxlength: 2000 },
    mediaUrl: { type: String, default: '' }
  },
  { timestamps: true }
);

// Explicit indexing to ensure optimized retrieval.
MessageSchema.index({ senderId: 1, createdAt: -1 });
MessageSchema.index({ receiverId: 1, createdAt: -1 });

export const Message = mongoose.model('Message', MessageSchema);

