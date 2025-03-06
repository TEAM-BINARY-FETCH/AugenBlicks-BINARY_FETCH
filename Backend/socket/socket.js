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
  // console.log('socket connected', socket.handshake);
  console.log("a user connected", socket.id,userId);
  userSocketMap[socket.id] = userId;

  socket.on("projectJoin", async ({ projectId, socketId, userId }) => {
    console.log("user joined", socketId, projectId, userId);
    socket.join(projectId);
    // console.log("users : ", users);
    const users = await User.find();
    console.log("Users in project:", users);
    const clients = Array.from(io.sockets.adapter.rooms.get(projectId)).map(
      (socketId) => {
        const user = users.find((user) => user._id == userSocketMap[socketId]);
        console.log("User in project:", user);
        return {
          userId: userSocketMap[socketId],
          socketId,
          username: user?.name || "Unknown",
          profilePic: user?.profilePic || "default-profile.png",
        };
      }
    );
    // console.log("clients : ",clients);

    clients.forEach((client) => {
      io.to(client.socketId).emit("projectJoined", {
        userId,
        clients,
        socketId: client.socketId,
        username:
          users.find((user) => user._id == userId)?.name || "Unknown",
      });
    });
  });

  socket.on("contentChange", ({ text, doc, project, userId }) => {
    // console.log("content change", content);
    // console.log("currentDocument",currentDocument);
    // console.log("currentProject",currentProject);
    console.log("content changed ", text);

    io.to(project?._id).emit("onchangefromOther", {
      text,
      doc,
      project,
      userId,
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});