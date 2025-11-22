import mongoose from 'mongoose';

const membershipTierSchema = new mongoose.Schema(
  {
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Tier title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Tier description is required'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Monthly price is required'],
      min: [0.01, 'Price must be greater than 0'],
    },
    benefits: {
      type: [String],
      default: [],
      // Array of perks/benefits for this tier
    },
    stripePriceId: {
      type: String,
      default: '',
      // Stripe Price ID for recurring billing
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
membershipTierSchema.index({ creatorId: 1, createdAt: -1 });
membershipTierSchema.index({ stripePriceId: 1 });

// Virtual for subscriptions to this tier
membershipTierSchema.virtual('subscriptions', {
  ref: 'Subscription',
  localField: '_id',
  foreignField: 'tierId',
});

export default mongoose.model('MembershipTier', membershipTierSchema);

