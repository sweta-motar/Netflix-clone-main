const BASE_URL = import.meta.env.VITE_API_URL;

export const saveWatch = async (movie) => {
  await fetch(`${BASE_URL}/api/add-history/`, {
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

export const getHistory = async () => {
  const user_id = localStorage.getItem("user_id");

  const res = await fetch(`${BASE_URL}/api/get-history/${user_id}/`);
  return await res.json();
};

export const getLastWatched = () => {
  const history = JSON.parse(localStorage.getItem("history")) || [];
  return history.length > 0 ? history[0] : null;
};

export const removeFromHistory = async (movie_id) => {
  await fetch(`${BASE_URL}/api/remove-history/`, {
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



