import { useEffect, useState } from "react";
import { toggleWishlist, getWishlist } from "../services/wishlist";
import "./Row.css";

function Row({ title, fetchUrl, search, setSelectedMovie }) {
  const [movies, setMovies] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);

  const API_KEY = "b139582166405f939e11217717f711f9";

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const url = fetchUrl.includes("?")
          ? `https://api.themoviedb.org/3${fetchUrl}&api_key=${API_KEY}`
          : `https://api.themoviedb.org/3${fetchUrl}?api_key=${API_KEY}`;

        const res = await fetch(url);
        const data = await res.json();

        setMovies(data.results || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMovies();
  }, [fetchUrl]);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    const data = await getWishlist();
    setWishlistIds(data.map((m) => m.movie_id));
  };

  const handleWishlist = async (movie) => {
    await toggleWishlist(movie);
    loadWishlist();
  };

  return (
    <div style={{ marginLeft: "20px" }}>
      <h2>{title}</h2>

      <div className="row-scroll">
        {movies.map((movie) => (
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
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
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