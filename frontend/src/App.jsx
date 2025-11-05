import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Newsletter from "./components/Newsletter";
import AddToCartModal from "./components/AddToCartModal";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Payment from "./pages/Payment";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { LanguageProvider } from "./context/LanguageContext";
import Profile from "./pages/Profile";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Contact from "./pages/Contact";
import Soutenir from "./pages/Soutenir";
import Mentions from "./pages/Mentions";
import CGV from "./pages/CGV";

function App() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <div className="App">
            <Navbar />
            <main className={`app-main${isHome ? " home" : ""}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/soutenir" element={<Soutenir />} />
            <Route path="/mentions" element={<Mentions />} />
            <Route path="/cgv" element={<CGV />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/payment/:orderId" element={<Payment />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<div>Page introuvable</div>} />
          </Routes>
          </main>
    <Newsletter />
    <AddToCartModal />
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
