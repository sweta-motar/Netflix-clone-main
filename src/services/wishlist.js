const BASE_URL = "http://127.0.0.1:8000/api";

// GET WISHLIST
export const getWishlist = async () => {
  const user_id = localStorage.getItem("user_id");
  const res = await fetch(`${BASE_URL}/get-wishlist/${user_id}/`);
  return res.json();
};

// ADD
export const addToWishlist = async (movie) => {
  const user_id = localStorage.getItem("user_id");

  await fetch(`${BASE_URL}/add-wishlist/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id,
      movie_id: movie.id,
      title: movie.title,
      poster: movie.poster_path,
    }),
  });
};

// REMOVE
export const removeFromWishlist = async (movie_id) => {
  const user_id = localStorage.getItem("user_id");

  await fetch(`${BASE_URL}/remove-wishlist/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id,
      movie_id,
    }),
  });
};