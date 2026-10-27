import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import Products from "./Pages/Products";
import Categories from "./Pages/Categories";
import Wishlist from "./Pages/Wishlist";
import Cart from "./Pages/Cart";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import BuyNow from "./Pages/BuyNow";
import Footer from "./Components/Footer";

import "./App.css";

function AppContent() {
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("isLoggedIn") === "true"
  );

  useEffect(() => {
    const checkLogin = () => {
      setIsLoggedIn(
        localStorage.getItem("isLoggedIn") === "true"
      );
    };

    window.addEventListener("storage", checkLogin);
    window.addEventListener("loginStatusChanged", checkLogin);

    return () => {
      window.removeEventListener("storage", checkLogin);
      window.removeEventListener("loginStatusChanged", checkLogin);
    };
  }, []);

  const hideLayout =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <>
      {!hideLayout && isLoggedIn && <Navbar />}

      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/home" replace />
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/home" replace />
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/register"
          element={
            isLoggedIn ? (
              <Navigate to="/home" replace />
            ) : (
              <Register />
            )
          }
        />

        <Route
          path="/home"
          element={
            isLoggedIn ? (
              <Home />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/products"
          element={
            isLoggedIn ? (
              <Products />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/categories"
          element={
            isLoggedIn ? (
              <Categories />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/wishlist"
          element={
            isLoggedIn ? (
              <Wishlist />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/cart"
          element={
            isLoggedIn ? (
              <Cart />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/buynow"
          element={
            isLoggedIn ? (
              <BuyNow />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to={isLoggedIn ? "/home" : "/login"}
              replace
            />
          }
        />
      </Routes>

      {!hideLayout && isLoggedIn && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;