const BASE_URL = import.meta.env.VITE_API_URL;

// ✅ GET WISHLIST
export const getWishlist = async () => {
  const user_id = localStorage.getItem("user_id");

  const res = await fetch(`${BASE_URL}/api/get-wishlist/${user_id}/`);
  return await res.json();
};

// ✅ ADD TO WISHLIST
export const addToWishlist = async (movie) => {
  await fetch(`${BASE_URL}/api/add-wishlist/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      user_id: localStorage.getItem("user_id"),
      movie_id: movie.id,
      title: movie.title,
      poster: movie.poster_path
    })
  });
};

// ✅ REMOVE FROM WISHLIST  ⭐ IMPORTANT FIX
export const removeFromWishlist = async (movie_id) => {
  await fetch(`${BASE_URL}/api/remove-wishlist/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      user_id: localStorage.getItem("user_id"),
      movie_id
    })
  });
};

// ✅ TOGGLE (ADD / REMOVE)
export const toggleWishlist = async (movie) => {
  const list = await getWishlist();
  const exists = list.find(item => item.movie_id === movie.id);

  if (exists) {
    await removeFromWishlist(movie.id);
  } else {
    await addToWishlist(movie);
  }
};