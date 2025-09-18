import { BrowserRouter, Routes, Route } from "react-router-dom";
import Hero from "./components/pages/Hero";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import { ProtectedRoute } from "./components/auth/ProtectedRoutes";
import { GuestRoute } from "./components/auth/GuestRoute";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Hero />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        ></Route>
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
