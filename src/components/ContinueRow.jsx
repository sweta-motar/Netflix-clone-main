import { useEffect, useState } from "react";
import {
  getHistory,
  removeFromHistory
} from "../services/history";
import "./Row.css";

function ContinueRow({ setSelectedMovie }) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const data = await getHistory();
    setMovies(data || []);
  };

  const handleRemove = async (movie) => {
    await removeFromHistory(movie.movie_id);

    setMovies((prev) =>
      prev.filter((m) => m.movie_id !== movie.movie_id)
    );
  };

  return (
    <div style={{ marginLeft: "20px" }}>
      <h2>Continue Watching</h2>

      <div className="row-scroll">
        {movies.length === 0 ? (
          <p>No history yet</p>
        ) : (
          movies.map((movie) => (
            <div key={movie.movie_id} className="movie-wrapper">

              <span
                className="remove-history"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(movie);
                }}
              >
                ✕
              </span>

              <img
                  src={
                    movie.poster
                      ? `https://image.tmdb.org/t/p/w300${movie.poster}`
                      : "https://via.placeholder.com/300x450?text=No+Image"
                  }
                  className="movie-card"
                  onClick={() =>
                    setSelectedMovie({
                      id: movie.movie_id,
                      title: movie.title,
                      poster_path: movie.poster
                    })
                  }
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