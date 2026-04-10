import { useEffect, useState } from "react";
import { getHistory, removeFromHistory } from "../services/history";
import "./Row.css";

function ContinueRow({ setSelectedMovie }) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    setMovies(getHistory());
  }, []);

  // ❌ REMOVE FUNCTION
  const handleRemove = (movie) => {
    const updated = removeFromHistory(movie);
    setMovies(updated); // ✅ instant UI update
  };

  return (
    <div style={{ marginLeft: "20px" }}>
      <h2>Continue Watching</h2>

      <div className="row-scroll">
        {movies.length === 0 ? (
          <p>No history yet</p>
        ) : (
          movies.map((movie) => (
            <div key={movie.id} className="movie-wrapper">

              {/* ❌ REMOVE BUTTON */}
              <span
                className="remove-history"
                onClick={(e) => {
                  e.stopPropagation(); // 🚨 prevent opening trailer
                  handleRemove(movie);
                }}
              >
                ✕
              </span>

              <img
                src={`https://image.tmdb.org/t/p/w300${
                  movie.poster_path || movie.backdrop_path
                }`}
                alt={movie.title}
                className="movie-card"
                onClick={() => setSelectedMovie(movie)}
              />

              <p className="movie-title">{movie.title}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ContinueRow;