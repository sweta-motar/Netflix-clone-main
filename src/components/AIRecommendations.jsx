import { useEffect, useState } from "react";
import { getHistory } from "../services/history";
import "./Row.css";

function AIRecommendations({ setSelectedMovie }) {
  const [movies, setMovies] = useState([]);
  const API_KEY = import.meta.env.VITE_APP_TMDB_V3_API_KEY;

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    const history = await getHistory();

    if (!history || history.length === 0) return;

    const lastMovie = history[0];

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${lastMovie.movie_id}/similar?api_key=${API_KEY}`
      );

      const data = await res.json();
      setMovies(data.results || []);
    } catch (err) {
      console.error("AI fetch error:", err);
    }
  };

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
              src={`https://image.tmdb.org/t/p/w200${
                movie.poster_path || movie.backdrop_path
              }`}
              alt={movie.title}
              style={{
                width: "140px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
              // ✅ FIX: SEND CORRECT FORMAT
              onClick={() =>
                setSelectedMovie({
                  ...movie,
                  movie_id: movie.id // 🔥 important
                })
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default AIRecommendations;