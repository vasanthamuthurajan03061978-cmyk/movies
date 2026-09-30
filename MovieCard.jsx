import React, { useState } from "react";
import { Link } from "react-router-dom";

function MovieCard({ movie }) {
  const [imageError, setImageError] = useState(false);

  const hasPoster =
    movie.Poster &&
    movie.Poster !== "N/A" &&
    !imageError;

  const savedRating = localStorage.getItem(
    `movie-rating-${movie.imdbID}`
  );

  return (
    <Link
      to={`/movie/${movie.imdbID}`}
      className="movie-card"
    >
      <div className="poster-container">

        {hasPoster ? (
          <img
            src={movie.Poster}
            alt={movie.Title}
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="no-poster">
            <span>🎬</span>
            <strong>{movie.Title}</strong>
            <small>
              Poster not available
            </small>
          </div>
        )}

        <div className="year-badge">
          {movie.Year}
        </div>

      </div>

      <div className="movie-info">

        <h3 title={movie.Title}>
          {movie.Title}
        </h3>

        <p className="movie-type">
          🎭 {movie.Type}
        </p>

        <div className="rating-row">

          <div className="imdb-rating">
            <span>⭐</span>

            <strong>
              {movie.imdbRating &&
              movie.imdbRating !== "N/A"
                ? movie.imdbRating
                : "N/A"}
            </strong>

            <small>IMDb</small>
          </div>

          {savedRating && (
            <div className="user-rating-mini">
              ★ {savedRating}/5
            </div>
          )}

        </div>

      </div>
    </Link>
  );
}

export default MovieCard;