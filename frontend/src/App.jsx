import "./App.css";
import Navbar from "./components/Navbar";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "./context/AuthContext";
import Profile from "./pages/Profile";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Navbar />
        <main style={{ padding: "2rem" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<div>Page introuvable</div>} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
