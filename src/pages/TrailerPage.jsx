import { useEffect, useState } from "react";
import { saveWatch } from "../services/history";
import "./TrailerPage.css";

function TrailerPage({ movie, setSelectedMovie }) {
  const [trailerId, setTrailerId] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = import.meta.env.VITE_APP_API_ENDPOINT_URL;
  const API_KEY = import.meta.env.VITE_APP_TMDB_V3_API_KEY;

  // 🎬 FETCH TRAILER
  useEffect(() => {
    const fetchTrailer = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}movie/${movie.id}/videos?api_key=${API_KEY}`
        );

        // ❗ Check response
        if (!res.ok) {
          console.error("API Error:", res.status);
          setLoading(false);
          return;
        }

        const text = await res.text();

        // ❗ Empty response check
        if (!text) {
          console.error("Empty response");
          setLoading(false);
          return;
        }

        const data = JSON.parse(text);

        // ❗ No results
        if (!data.results || data.results.length === 0) {
          console.log("No trailer available");
          setLoading(false);
          return;
        }

        // ✅ Find trailer safely
        const trailer =
          data.results.find(
            (vid) =>
              vid.type === "Trailer" &&
              vid.site === "YouTube"
          ) ||
          data.results.find((vid) => vid.site === "YouTube");

        if (trailer) {
          setTrailerId(trailer.key);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching trailer:", error);
        setLoading(false);
      }
    };

    if (movie) fetchTrailer();
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

      {/* 🎥 VIDEO SECTION */}
      {loading ? (
        <p className="loading">Loading...</p>
      ) : trailerId ? (
        <div className="video-container">
          <iframe
            className="video-frame"
            src={`https://www.youtube.com/embed/${trailerId}?autoplay=1&controls=1&modestbranding=1&rel=0`}
            title="Trailer"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
          <div className="video-overlay" />
        </div>
      ) : (
        <p className="loading">No Trailer Available</p>
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