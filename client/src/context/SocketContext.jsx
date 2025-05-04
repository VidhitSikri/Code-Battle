import React, { createContext, useEffect } from "react";
import { io } from 'socket.io-client';

export const SocketContext = createContext();

const socket = io(`${import.meta.env.VITE_BASE_URL}`);  //SERVER URL

const SocketProvider = ({ children }) => {
    useEffect(() => {
        //basicc connection logic
        socket.on('connect', () => {
            console.log(`connected to the server with id: ${socket.id}`);   
        });

        socket.on('disconnect' , () => {
            console.log('disconnected from the server');
        });

        
    } , []);


    const sendMessage = (eventName, message) => {
        socket.emit(eventName, message);
    };

    const recieveMessage = (eventName , callback) => {
        socket.on(eventName, callback);
    };

    return (
        <SocketContext.Provider value={{ sendMessage,recieveMessage}}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketProvider;