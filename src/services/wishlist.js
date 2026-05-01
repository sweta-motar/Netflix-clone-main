const API = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const getUserId = () => {
  return localStorage.getItem("user_id")?.trim() || "1";
};

// ✅ GET WISHLIST
export const getWishlist = async () => {
  try {
    const user_id = getUserId();

    const res = await fetch(`${API}/get-wishlist/${user_id}/`); // ✅ trailing /

    if (!res.ok) throw new Error("Failed to fetch wishlist");

    return await res.json();
  } catch (err) {
    console.error("Wishlist Error:", err);
    return [];
  }
};

// ✅ ADD TO WISHLIST
export const toggleWishlist = async (movie) => {
  try {
    const user_id = getUserId();

    await fetch(`${API}/add-wishlist/`, { // ✅ trailing /
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
  } catch (err) {
    console.error("Add Wishlist Error:", err);
  }
};

// ✅ REMOVE FROM WISHLIST
export const removeFromWishlist = async (movie_id) => {
  try {
    const user_id = getUserId();

    await fetch(`${API}/remove-wishlist/`, { // ✅ trailing /
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id, movie_id }),
    });
  } catch (err) {
    console.error("Remove Wishlist Error:", err);
  }
};