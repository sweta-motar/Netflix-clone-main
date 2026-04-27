const API = import.meta.env.VITE_API_URL;

const getUserId = () => {
  return localStorage.getItem("user_id")?.trim();
};

// ✅ GET HISTORY
export const getHistory = async () => {
  const user_id = getUserId();

  const res = await fetch(`${API}/api/get-history/${user_id}/`);
  return res.json();
};

// ✅ ADD HISTORY
export const saveWatch = async (movie) => {
  const user_id = getUserId() || 1; // FIX: DEFAULT TO 1 FOR TESTING

  localStorage.setItem("lastWatched", JSON.stringify(movie));

  await fetch(`${API}/api/add-history/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id,
      movie_id: movie.id,
      title: movie.title,
      poster: movie.poster_path,
    }),
  });
};

// ✅ REMOVE HISTORY (THIS WAS MISSING ❗)
export const removeFromHistory = async (movie_id) => {
  const user_id = getUserId();

  await fetch(`${API}/api/remove-history/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id, movie_id }),
  });
};