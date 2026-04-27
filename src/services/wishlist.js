const API = import.meta.env.VITE_API_URL;

const getUserId = () => {
  return localStorage.getItem("user_id")?.trim();
};

export const getWishlist = async () => {
  const user_id = getUserId() || 1; // FIX: DEFAULT TO 1 FOR TESTING

  const res = await fetch(`${API}/api/get-wishlist/${user_id}/`);
  return res.json();
};

export const toggleWishlist = async (movie) => {
  const user_id = getUserId();

  await fetch(`${API}/api/add-wishlist/`, {   // ✅ FIXED ENDPOINT
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id,
      movie_id: movie.id,
      title: movie.title,
      poster: movie.poster_path,   // ✅ MATCH BACKEND
    }),
  });
};

export const removeFromWishlist = async (movie_id) => {
  const user_id = getUserId();

  await fetch(`${API}/api/remove-wishlist/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id, movie_id }),
  });
};