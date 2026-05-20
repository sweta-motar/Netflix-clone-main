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

export const getHistory = async () => {
  try {
    const user_id = getUserId();
    const profile_id = getProfileId();
    if (!user_id) return [];
    const res = await fetch(`${API}/get-history/${user_id}/?profile_id=${profile_id}`);
    if (!res.ok) throw new Error("Failed to fetch history");
    return await res.json();
  } catch (err) {
    console.error("History Error:", err);
    return [];
  }
};

export const saveWatch = async (movie) => {
  try {
    const user_id = getUserId();
    const profile_id = getProfileId();
    if (!user_id) return;
    const res = await fetch(`${API}/add-history/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id,
        profile_id,
        movie_id: movie.id,
        title: movie.title || movie.name || "Untitled",
        poster: movie.poster_path || "",
      }),
    });
    if (!res.ok) throw new Error("Failed to save history");
  } catch (err) {
    console.error("Save History Error:", err);
  }
};

export const removeFromHistory = async (movie_id) => {
  try {
    const user_id = getUserId();
    const profile_id = getProfileId();
    if (!user_id) return null;
    const res = await fetch(`${API}/remove-history/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: parseInt(user_id, 10),
        profile_id,
        movie_id: parseInt(movie_id, 10),
      }),
    });
    if (!res.ok) throw new Error("Failed to remove history");
    return await res.json();
  } catch (err) {
    console.error("Remove History Error:", err);
    return null;
  }
};
