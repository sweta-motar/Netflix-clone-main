import { useState, useEffect } from "react";
import { getWishlist, toggleWishlist } from "../services/wishlist";
import Navbar from "../components/Navbar";
import "./Wishlist.css";

function Wishlist({ setPage, setSelectedMovie, setUser }) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    setMovies(getWishlist());
  }, []);

  const removeMovie = (movie) => {
    const updated = toggleWishlist(movie);
    setMovies(updated);
  };

  return (
    <div className="wishlist-page">

      <Navbar setPage={setPage} setUser={setUser} />

      <h2 className="wishlist-title">🔥 My List</h2>

      <div className="wishlist-row">
        {movies.map((movie) => (
          <div key={movie.id} className="wishlist-card">

            {/* 🎬 IMAGE */}
            <img
              src={`https://image.tmdb.org/t/p/w300${
                movie.poster_path || movie.backdrop_path
              }`}
              alt={movie.title}
              className="wishlist-img"
            />

            {/* ▶ PLAY BUTTON CENTER */}
            <div
              className="play-overlay"
              onClick={() => setSelectedMovie(movie)}
            >
              ▶
            </div>

            {/* ❌ REMOVE BUTTON */}
            <button
              className="remove-btn"
              onClick={(e) => {
                e.stopPropagation();
                removeMovie(movie);
              }}
            >
              ✖
            </button>

            <p className="wishlist-name">{movie.title}</p>

          </div>
        ))}
      </div>

    </div>
  );
}

export default Wishlist;