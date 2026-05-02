import { useState, useEffect } from "react";
import "./Profile.css";

const API = "http://127.0.0.1:8000/api";

function Profile({ setProfile }) {
  const [profiles, setProfiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProfile, setCurrentProfile] = useState(null);

  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    const user_id = localStorage.getItem("user_id");
    try {
      const res = await fetch(`${API}/profiles/${user_id}/`);
      const data = await res.json();
      setProfiles(data);
    } catch (err) {
      console.error("Error loading profiles:", err);
    }
  };

  // ➕ OPEN ADD MODAL
  const openAdd = () => {
    setEditMode(false);
    setName("");
    setAvatar("");
    setShowModal(true);
  };

  // ✏️ OPEN EDIT MODAL
  const openEdit = (profile) => {
    setEditMode(true);
    setCurrentProfile(profile);
    setName(profile.name);
    setAvatar(profile.avatar);
    setShowModal(true);
  };

  // 💾 SAVE (ADD / EDIT)
  const handleSave = async () => {
    const user_id = localStorage.getItem("user_id");

    try {
      if (editMode) {
        await fetch(`${API}/update-profile/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: currentProfile.id,
            user_id,
            name,
            avatar,
          }),
        });
      } else {
        await fetch(`${API}/add-profile/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id,
            name,
            avatar: avatar || `https://i.pravatar.cc/150?u=${name}`,
            is_kid: false,
          }),
        });
      }

      setShowModal(false);
      loadProfiles();
    } catch (err) {
      console.error("Save Error:", err);
    }
  };

  // ❌ DELETE PROFILE
  const handleDelete = async (profileId) => {
    const user_id = localStorage.getItem("user_id");

    if (!window.confirm("Delete this profile?")) return;

    try {
      await fetch(`${API}/delete-profile/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: profileId, user_id }),
      });

      setProfiles((prev) => prev.filter((p) => p.id !== profileId));
    } catch (err) {
      console.error("Delete Error:", err);
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
              localStorage.setItem("profile_id", p.id);
              setProfile(p);
            }}
          >
            {/* ❌ DELETE */}
            <span
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(p.id);
              }}
            >
              ✕
            </span>

            {/* ✏️ EDIT */}
            <span
              className="edit-btn"
              onClick={(e) => {
                e.stopPropagation();
                openEdit(p);
              }}
            >
              ✏
            </span>

            <img src={p.avatar} alt="" />
            <p>{p.name}</p>
          </div>
        ))}

        {/* ➕ ADD */}
        <div className="profile-card add" onClick={openAdd}>
          <div className="add-icon">+</div>
          <p>Add Profile</p>
        </div>
      </div>

      {/* 🧾 MODAL */}
      {showModal && (
        <div className="modal">
          <div className="modal-box">
            <h2>{editMode ? "Edit Profile" : "Add Profile"}</h2>

            <input
              type="text"
              placeholder="Profile Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Avatar URL (optional)"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
            />

            <div className="modal-actions">
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;