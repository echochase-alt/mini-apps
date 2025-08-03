import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URL);

export const VisitorCounter = () => {
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    socket.on("visitorCount", (count) => {
      setVisitorCount(count);
    });

    return () => {
      socket.off("visitorCount");
    };
  }, []);

  return <div>🟢 {visitorCount} Echo{visitorCount !== 1 ? 'es' : ''} online</div>;
};
