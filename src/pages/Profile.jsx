import { useState, useEffect } from "react";
import "./Profile.css";

function Profile({ setProfile }) {
  const [profiles, setProfiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    const user_id = localStorage.getItem("user_id");

    const res = await fetch(
      `http://127.0.0.1:8000/api/profiles/${user_id}/`
    );
    const data = await res.json();
    setProfiles(data);
  };

  // ➕ ADD / EDIT PROFILE
  const saveProfile = async () => {
    const user_id = localStorage.getItem("user_id");

    const avatar = `https://i.pravatar.cc/150?u=${name}`; // ✅ auto avatar

    if (editing) {
      await fetch("http://127.0.0.1:8000/api/update-profile/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editing.id,
          user_id,
          name,
          avatar
        })
      });
    } else {
      await fetch("http://127.0.0.1:8000/api/add-profile/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id,
          name,
          avatar
        })
      });
    }

    setShowModal(false);
    setName("");
    setEditing(null);
    loadProfiles();
  };

  // ❌ DELETE
  const deleteProfile = async (id) => {
    const user_id = localStorage.getItem("user_id");

    await fetch("http://127.0.0.1:8000/api/delete-profile/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id, user_id })
    });

    loadProfiles();
  };

  return (
    <div className="profile">
      <h1>Who's watching?</h1>

      <div className="profiles">
        {profiles.map((p) => (
          <div key={p.id} className="profile-card-wrapper">

            {/* ❌ DELETE BUTTON */}
            <div
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                deleteProfile(p.id);
              }}
            >
              ✖
            </div>

            {/* ✏️ EDIT BUTTON */}
            <div
              className="edit-btn"
              onClick={(e) => {
                e.stopPropagation();
                setEditing(p);
                setName(p.name);
                setShowModal(true);
              }}
            >
              ✏️
            </div>

            <div
              className="profile-card"
              onClick={() => {
                localStorage.setItem("profile", JSON.stringify(p));
                setProfile(p);
              }}
            >
              <img src={p.avatar} alt="" />
              <p>{p.name}</p>
            </div>
          </div>
        ))}

        {/* ➕ ADD */}
        <div
          className="profile-card add"
          onClick={() => setShowModal(true)}
        >
          <div className="add-icon">+</div>
          <p>Add Profile</p>
        </div>
      </div>

      {/* ✅ MODAL CENTER FIX */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editing ? "Edit Profile" : "Add Profile"}</h2>

            <input
              placeholder="Profile Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div className="modal-buttons">
              <button onClick={saveProfile}>Save</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;