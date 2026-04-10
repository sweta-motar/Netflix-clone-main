import { useEffect, useState } from "react";
import { toggleWishlist, getWishlist } from "../services/wishlist";
import "./Row.css";
import Loader from "./Loader";

function Row({ title, fetchUrl, search, setSelectedMovie }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);

  const API_KEY = import.meta.env.VITE_APP_TMDB_V3_API_KEY;

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3${fetchUrl}&api_key=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.results || []);
        setLoading(false);
      });
  }, [fetchUrl, API_KEY]);

  useEffect(() => {
    setWishlist(getWishlist());
  }, []);

  const filteredMovies = movies.filter((movie) =>
    movie.title?.toLowerCase().includes(search?.toLowerCase() || "")
  );

  const handleWishlist = (movie) => {
    const updated = toggleWishlist(movie);
    setWishlist(updated);
  };

  return (
    <div style={{ marginLeft: "20px" }}>
      <h2>{title}</h2>

      <div className="row-scroll">
        {loading ? (
          <Loader />
        ) : (
          filteredMovies.map((movie) => (
            <div key={movie.id} className="movie-wrapper">

              <span
                className="heart"
                onClick={(e) => {
                  e.stopPropagation();
                  handleWishlist(movie);
                }}
              >
                {wishlist.some((item) => item.id === movie.id)
                  ? "❤️"
                  : "🤍"}
              </span>

              <img
                src={`https://image.tmdb.org/t/p/w300${
                  movie.poster_path || movie.backdrop_path
                }`}
                alt={movie.title}
                className="movie-card"
                onClick={() => setSelectedMovie(movie)} // ✅ important
              />

              <p className="movie-title">{movie.title}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Row;