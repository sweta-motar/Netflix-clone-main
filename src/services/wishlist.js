// src/services/wishlist.js

export const getWishlist = () => {
  return JSON.parse(localStorage.getItem("wishlist")) || [];
};

export const toggleWishlist = (movie) => {
  let wishlist = getWishlist();

  const exists = wishlist.find((item) => item.id === movie.id);

  if (exists) {
    // ❌ REMOVE
    wishlist = wishlist.filter((item) => item.id !== movie.id);
  } else {
    // ✅ ADD
    wishlist.push(movie);
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  return wishlist;
};