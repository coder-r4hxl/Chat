import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true, minlength: 2, maxlength: 30 },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true, maxlength: 254 },
    password: {
      type: String,
      required: true,
      minlength: 8
    },
    profilePic: { type: String, default: '' },
    status: {
      type: String,
      enum: ['online', 'offline'],
      default: 'offline'
    },

    // placeholders for future features
    emailVerifiedAt: { type: Date, default: null },
    lastSeenAt: { type: Date, default: null }
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);

    return next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model('User', UserSchema);

