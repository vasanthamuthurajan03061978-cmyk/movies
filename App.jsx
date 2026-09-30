import React from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";

function App() {
  return (
    <div className="app">
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
      </Routes>

      <footer>
        <div className="footer-content">
          <h3>🎬 Movie Explorer</h3>
          <p>
            Discover movies, check IMDb ratings and share your own ratings.
          </p>
          <span>Powered by OMDb API</span>
        </div>
      </footer>
    </div>
  );
}

export default App;