import mongoose from 'mongoose'

const portfolioSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    template: {
      type: String,
      required: true,
      trim: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({}),
    },
    design: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({}),
    },
    photo: {
      type: String,
      default: '',
    },
  },
  { timestamps: true },
)

/**
 * Returns full portfolio details including data, design, and photo.
 */
portfolioSchema.methods.toSafeJSON = function toSafeJSON() {
  return {
    id: this._id,
    owner: this.owner,
    title: this.title,
    template: this.template,
    data: this.data || {},
    design: this.design || {},
    photo: this.photo || '',
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  }
}

/**
 * Lightweight summary for list views (excludes heavy base64 photo).
 */
portfolioSchema.methods.toSummaryJSON = function toSummaryJSON() {
  return {
    id: this._id,
    title: this.title,
    template: this.template,
    preview: {
      name: this.data?.profile?.name || this.data?.name || '',
      headline: this.data?.profile?.headline || this.data?.headline || '',
    },
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  }
}

export const Portfolio = mongoose.model('Portfolio', portfolioSchema)
