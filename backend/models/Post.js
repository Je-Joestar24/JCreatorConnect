import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Post title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    type: {
      type: String,
      enum: ['text', 'image', 'videoEmbed', 'link'],
      required: true,
      default: 'text',
    },
    content: {
      type: String,
      required: [true, 'Post content is required'],
      maxlength: [5000, 'Content cannot exceed 5000 characters'],
    },
    mediaUrl: {
      type: String,
      default: '',
      // Only used when type is 'image'
    },
    videoEmbedUrl: {
      type: String,
      default: '',
      // Only used when type is 'videoEmbed' (YouTube/Vimeo)
    },
    linkUrl: {
      type: String,
      default: '',
      // Only used when type is 'link'
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    accessType: {
      type: String,
      enum: ['free', 'supporter-only', 'membership-only'],
      default: 'free',
      required: true,
    },
    membershipTierRequired: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MembershipTier',
      default: null,
      // Only used when accessType is 'membership-only'
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
postSchema.index({ creatorId: 1, createdAt: -1 });
postSchema.index({ accessType: 1 });
postSchema.index({ isLocked: 1 });
postSchema.index({ membershipTierRequired: 1 });

// Virtual for post unlocks
postSchema.virtual('unlocks', {
  ref: 'PostUnlock',
  localField: '_id',
  foreignField: 'postId',
});

export default mongoose.model('Post', postSchema);

