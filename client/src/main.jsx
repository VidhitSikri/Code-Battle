import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import SocketProvider from "./context/SocketContext.jsx";
import UserContext from "./context/UserContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SocketProvider>
      <UserContext>
        <App />
      </UserContext>
    </SocketProvider>
  </React.StrictMode>
);
