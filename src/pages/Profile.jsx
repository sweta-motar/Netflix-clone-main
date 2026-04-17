import { useState, useEffect } from "react";
import "./Profile.css";

function Profile({ setProfile }) {
  const [profiles, setProfiles] = useState([]);

  // 🔥 LOAD FROM BACKEND
  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    const user_id = localStorage.getItem("user_id");

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/profiles/${user_id}/`
      );

      const data = await res.json();
      setProfiles(data);
    } catch (err) {
      console.error("Error loading profiles:", err);
    }
  };

  // ➕ ADD PROFILE (NO MODAL, SIMPLE)
  const addProfile = async () => {
    const name = prompt("Enter profile name");
    if (!name) return;

    try {
      await fetch("http://127.0.0.1:8000/api/add-profile/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_id: localStorage.getItem("user_id"),
          name,
          avatar: `https://i.pravatar.cc/150?u=${name}`,
          is_kid: false
        })
      });

      loadProfiles(); // refresh
    } catch (err) {
      console.error("Error creating profile:", err);
    }
  };

  return (
    <div className="profile">
      <h1>Who's watching?</h1>

      <div className="profiles">
        {profiles.map((p) => (
          <div
            key={p.id}
            className="profile-card"
            onClick={() => {
              localStorage.setItem("profile", JSON.stringify(p));
              setProfile(p);
            }}
          >
            <img src={p.avatar} alt="" />
            <p>{p.name}</p>
          </div>
        ))}

        {/* ➕ ADD */}
        <div className="profile-card add" onClick={addProfile}>
          <div className="add-icon">+</div>
          <p>Add Profile</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;