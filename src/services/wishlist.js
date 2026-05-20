const API = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const getUserId = () => {
  const id = localStorage.getItem("user_id");
  if (!id) return null;
  return parseInt(id.trim(), 10);
};

const getProfileId = () => {
  const profile = localStorage.getItem("profile");
  if (!profile) return null;
  return JSON.parse(profile).id;
};

export const getWishlist = async () => {
  try {
    const user_id = getUserId();
    const profile_id = getProfileId();
    if (!user_id) return [];
    const res = await fetch(`${API}/get-wishlist/${user_id}/?profile_id=${profile_id}`);
    if (!res.ok) throw new Error("Failed to fetch wishlist");
    return await res.json();
  } catch (err) {
    console.error("Wishlist Error:", err);
    return [];
  }
};

export const toggleWishlist = async (movie) => {
  try {
    const user_id = getUserId();
    const profile_id = getProfileId();
    if (!user_id) return;
    const wishlist = await getWishlist();
    const alreadyIn = wishlist.some((m) => m.movie_id === movie.id);
    if (alreadyIn) {
      await fetch(`${API}/remove-wishlist/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: parseInt(user_id, 10), movie_id: parseInt(movie.id, 10) }),
      });
    } else {
      await fetch(`${API}/add-wishlist/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: parseInt(user_id, 10),
          profile_id: profile_id,
          movie_id: parseInt(movie.id, 10),
          title: movie.title,
          poster: movie.poster_path,
        }),
      });
    }
  } catch (err) {
    console.error("Toggle Wishlist Error:", err);
  }
};

export const removeFromWishlist = async (movie_id) => {
  try {
    const user_id = getUserId();
    if (!user_id) return;
    await fetch(`${API}/remove-wishlist/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: parseInt(user_id, 10), movie_id: parseInt(movie_id, 10) }),
    });
  } catch (err) {
    console.error("Remove Wishlist Error:", err);
  }
};
