import { useState, useEffect } from "react";
import {
  getWishlist,
  removeFromWishlist
} from "../services/wishlist";
import Navbar from "../components/Navbar";
import "./Wishlist.css";

function Wishlist({ setPage, setSelectedMovie, setUser }) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    const data = await getWishlist();
    setMovies(data);
  };

  const removeMovie = async (movie) => {
    await removeFromWishlist(movie.movie_id);

    setMovies((prev) =>
      prev.filter((m) => m.movie_id !== movie.movie_id)
    );
  };

  return (
    <div className="wishlist-page">

      <Navbar setPage={setPage} setUser={setUser} />

      <h2 className="wishlist-title">🔥 My List</h2>

      <div className="wishlist-row">
        {movies.map((movie) => (
          <div key={movie.movie_id} className="wishlist-card">

            <img
              src={
                movie.poster
                  ? `https://image.tmdb.org/t/p/w500${movie.poster}`
                  : "https://via.placeholder.com/300x450?text=No+Image"
              }
              alt={movie.title}
              className="wishlist-img"
            />

            <div
              className="play-overlay"
              onClick={() =>
                setSelectedMovie({
                  id: movie.movie_id,
                  title: movie.title,
                  poster_path: movie.poster
                })
              }
            >
              ▶
            </div>

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

