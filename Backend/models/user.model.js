import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "editor", "viewer"], default: "editor" },
    favouriteProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],default: [],
    profilePic: { type: String, default: "" },
  },
  { timestamps: true } 
);

export default mongoose.model("User", UserSchema);
