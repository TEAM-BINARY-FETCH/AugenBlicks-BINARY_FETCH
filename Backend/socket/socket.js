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
  // console.log("a user connected", socket.id,userId);
  userSocketMap[socket.id] = userId;

  socket.on("projectJoin", async ({ projectId, socketId, userId,name }) => {
    console.log("user joined", socketId, projectId, userId);
    socket.join(projectId);
    const users = await User.find();
    // console.log("users : ", users);
    // console.log("userSocketMap : ", userSocketMap);
    // console.log("users : ", users);
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
    console.log("clients : ",clients);

    clients.forEach((client) => {
      io.to(client.socketId).emit("projectJoined", {
        userId,
        clients,
        socketId: client.socketId,
        name,
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