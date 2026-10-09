import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import Products from "./Pages/Products";
import Categories from "./Pages/Categories";
import Wishlist from "./Pages/Wishlist";
import Cart from "./Pages/Cart";
import Login from "./Pages/Login";
import Register from "./Pages/Register";

import Footer from "./Components/Footer";

import "./App.css";

function AppContent() {

  const location = useLocation();

  const isLoggedIn =
    localStorage.getItem("isLoggedIn") === "true";

  const hideLayout =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <>
      {/* Navbar */}
      {!hideLayout && isLoggedIn && <Navbar />}

      <Routes>

        {/* First page = Login */}
        <Route
          path="/"
          element={<Login />}
        />

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Register */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* Home */}
        <Route
          path="/home"
          element={
            isLoggedIn ? (
              <Home />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Products */}
        <Route
          path="/products"
          element={
            isLoggedIn ? (
              <Products />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Categories */}
        <Route
          path="/categories"
          element={
            isLoggedIn ? (
              <Categories />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Wishlist */}
        <Route
          path="/wishlist"
          element={
            isLoggedIn ? (
              <Wishlist />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Cart */}
        <Route
          path="/cart"
          element={
            isLoggedIn ? (
              <Cart />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Unknown page */}
        <Route
          path="*"
          element={<Navigate to="/" />}
        />

      </Routes>

      {/* Footer */}
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
