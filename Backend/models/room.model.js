import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
  projectId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  users: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    }
  ],
  content: {
    type: Object, // Store the entire document structure
    default: { blocks: [] }, // Default empty document
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },
});

const Room = mongoose.model("Room", RoomSchema);
export default Room;
