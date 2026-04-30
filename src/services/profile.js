const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// ✅ GET PROFILES
export const getProfiles = async () => {
  try {
    const user_id = localStorage.getItem("user_id") || "1";

    const res = await fetch(`${BASE_URL}/profiles/${user_id}/`);

    if (!res.ok) throw new Error("Failed to fetch profiles");

    return await res.json();
  } catch (err) {
    console.error("Profile Fetch Error:", err);
    return [];
  }
};

// ✅ ADD PROFILE
export const addProfileAPI = async (name) => {
  try {
    const user_id = localStorage.getItem("user_id") || "1";

    const res = await fetch(`${BASE_URL}/add-profile/`, {
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

    return await res.json();
  } catch (err) {
    console.error("Add Profile Error:", err);
  }
};

// ✅ DELETE PROFILE
export const deleteProfileAPI = async (id) => {
  try {
    await fetch(`${BASE_URL}/delete-profile/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
  } catch (err) {
    console.error("Delete Profile Error:", err);
  }
};

// ✅ UPDATE PROFILE
export const updateProfileAPI = async (id, name) => {
  try {
    await fetch(`${BASE_URL}/update-profile/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, name }),
    });
  } catch (err) {
    console.error("Update Profile Error:", err);
  }
};