import React, { useEffect, useState } from "react";

import SearchBar from "../components/SearchBar";
import MovieCard from "../components/MovieCard";
import Loading from "../components/Loading";

import { API_KEY, API_URL } from "../api";

const TOP_MOVIES = [
  "Inception",
  "Interstellar",
  "The Dark Knight",
  "Avengers Endgame",
  "Titanic",
  "The Matrix",
  "Gladiator",
  "Jurassic Park",
  "Spider-Man",
  "The Lion King",
];

const SPELLING_CORRECTIONS = {
  avngers: "Avengers",
  avenger: "Avengers",
  spidarman: "Spider-Man",
  spiderman: "Spider-Man",
  spidermanhomecoming: "Spider-Man: Homecoming",
  interstelar: "Interstellar",
  intersteller: "Interstellar",
  inceptionn: "Inception",
  titanicc: "Titanic",
  jurasicpark: "Jurassic Park",
  jurassicparkk: "Jurassic Park",
  batman: "The Dark Knight",
  darknight: "The Dark Knight",
  matrixx: "The Matrix",
  gladiatorr: "Gladiator",
  lionking: "The Lion King",
  ironman: "Iron Man",
  superman: "Superman",
  transformerss: "Transformers",
};

function Home() {
  const [movieName, setMovieName] = useState("");
  const [movies, setMovies] = useState([]);
  const [topMovies, setTopMovies] = useState([]);

  const [loading, setLoading] = useState(false);
  const [topLoading, setTopLoading] = useState(true);

  const [error, setError] = useState("");
  const [category, setCategory] = useState("All");

  const [hasSearched, setHasSearched] = useState(false);

  const getMovieDetails = async (movie) => {
    try {
      const response = await fetch(
        `${API_URL}?apikey=${API_KEY}&i=${movie.imdbID}`
      );

      const data = await response.json();

      return {
        ...movie,
        imdbRating: data.imdbRating,
        genre: data.Genre,
      };
    } catch {
      return movie;
    }
  };

  const loadTopMovies = async () => {
    setTopLoading(true);

    try {
      const results = await Promise.all(
        TOP_MOVIES.map(async (title) => {
          try {
            const response = await fetch(
              `${API_URL}?apikey=${API_KEY}&t=${encodeURIComponent(
                title
              )}&plot=short`
            );

            const data = await response.json();

            if (data.Response === "True") {
              return {
                imdbID: data.imdbID,
                Title: data.Title,
                Year: data.Year,
                Poster: data.Poster,
                Type: data.Type,
                imdbRating: data.imdbRating,
                genre: data.Genre,
              };
            }

            return null;
          } catch {
            return null;
          }
        })
      );

      setTopMovies(results.filter(Boolean));
    } catch {
      setTopMovies([]);
    }

    setTopLoading(false);
  };

  const searchMovies = async () => {
    const originalText = movieName.trim();

    if (!originalText) {
      setError("Please enter a movie name.");
      setMovies([]);
      setHasSearched(true);
      return;
    }

    setLoading(true);
    setError("");
    setHasSearched(true);
    setCategory("All");

    let searchText = originalText;

    const cleanedText = originalText
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

    if (SPELLING_CORRECTIONS[cleanedText]) {
      searchText = SPELLING_CORRECTIONS[cleanedText];
    }

    try {
      let response = await fetch(
        `${API_URL}?apikey=${API_KEY}&s=${encodeURIComponent(
          searchText
        )}&type=movie`
      );

      let data = await response.json();

      /*
        If the corrected search still fails,
        try the original search text.
      */
      if (
        data.Response !== "True" &&
        searchText !== originalText
      ) {
        response = await fetch(
          `${API_URL}?apikey=${API_KEY}&s=${encodeURIComponent(
            originalText
          )}&type=movie`
        );

        data = await response.json();
      }

      if (data.Response !== "True") {
        setMovies([]);
        setError(
          `No movies found for "${originalText}". Try another movie name.`
        );

        setLoading(false);
        return;
      }

      const details = await Promise.all(
        data.Search.slice(0, 10).map((movie) =>
          getMovieDetails(movie)
        )
      );

      setMovies(details);
    } catch {
      setMovies([]);
      setError(
        "Unable to connect to the movie service. Please check your internet connection."
      );
    }

    setLoading(false);
  };

  const clearSearch = () => {
    setMovieName("");
    setMovies([]);
    setError("");
    setHasSearched(false);
    setCategory("All");
  };

  useEffect(() => {
    loadTopMovies();
  }, []);

  const filteredMovies =
    category === "All"
      ? movies
      : movies.filter((movie) =>
          movie.genre
            ?.toLowerCase()
            .includes(category.toLowerCase())
        );

  const categories = [
    "All",
    "Action",
    "Comedy",
    "Drama",
    "Romance",
    "Horror",
    "Thriller",
    "Adventure",
    "Animation",
    "Sci-Fi",
  ];

  return (
    <main>
      {/* HERO */}

      <section className="hero">
        <div className="hero-background-circle circle-one"></div>
        <div className="hero-background-circle circle-two"></div>

        <div className="hero-content">
          <div className="hero-icon">🎬</div>

          <p className="small-title">
            WELCOME TO MOVIE EXPLORER
          </p>

          <h1>
            Discover Your
            <span>Next Favorite Movie</span>
          </h1>

          <p className="hero-text">
            Search for movies, explore ratings, discover
            genres and share your own star rating.
          </p>

          <SearchBar
            movieName={movieName}
            setMovieName={setMovieName}
            searchMovies={searchMovies}
            clearSearch={clearSearch}
          />
        </div>
      </section>

      {/* SEARCH RESULT AREA */}

      {hasSearched ? (
        <>
          <section className="category-section">
            <div className="section-top">
              <div>
                <p className="section-label">
                  EXPLORE BY GENRE
                </p>

                <h2>Categories</h2>
              </div>

              <button
                className="show-top-button"
                onClick={clearSearch}
              >
                ⭐ Show Top Movies
              </button>
            </div>

            <div className="category-buttons">
              {categories.map((item) => (
                <button
                  key={item}
                  className={
                    category === item
                      ? "category-button active"
                      : "category-button"
                  }
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </section>

          {loading && (
            <Loading text="Searching for movies..." />
          )}

          {!loading && error && (
            <div className="error-message">
              <div className="error-icon">🔍</div>
              <h3>No movie found</h3>
              <p>{error}</p>
            </div>
          )}

          {!loading &&
            !error &&
            filteredMovies.length > 0 && (
              <section className="movies-section">
                <div className="section-heading">
                  <div>
                    <p className="section-label">
                      SEARCH RESULTS
                    </p>

                    <h2>Movies Found 🎥</h2>
                  </div>

                  <span className="movie-count">
                    {filteredMovies.length} Movies
                  </span>
                </div>

                <div className="movie-grid">
                  {filteredMovies.map((movie) => (
                    <MovieCard
                      key={movie.imdbID}
                      movie={movie}
                    />
                  ))}
                </div>
              </section>
            )}

          {!loading &&
            !error &&
            filteredMovies.length === 0 && (
              <div className="no-results">
                <div>🎞️</div>
                <h2>No movies in this category</h2>
                <p>
                  Try another category or search for another movie.
                </p>
              </div>
            )}
        </>
      ) : (
        /* TOP MOVIES */

        <section className="movies-section top-movies-section">
          <div className="section-heading">
            <div>
              <p className="section-label">
                POPULAR COLLECTION
              </p>

              <h2>⭐ Top Movies</h2>

              <p className="section-description">
                Explore some popular movies to get started.
              </p>
            </div>

            <span className="movie-count">
              {topMovies.length} Movies
            </span>
          </div>

          {topLoading ? (
            <Loading text="Loading top movies..." />
          ) : topMovies.length > 0 ? (
            <div className="movie-grid">
              {topMovies.map((movie) => (
                <MovieCard
                  key={movie.imdbID}
                  movie={movie}
                />
              ))}
            </div>
          ) : (
            <div className="error-message">
              Unable to load top movies.
            </div>
          )}
        </section>
      )}
    </main>
  );
}

export default Home;