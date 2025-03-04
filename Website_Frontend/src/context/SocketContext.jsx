import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuthContext } from "./AuthContext";

export const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { authUser } = useAuthContext();

  useEffect(() => {
    if (!authUser) {
      if (socket) {
        socket.close();
        setSocket(null);
      }
      return;
    }
    console.log("Connecting to socket server...",authUser);
    const newSocket = io(import.meta.env.VITE_BACKEND_URL, {
      query: {
        userId: authUser._id,
      },
    });
  
    newSocket.on("connect", () => {
      console.log("Connected:", newSocket.id);
    });
  
    setSocket(newSocket);
  
    return () => {
      console.log("Socket disconnected:", newSocket.id);
      newSocket.close();
    };
  
  }, [authUser]);
  

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
