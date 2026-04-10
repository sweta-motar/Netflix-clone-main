import { useEffect, useState } from "react";
import { getHistory } from "../services/history";
import "./Row.css";

function AIRecommendations({ setSelectedMovie }) {
  const [movies, setMovies] = useState([]);
  const API_KEY = import.meta.env.VITE_APP_TMDB_V3_API_KEY;

  useEffect(() => {
    const history = getHistory();

    if (history.length === 0) return;

    // 🎯 Pick last watched movie
    const lastMovie = history[0];

    fetch(
      `https://api.themoviedb.org/3/movie/${lastMovie.id}/similar?api_key=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.results || []);
      });
  }, []);

  if (movies.length === 0) return null;

 return (
  <div style={{ marginLeft: "20px", marginTop: "20px" }}>
    <h2 style={{ fontSize: "18px", color: "#e5e5e5" }}>
      🔥 Recommended For You
    </h2>

    <div className="row-scroll">
      {movies.slice(0, 10).map((movie) => (
        <div key={movie.id} style={{ marginRight: "10px" }}>
          <img
            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
            alt={movie.title}
            style={{
              width: "140px",   // ✅ SMALL SIZE
              borderRadius: "6px",
              transition: "0.3s",
              cursor: "pointer"
            }}
            onClick={() => setSelectedMovie(movie)}
          />
        </div>
      ))}
    </div>
  </div>
);
}

export default AIRecommendations;