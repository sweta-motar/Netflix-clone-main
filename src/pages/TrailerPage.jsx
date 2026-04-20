import { useEffect, useState } from "react";
import { saveWatch } from "../services/history";
import "./TrailerPage.css";

function TrailerPage({ movie, setSelectedMovie }) {
  const [trailerId, setTrailerId] = useState("");
  const [loading, setLoading] = useState(true);

  const API_KEY = import.meta.env.VITE_APP_TMDB_V3_API_KEY;

  useEffect(() => {
    const fetchTrailer = async () => {
      try {
        if (!movie?.id) return;

        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}`
        );

        const data = await res.json();

        const trailer =
          data.results?.find(v => v.type === "Trailer" && v.site === "YouTube") ||
          data.results?.find(v => v.site === "YouTube");

        if (trailer?.key) {
          setTrailerId(trailer.key);
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    if (movie?.id) fetchTrailer();
  }, [movie]);

  // ✅ SAVE HISTORY
  useEffect(() => {
    if (movie) saveWatch(movie);
  }, [movie]);

  return (
    <div className="player-page">

      {/* 🔙 BACK */}
      <button
        className="back-btn"
        onClick={() => setSelectedMovie(null)}
      >
        ←
      </button>

      {/* 🎬 VIDEO */}
      {loading ? (
        <p className="loading">Loading...</p>
      ) : trailerId ? (
        <div className="video-container">

          <iframe
            className="video-frame"
            src={`https://www.youtube.com/embed/${trailerId}?autoplay=1&controls=1`}
            allow="autoplay; encrypted-media"
            allowFullScreen
          />

          <div className="video-overlay" />
        </div>
      ) : (
        <p className="loading">No trailer available</p>
      )}

      {/* 🎬 INFO */}
      <div className="video-info">
        <h1>{movie?.title}</h1>
        <p>{movie?.overview}</p>
      </div>

    </div>
  );
}

export default TrailerPage;