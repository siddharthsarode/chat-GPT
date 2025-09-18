import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const socket = io(URL, { withCredentials: true });

    setSocket(socket);

    socket.on("connect", () => {
      console.log("Socket connected", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.disconnect();
      setSocket(null);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);

  if (!context) throw new Error("useSocket must be use withing SocketProvider");

  return context;
};
