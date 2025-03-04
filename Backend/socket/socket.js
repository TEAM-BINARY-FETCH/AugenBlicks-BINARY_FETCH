import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import User from "../models/user.model.js";

export const app = express();
export const server = createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

const userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User connected:", socket.id, userId);
  userSocketMap[socket.id] = userId;

  // Handle project join event
  socket.on("projectJoin", async ({ projectId, socketId, userId, name }) => {
    console.log("User joined project:", projectId, userId);
    socket.join(projectId);

    const users = await User.find();
    const clients = Array.from(io.sockets.adapter.rooms.get(projectId)).map(
      (socketId) => {
        return {
          userId: userSocketMap[socketId],
          socketId,
          username:
            users.find((user) => user._id == userSocketMap[socketId])?.name ||
            "Unknown",
        };
      }
    );

    // Notify all clients in the project room
    clients.forEach((client) => {
      io.to(client.socketId).emit("projectJoined", {
        userId,
        clients,
        socketId: client.socketId,
        name,
      });
    });
  });

  // Handle content change event
  socket.on("contentChange", ({ text, doc, project, userId }) => {
    console.log("Content changed:", text);
    io.to(project._id).emit("onchangefromOther", { text, doc, project, userId });
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    delete userSocketMap[socket.id];
  });
});