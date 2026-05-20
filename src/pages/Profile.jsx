import { useState, useEffect } from "react";
import "./Profile.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const GENRES = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Romance", "Thriller", "Documentary", "Animation", "Fantasy"];
const LANGUAGES = ["English", "Hindi", "Spanish", "French", "Japanese", "Korean", "German", "Italian"];
const RATINGS = ["All", "U", "UA", "A", "18+"];
const THEMES = ["#e50914", "#0084ff", "#00b4d8", "#7b2d8b", "#f4a261", "#2ec4b6", "#e76f51", "#43aa8b"];

const DEFAULT_PREFS = {
  genres: [],
  language: "English",
  rating: "All",
  autoplay: true,
  nextEpisode: true,
  theme: "#e50914",
};

function Profile({ setProfile }) {
  const [profiles, setProfiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showPrefsModal, setShowPrefsModal] = useState(false);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(null);
  const [editingPrefs, setEditingPrefs] = useState(null);
  const [prefs, setPrefs] = useState({ ...DEFAULT_PREFS });

  useEffect(() => { loadProfiles(); }, []);

  const loadProfiles = async () => {
    const user_id = localStorage.getItem("user_id");
    const res = await fetch(`${API}/profiles/${user_id}/`);
    const data = await res.json();
    setProfiles(data);
  };

  const saveProfile = async () => {
    const user_id = localStorage.getItem("user_id");
    const avatar = `https://i.pravatar.cc/150?u=${name}`;
    if (editing) {
      await fetch(`${API}/update-profile/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editing.id, user_id, name, avatar }),
      });
    } else {
      await fetch(`${API}/add-profile/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, name, avatar }),
      });
    }
    setShowModal(false);
    setName("");
    setEditing(null);
    loadProfiles();
  };

  const savePrefs = async () => {
    const user_id = localStorage.getItem("user_id");
    await fetch(`${API}/update-profile/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingPrefs.id,
        user_id,
        name: editingPrefs.name,
        avatar: editingPrefs.avatar,
        preferences: prefs,
      }),
    });
    setShowPrefsModal(false);
    setEditingPrefs(null);
    loadProfiles();
  };

  const openPrefs = (e, p) => {
    e.stopPropagation();
    setEditingPrefs(p);
    setPrefs({ ...DEFAULT_PREFS, ...(p.preferences || {}) });
    setShowPrefsModal(true);
  };

  const toggleGenre = (g) =>
    setPrefs((prev) => ({
      ...prev,
      genres: prev.genres.includes(g) ? prev.genres.filter((x) => x !== g) : [...prev.genres, g],
    }));

  const deleteProfile = async (id) => {
    const user_id = localStorage.getItem("user_id");
    await fetch(`${API}/delete-profile/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, user_id }),
    });
    loadProfiles();
  };

  return (
    <div className="profile">
      <h1>Who's watching?</h1>
      <div className="profiles">
        {profiles.map((p) => {
          const theme = p.preferences?.theme || "#e50914";
          return (
            <div key={p.id} className="profile-card-wrapper">
              <div className="delete-btn" onClick={(e) => { e.stopPropagation(); deleteProfile(p.id); }}>✖</div>
              <div className="edit-btn" onClick={(e) => { e.stopPropagation(); setEditing(p); setName(p.name); setShowModal(true); }}>✏️</div>
              <div className="profile-card" onClick={() => { localStorage.setItem("profile", JSON.stringify(p)); setProfile(p); }}>
                <div className="avatar-wrap" style={{ "--theme": theme }}>
                  <img src={p.avatar} alt="" />
                  <div className="avatar-ring" />
                </div>
                <p>{p.name}</p>
                {p.preferences?.genres?.length > 0 && (
                  <div className="genre-pills">
                    {p.preferences.genres.slice(0, 3).map((g) => (
                      <span key={g} className="genre-pill" style={{ background: theme + "33", color: theme }}>{g}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div className="profile-card add" onClick={() => setShowModal(true)}>
          <div className="add-icon">+</div>
          <p>Add Profile</p>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editing ? "Edit Profile" : "Add Profile"}</h2>
            <input placeholder="Profile Name" value={name} onChange={(e) => setName(e.target.value)} />
            <div className="modal-buttons">
              <button onClick={saveProfile}>Save</button>
              <button onClick={() => { setShowModal(false); setEditing(null); setName(""); }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showPrefsModal && (
        <div className="modal-overlay">
          <div className="modal prefs-modal">
            <h2>Personalise — {editingPrefs?.name}</h2>
            <div className="pref-section">
              <label className="pref-label">Profile colour</label>
              <div className="theme-row">
                {THEMES.map((c) => (
                  <div key={c} className={`theme-dot ${prefs.theme === c ? "active" : ""}`} style={{ background: c }} onClick={() => setPrefs((p) => ({ ...p, theme: c }))} />
                ))}
              </div>
            </div>
            <div className="pref-section">
              <label className="pref-label">Favourite genres</label>
              <div className="genre-grid">
                {GENRES.map((g) => (
                  <div key={g} className={`genre-chip ${prefs.genres.includes(g) ? "selected" : ""}`} style={prefs.genres.includes(g) ? { background: prefs.theme + "33", borderColor: prefs.theme, color: prefs.theme } : {}} onClick={() => toggleGenre(g)}>{g}</div>
                ))}
              </div>
            </div>
            <div className="pref-section">
              <label className="pref-label">Preferred language</label>
              <select className="pref-select" value={prefs.language} onChange={(e) => setPrefs((p) => ({ ...p, language: e.target.value }))}>
                {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div className="pref-section">
              <label className="pref-label">Maturity rating</label>
              <div className="rating-row">
                {RATINGS.map((r) => (
                  <div key={r} className={`rating-chip ${prefs.rating === r ? "selected" : ""}`} style={prefs.rating === r ? { background: prefs.theme, color: "#fff", borderColor: prefs.theme } : {}} onClick={() => setPrefs((p) => ({ ...p, rating: r }))}>{r}</div>
                ))}
              </div>
            </div>
            <div className="pref-section toggles">
              <div className="toggle-row">
                <span>Autoplay next episode</span>
                <label className="switch">
                  <input type="checkbox" checked={prefs.nextEpisode} onChange={(e) => setPrefs((p) => ({ ...p, nextEpisode: e.target.checked }))} />
                  <span className="slider" style={{ "--tc": prefs.theme }} />
                </label>
              </div>
              <div className="toggle-row">
                <span>Autoplay previews</span>
                <label className="switch">
                  <input type="checkbox" checked={prefs.autoplay} onChange={(e) => setPrefs((p) => ({ ...p, autoplay: e.target.checked }))} />
                  <span className="slider" style={{ "--tc": prefs.theme }} />
                </label>
              </div>
            </div>
            <div className="modal-buttons">
              <button onClick={savePrefs} style={{ background: prefs.theme }}>Save preferences</button>
              <button onClick={() => setShowPrefsModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
