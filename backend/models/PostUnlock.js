import mongoose from 'mongoose';

const postUnlockSchema = new mongoose.Schema(
  {
    supporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    hasAccess: {
      type: Boolean,
      default: true,
      required: true,
    },
    unlockedBy: {
      type: String,
      enum: ['payment', 'membership'],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
postUnlockSchema.index({ supporterId: 1, postId: 1 });
postUnlockSchema.index({ creatorId: 1 });
postUnlockSchema.index({ hasAccess: 1 });

// Compound unique index to prevent duplicate unlocks
postUnlockSchema.index(
  { supporterId: 1, postId: 1 },
  { unique: true }
);

export default mongoose.model('PostUnlock', postUnlockSchema);

