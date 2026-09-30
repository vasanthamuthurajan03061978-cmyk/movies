import React from "react";

function SearchBar({
  movieName,
  setMovieName,
  searchMovies,
  clearSearch,
}) {
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      searchMovies();
    }
  };

  return (
    <div className="search-box">
      <span className="search-icon">🔍</span>

      <input
        type="text"
        placeholder="Search for a movie..."
        value={movieName}
        onChange={(event) => setMovieName(event.target.value)}
        onKeyDown={handleKeyDown}
      />

      {movieName && (
        <button className="clear-button" onClick={clearSearch}>
          ✕
        </button>
      )}

      <button className="search-button" onClick={searchMovies}>
        Search
      </button>
    </div>
  );
}

export default SearchBar;