import { useEffect, useState } from "react";

function Banner() {
  const [movie, setMovie] = useState(null);

  const API_KEY = import.meta.env.VITE_APP_TMDB_V3_API_KEY;

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        setMovie(data.results[0]); // first trending
      });
  }, []);

  return (
    <div
      style={{
        height: "60vh",
        backgroundImage: `url(https://image.tmdb.org/t/p/original${movie?.backdrop_path})`,
        backgroundSize: "cover",
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