import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import config from "../config/env";

// Determine if in development mode (fallback if not exported)
const isDevelopment =
  typeof import.meta !== "undefined" && import.meta.env && import.meta.env.DEV
    ? import.meta.env.DEV
    : process.env.NODE_ENV === "development";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Get API base URL from config
    const API_BASE_URL = config.apiBaseUrl;
    
    // Check if we should connect to Socket.io
    // Prevent connection if:
    // - In production mode AND API URL is localhost (prevents browser local network permission popup)
    const isLocalhost = API_BASE_URL.includes('localhost') || API_BASE_URL.includes('127.0.0.1');
    const shouldConnect = isDevelopment || !isLocalhost;
    
    if (!shouldConnect) {
      // Don't connect in production when API URL is localhost
      if (isDevelopment) {
        console.log("Socket.io connection skipped: Production mode with localhost API URL");
      }
      return;
    }
    
    // Create socket connection
    const newSocket = io(API_BASE_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    newSocket.on("connect", () => {
      if (isDevelopment) {
        console.log("Socket connected:", newSocket.id);
      }
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      if (isDevelopment) {
        console.log("Socket disconnected");
      }
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      if (isDevelopment) {
        console.error("Socket connection error:", error);
      }
      setIsConnected(false);
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

