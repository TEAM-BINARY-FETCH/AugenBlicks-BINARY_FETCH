import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

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
  console.log("a user connected", socket.id);

  socket.on("join", ({ socketId, projectId ,userId}) => {
    console.log("user joined", socketId, projectId,userId);
    userSocketMap[socketId] = userId;
    
    socket.join(projectId);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  }); 

});
