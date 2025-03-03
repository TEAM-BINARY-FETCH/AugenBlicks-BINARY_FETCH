import mongoose from "mongoose";

const VersionHistorySchema = new mongoose.Schema(
  {
    document: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
    },
    version_number: { type: Number, required: true ,default: 0},
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("VersionHistory", VersionHistorySchema);
