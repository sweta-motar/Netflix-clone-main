import { useEffect, useState } from "react";
import { saveWatch } from "../services/history";
import "./TrailerPage.css";

function TrailerPage({ movie, setSelectedMovie }) {
  const [trailerId, setTrailerId] = useState("");
  const [loading, setLoading] = useState(true);

  const BASE_URL = import.meta.env.VITE_APP_API_ENDPOINT_URL;
  const API_KEY = import.meta.env.VITE_APP_TMDB_V3_API_KEY;

  useEffect(() => {
    const fetchTrailer = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/movie/${movie.id}/videos?api_key=${API_KEY}`
        );

        const data = await res.json();

        // ✅ ONLY REAL TRAILER
        const trailer = data.results?.find(
          (vid) =>
            vid.type === "Trailer" &&
            vid.site === "YouTube"
        );

        if (trailer) {
          setTrailerId(trailer.key);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };

    if (movie) fetchTrailer();
  }, [movie]);

  // Save watch history
  useEffect(() => {
    if (movie) {
      saveWatch(movie);
    }
  }, [movie]);

  return (
    <div className="player-page">

      {/* BACK BUTTON */}
      <button
        className="back-btn"
        onClick={() => setSelectedMovie(null)}
      >
        ←
      </button>

      {/* VIDEO */}
      {loading ? (
        <p className="loading">Loading...</p>
      ) : trailerId ? (
        <div className="video-container">
          <iframe
            className="video-frame"
            src={`https://www.youtube.com/embed/${trailerId}?autoplay=1&controls=1`}
            title="Trailer"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
          <div className="video-overlay" />
        </div>
      ) : (
        <p className="loading">
          Trailer not available for this movie
        </p>
      )}

      {/* INFO */}
      <div className="video-info">
        <h1>{movie.title}</h1>
        <p>{movie.overview}</p>
      </div>

    </div>
  );
}

export default TrailerPage;