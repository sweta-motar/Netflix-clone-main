import { useEffect, useState } from "react";
import { saveWatch } from "../services/history";
import "./TrailerPage.css";

function TrailerPage({ movie, setSelectedMovie }) {
  const [trailerId, setTrailerId] = useState("");

  const BASE_URL = import.meta.env.VITE_APP_API_ENDPOINT_URL;
  const API_KEY = import.meta.env.VITE_APP_TMDB_V3_API_KEY;

  useEffect(() => {
    const fetchTrailer = async () => {
      const res = await fetch(
        `${BASE_URL}movie/${movie.id}/videos?api_key=${API_KEY}`
      );
      const data = await res.json();

      const trailer =
        data.results?.find(
          (vid) =>
            vid.type === "Trailer" &&
            vid.site === "YouTube"
        ) || data.results?.find((vid) => vid.site === "YouTube");

      if (trailer) setTrailerId(trailer.key);
    };

    fetchTrailer();
  }, [movie]);

  // 🔥 SAVE TO CONTINUE WATCHING
  useEffect(() => {
    if (movie) {
      saveWatch(movie);
    }
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

      {trailerId ? (
        <div className="video-container">

          <iframe
            className="video-frame"
            src={`https://www.youtube.com/embed/${trailerId}?autoplay=1&controls=1&modestbranding=1&rel=0`}
            allow="autoplay; encrypted-media"
            allowFullScreen
          />

          <div className="video-overlay" />

        </div>
      ) : (
        <p className="loading">Loading...</p>
      )}

      {/* 🎬 INFO */}
      <div className="video-info">
        <h1>{movie.title}</h1>
        <p>{movie.overview}</p>
      </div>

    </div>
  );
}

export default TrailerPage;