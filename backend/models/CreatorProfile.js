import mongoose from 'mongoose';

const creatorProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    bannerUrl: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      maxlength: [1000, 'Bio cannot exceed 1000 characters'],
      default: '',
    },
    categories: {
      type: [String],
      default: [],
    },
    socials: {
      instagram: {
        type: String,
        default: '',
      },
      youtube: {
        type: String,
        default: '',
      },
      website: {
        type: String,
        default: '',
      },
      twitter: {
        type: String,
        default: '',
      },
    },
    earningsTotal: {
      type: Number,
      default: 0,
      min: 0,
    },
    supportersCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    featuredPostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      default: null,
    },
    membershipTiers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'MembershipTier',
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
creatorProfileSchema.index({ userId: 1 });
creatorProfileSchema.index({ categories: 1 });

// Virtual for posts created by this creator
creatorProfileSchema.virtual('posts', {
  ref: 'Post',
  localField: 'userId',
  foreignField: 'creatorId',
});

// Virtual for supports received
creatorProfileSchema.virtual('supportsReceived', {
  ref: 'Support',
  localField: 'userId',
  foreignField: 'creatorId',
});

export default mongoose.model('CreatorProfile', creatorProfileSchema);

