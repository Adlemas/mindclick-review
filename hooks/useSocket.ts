import { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import { useAppSelector } from "slices";
import handleAxiosError from "utils/handleAxiosError";
import { getItemFromLocal } from "utils/localStorage";

const baseWebSocketURL = process.env.NEXT_PUBLIC_WEBSOCKET_URL;

const useSocket = () => {
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

    const [socket, setSocket] = useState<Socket | null>(null);

    const getWebSocketToken = (): string => {
        const token = getItemFromLocal("token");
        if (!token) {
            throw new Error("No token found");
        }
        return token;
    }

    useEffect(() => {
        console.log('want to connect to socket', baseWebSocketURL, { isAuthenticated })
        const createSocket = async () => {
            try {
                const token = getWebSocketToken();
                const socket = io(baseWebSocketURL, {
                    transports: ["websocket"],
                    upgrade: false,
                    auth: {
                        token: token,
                    },
                });
                setSocket(socket);
            } catch (error: any) {
                handleAxiosError(error);
            }
        };

        if (isAuthenticated) {
            createSocket();
        }

        return () => {
            socket?.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);

    return socket;
};

export default useSocket;
