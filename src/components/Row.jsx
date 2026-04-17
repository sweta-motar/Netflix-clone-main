import { useEffect, useState } from "react";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist
} from "../services/wishlist";
import "./Row.css";

function Row({ title, fetchUrl, search, setSelectedMovie }) {
  const [movies, setMovies] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);

  const API_KEY = import.meta.env.VITE_APP_TMDB_V3_API_KEY;

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3${fetchUrl}&api_key=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => setMovies(data.results || []));
  }, [fetchUrl]);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    const data = await getWishlist();
    const ids = data.map((item) => item.movie_id);
    setWishlistIds(ids);
  };

  const handleWishlist = async (movie) => {
    if (wishlistIds.includes(movie.id)) {
      await removeFromWishlist(movie.id);
    } else {
      await addToWishlist(movie);
    }

    setWishlistIds((prev) =>
      prev.includes(movie.id)
        ? prev.filter((id) => id !== movie.id)
        : [...prev, movie.id]
    );
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
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
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