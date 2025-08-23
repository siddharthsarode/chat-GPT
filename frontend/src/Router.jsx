import { BrowserRouter, Routes, Route } from "react-router-dom";
import Hero from "./components/pages/Hero";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Hero />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
