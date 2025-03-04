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
    if (authUser) {
      const newSocket = io(`${import.meta.env.VITE_BACKEND_URL}`, {
        query: {
          userId: "67c73358d006c41a7379cfa7" || authUser?._id,
        },
      });
      newSocket.on("connect", () => {
        console.log("Connected:", newSocket.id);
      });
      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
      return;
    }
  
  }, [authUser]);
  

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};