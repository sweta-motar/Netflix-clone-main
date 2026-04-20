import { useEffect, useState } from "react";
import { toggleWishlist, getWishlist } from "../services/wishlist";
import "./Row.css";

function Row({ title, fetchUrl, search, setSelectedMovie }) {
  const [movies, setMovies] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);

  const API_KEY = import.meta.env.VITE_APP_TMDB_V3_API_KEY;

  useEffect(() => {
    const fetchMovies = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3${fetchUrl}&api_key=${API_KEY}`
      );
      const data = await res.json();
      setMovies(data.results || []);
    };

    fetchMovies();
  }, [fetchUrl, API_KEY]);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    const data = await getWishlist();
    const ids = data.map((item) => item.movie_id);
    setWishlistIds(ids);
  };

  const handleWishlist = async (movie) => {
    await toggleWishlist(movie);
    loadWishlist();
  };

  const filteredMovies = movies.filter((movie) =>
    movie.title?.toLowerCase().includes(search?.toLowerCase() || "")
  );

  return (
    <div style={{ marginLeft: "20px" }}>
      <h2>{title}</h2>

      <div className="row-scroll">
        {filteredMovies.map((movie) => (
          <div key={movie.id} className="movie-wrapper">

            <span
              className="heart"
              onClick={(e) => {
                e.stopPropagation();
                handleWishlist(movie);
              }}
            >
              {wishlistIds.includes(movie.id) ? "❤️" : "🤍"}
            </span>

            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "https://via.placeholder.com/300x450?text=No+Image"
              }
              className="movie-card"
              onClick={() => setSelectedMovie(movie)}
            />

          </div>
        ))}
      </div>
    </div>
  );
}

export default Row;