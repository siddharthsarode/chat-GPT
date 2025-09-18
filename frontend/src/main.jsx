import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthContextProvider } from "./contexts/auth.context";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { SocketProvider } from "./contexts/socket.context";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <SocketProvider>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </SocketProvider>
    </Provider>
  </StrictMode>
);
