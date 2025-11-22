import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    supporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MembershipTier',
      required: true,
    },
    stripeSubscriptionId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['active', 'canceled', 'unpaid', 'past_due'],
      default: 'active',
      required: true,
    },
    renewalDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
subscriptionSchema.index({ supporterId: 1, status: 1 });
subscriptionSchema.index({ creatorId: 1, status: 1 });
subscriptionSchema.index({ tierId: 1 });
subscriptionSchema.index({ stripeSubscriptionId: 1 });
subscriptionSchema.index({ renewalDate: 1 });

// Compound index to prevent duplicate active subscriptions
subscriptionSchema.index(
  { supporterId: 1, creatorId: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: 'active' } }
);

export default mongoose.model('Subscription', subscriptionSchema);

