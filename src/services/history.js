const BASE_URL = "http://127.0.0.1:8000/api";

// GET HISTORY
export const getHistory = async () => {
  const user_id = localStorage.getItem("user_id");

  const res = await fetch(`${BASE_URL}/get-history/${user_id}/`);
  return res.json();
};

// SAVE WATCH + RESUME
export const saveWatch = async (movie) => {
  const user_id = localStorage.getItem("user_id");

  // 🎯 Save last watched movie locally (for resume)
  localStorage.setItem("lastMovie", JSON.stringify(movie));

  await fetch(`${BASE_URL}/add-history/`, {
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

// GET LAST WATCHED (resume)
export const getLastWatched = () => {
  return JSON.parse(localStorage.getItem("lastMovie"));
};

// REMOVE
export const removeFromHistory = async (movie_id) => {
  const user_id = localStorage.getItem("user_id");

  await fetch(`${BASE_URL}/remove-history/`, {
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