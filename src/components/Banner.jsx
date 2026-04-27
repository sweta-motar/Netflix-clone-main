import { useEffect, useState } from "react";

function Banner() {
  const [movie, setMovie] = useState(null);
  const API_KEY = import.meta.env.VITE_APP_TMDB_V3_API_KEY;

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`
        );

        const data = await res.json();

        if (data.results && data.results.length > 0) {
          // STRONG RANDOM LOGIC
          const randomMovie =
            data.results[Math.floor(Math.random() * data.results.length)];

          setMovie(randomMovie);
        }
      } catch (err) {
        console.error("Banner error:", err);
      }
    };

    fetchBanner();
  }, []);

  return (
    <div
      style={{
        height: "60vh",
        backgroundImage: movie
          ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
          : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "flex-end",
        padding: "20px",
      }}
    >
      <h1>{movie?.title}</h1>
    </div>
  );
}

export default Banner;