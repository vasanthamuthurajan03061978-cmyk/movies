import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="header">
      <Link to="/" className="logo">
        <span className="logo-icon">🎬</span>
        <span>Movie Explorer</span>
      </Link>

      <nav>
        <Link to="/">Home</Link>
      </nav>
    </header>
  );
}

export default Header;