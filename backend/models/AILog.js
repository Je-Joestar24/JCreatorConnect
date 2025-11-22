import mongoose from 'mongoose';

const aiLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    prompt: {
      type: String,
      required: [true, 'AI prompt is required'],
      maxlength: [2000, 'Prompt cannot exceed 2000 characters'],
    },
    response: {
      type: String,
      required: [true, 'AI response is required'],
    },
    purpose: {
      type: String,
      enum: [
        'idea_generation',
        'rewrite',
        'description',
        'summarize',
        'title_generation',
        'tag_generation',
        'search',
        'recommendation',
        'other',
      ],
      default: 'other',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
aiLogSchema.index({ userId: 1, createdAt: -1 });
aiLogSchema.index({ purpose: 1 });
aiLogSchema.index({ createdAt: -1 });

export default mongoose.model('AILog', aiLogSchema);

