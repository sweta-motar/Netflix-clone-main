const API = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const getUserId = () => {
  return localStorage.getItem("user_id")?.trim() || "1";
};

// ✅ GET HISTORY
export const getHistory = async () => {
  try {
    const user_id = getUserId();

    const res = await fetch(`${API}/get-history/${user_id}/`);

    if (!res.ok) throw new Error("Failed to fetch history");

    return await res.json();
  } catch (err) {
    console.error("History Error:", err);
    return [];
  }
};

// ✅ ADD HISTORY
export const saveWatch = async (movie) => {
  try {
    const user_id = getUserId();

    await fetch(`${API}/add-history/`, {
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
    console.error("Save History Error:", err);
  }
};

// ✅ REMOVE HISTORY
export const removeFromHistory = async (movie_id) => {
  try {
    const user_id = getUserId();

    await fetch(`${API}/remove-history/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id, movie_id }),
    });
  } catch (err) {
    console.error("Remove History Error:", err);
  }
};