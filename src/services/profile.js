const BASE_URL = import.meta.env.VITE_API_URL;

export const getProfiles = async () => {
  const user_id = localStorage.getItem("user_id");

  const res = await fetch(`${BASE_URL}/api/profiles/${user_id}/`);
  return res.json();
};

export const addProfileAPI = async (name) => {
  const user_id = localStorage.getItem("user_id");

  const res = await fetch(`${BASE_URL}/api/add-profile/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id,
      name,
      avatar: `https://i.pravatar.cc/150?u=${name}`,
    }),
  });

  return res.json();
};

export const deleteProfileAPI = async (id) => {
  await fetch(`${BASE_URL}/api/delete-profile/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });
};

export const updateProfileAPI = async (id, name) => {
  await fetch(`${BASE_URL}/api/update-profile/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, name }),
  });
};