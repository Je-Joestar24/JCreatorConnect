import mongoose from 'mongoose';

const supportSchema = new mongoose.Schema(
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
    amount: {
      type: Number,
      required: [true, 'Support amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    message: {
      type: String,
      maxlength: [500, 'Message cannot exceed 500 characters'],
      default: '',
    },
    accessExpiry: {
      type: Date,
      default: null,
      // Optional: for time-limited access to supporter-only content
    },
    stripePaymentId: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
supportSchema.index({ supporterId: 1, createdAt: -1 });
supportSchema.index({ creatorId: 1, createdAt: -1 });
supportSchema.index({ stripePaymentId: 1 });

// Compound index for unique supporter-creator pairs (optional, if you want to prevent duplicate supports)
// supportSchema.index({ supporterId: 1, creatorId: 1 });

export default mongoose.model('Support', supportSchema);

