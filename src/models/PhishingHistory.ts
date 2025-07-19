import mongoose from "mongoose";

const PhishingHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    isPhishing: {
      type: Boolean,
      required: true,
    },
    confidence: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const PhishingHistory =
  mongoose.models.PhishingHistory ||
  mongoose.model("PhishingHistory", PhishingHistorySchema);
