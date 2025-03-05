import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    title: { type: String, required: true },
    content: { type: String, default: "" },
    history: [{ type: mongoose.Schema.Types.ObjectId, ref: "VersionHistory" }],
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Document", DocumentSchema);
