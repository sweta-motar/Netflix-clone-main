// GET HISTORY
export const getHistory = () => {
  return JSON.parse(localStorage.getItem("history")) || [];
};

// SAVE WATCH
export const saveWatch = (movie) => {
  let history = getHistory();

  // remove duplicate
  history = history.filter((item) => item.id !== movie.id);

  // add to top
  history.unshift(movie);

  localStorage.setItem("history", JSON.stringify(history));
};

// ❌ REMOVE FROM HISTORY
export const removeFromHistory = (movie) => {
  let history = getHistory();

  const updated = history.filter((item) => item.id !== movie.id);

  localStorage.setItem("history", JSON.stringify(updated));

  return updated; // ✅ return updated list
};