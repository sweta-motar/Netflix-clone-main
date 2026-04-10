import { useEffect, useState } from "react";

function MovieDetails({ movie, setSelectedMovie, setShowDetails }) {
  const [details, setDetails] = useState(null);

  const API_KEY = import.meta.env.VITE_APP_TMDB_V3_API_KEY;

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => setDetails(data));
  }, [movie]);

  return (
    <div style={{ padding: "20px", background: "#141414", minHeight: "100vh" }}>
      
      {/* 🔙 BACK */}
      <button onClick={() => {
        setSelectedMovie(null);
        setShowDetails(false);
      }}>
        ← Back
      </button>

      {details && (
        <>
          {/* 🎬 BANNER */}
          <div
            style={{
              height: "400px",
              backgroundImage: `url(https://image.tmdb.org/t/p/original${details.backdrop_path})`,
              backgroundSize: "cover",
              borderRadius: "10px"
            }}
          />

          <h1>{details.title}</h1>
          <p>{details.overview}</p>

          {/* ▶ PLAY BUTTON */}
          <button
          onClick={() => setSelectedMovie(movie)}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            background: "red",
            border: "none",
            color: "white",
            cursor: "pointer",
          }}
        >
          ▶ Play Trailer
        </button>
        </>
      )}
    </div>
  );
}

export default MovieDetails;