import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Loading from "../components/Loading";

import { API_KEY, API_URL } from "../api";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const [ratingSaved, setRatingSaved] = useState(false);

  useEffect(() => {
    const getMovieDetails = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${API_URL}?apikey=${API_KEY}&i=${id}&plot=full`
        );

        const data = await response.json();

        if (data.Response !== "True") {
          setError(
            data.Error || "Movie details not found."
          );

          setLoading(false);
          return;
        }

        setMovie(data);

        const savedRating = localStorage.getItem(
          `movie-rating-${id}`
        );

        if (savedRating) {
          setUserRating(Number(savedRating));
        }
      } catch {
        setError(
          "Unable to load movie details. Please check your internet connection."
        );
      }

      setLoading(false);
    };

    getMovieDetails();
  }, [id]);

  const saveRating = () => {
    if (userRating === 0) {
      return;
    }

    localStorage.setItem(
      `movie-rating-${id}`,
      userRating
    );

    setRatingSaved(true);

    setTimeout(() => {
      setRatingSaved(false);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="details-loading">
        <Loading text="Loading movie details..." />
      </div>
    );
  }

  if (error) {
    return (
      <main className="details-page">
        <button
          className="back-button"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <div className="error-message">
          ❌ {error}
        </div>
      </main>
    );
  }

  return (
    <main className="details-page">
      <button
        className="back-button"
        onClick={() => navigate(-1)}
      >
        ← Back to Movies
      </button>

      <section className="details-card">
        {/* POSTER */}

        <div className="details-poster">
          {movie.Poster &&
          movie.Poster !== "N/A" ? (
            <img
              src={movie.Poster}
              alt={movie.Title}
            />
          ) : (
            <div className="details-no-poster">
              🎬
              <span>No Poster Available</span>
            </div>
          )}
        </div>

        {/* DETAILS */}

        <div className="details-content">
          <p className="details-type">
            {movie.Type}
          </p>

          <h1>{movie.Title}</h1>

          <p className="details-year">
            {movie.Year}
            {movie.Runtime &&
              ` • ${movie.Runtime}`}
            {movie.Rated &&
              ` • ${movie.Rated}`}
          </p>

          {/* IMDb RATING */}

          <div className="rating-box">
            <div className="rating-box-icon">
              ⭐
            </div>

            <div>
              <span>IMDb Rating</span>

              <strong>
                {movie.imdbRating &&
                movie.imdbRating !== "N/A"
                  ? `${movie.imdbRating} / 10`
                  : "N/A"}
              </strong>
            </div>
          </div>

          {/* USER RATING */}

          <div className="user-rating-box">
            <div className="user-rating-title">
              <div>
                <span className="section-label">
                  YOUR OPINION
                </span>

                <h3>Rate This Movie</h3>
              </div>

              <span className="rating-number">
                {userRating > 0
                  ? `${userRating}/5`
                  : "Not rated"}
              </span>
            </div>

            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={
                    star <=
                    (hoverRating || userRating)
                      ? "star active"
                      : "star"
                  }
                  onClick={() =>
                    setUserRating(star)
                  }
                  onMouseEnter={() =>
                    setHoverRating(star)
                  }
                  onMouseLeave={() =>
                    setHoverRating(0)
                  }
                  aria-label={`Rate ${star} out of 5`}
                >
                  ★
                </button>
              ))}
            </div>

            <p className="rating-help">
              Click a star to give your rating
            </p>

            <button
              className="save-rating-button"
              onClick={saveRating}
              disabled={userRating === 0}
            >
              {ratingSaved
                ? "✓ Rating Saved!"
                : "Save My Rating"}
            </button>
          </div>

          {/* MOVIE INFORMATION */}

          <div className="movie-details-list">
            <div className="detail-item">
              <strong>Genre</strong>
              <span>{movie.Genre || "N/A"}</span>
            </div>

            <div className="detail-item">
              <strong>Director</strong>
              <span>{movie.Director || "N/A"}</span>
            </div>

            <div className="detail-item">
              <strong>Actors</strong>
              <span>{movie.Actors || "N/A"}</span>
            </div>

            <div className="detail-item">
              <strong>Language</strong>
              <span>{movie.Language || "N/A"}</span>
            </div>

            <div className="detail-item">
              <strong>Released</strong>
              <span>{movie.Released || "N/A"}</span>
            </div>

            <div className="detail-item">
              <strong>Country</strong>
              <span>{movie.Country || "N/A"}</span>
            </div>
          </div>

          {/* PLOT */}

          <div className="plot">
            <h3>📖 Plot</h3>

            <p>
              {movie.Plot &&
              movie.Plot !== "N/A"
                ? movie.Plot
                : "Plot information is not available."}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default MovieDetails;