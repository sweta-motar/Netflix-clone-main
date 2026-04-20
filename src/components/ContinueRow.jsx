import { useEffect, useState } from "react";
import {
  getHistory,
  removeFromHistory,
  getLastWatched
} from "../services/history";
import "./Row.css";

function ContinueRow({ setSelectedMovie }) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const data = await getHistory();

    const last = getLastWatched();

    let finalData = data;

    if (last) {
      const exists = data.find((m) => m.movie_id === last.id);

      if (!exists) {
        finalData = [
          {
            movie_id: last.id,
            title: last.title,
            poster: last.poster_path
          },
          ...data
        ];
      }
    }

    setMovies(finalData);
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
                    ? `https://image.tmdb.org/t/p/w500${movie.poster}`
                    : "https://via.placeholder.com/300x450?text=No+Image"
                }
                alt={movie.title}
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