import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";
import "./Profile.css";

function Profile({ setProfile }) {
  const [profiles, setProfiles] = useState([]);
  const user = auth.currentUser;

  // 🔥 LOAD PROFILES (CACHE + FIREBASE)
  useEffect(() => {
    if (!user) return;

    const key = `profiles_${user.uid}`;

    // ⚡ load from cache first
    const cached = localStorage.getItem(key);
    if (cached) {
      setProfiles(JSON.parse(cached));
    }

    // 🔥 fetch from firebase
    const fetchProfiles = async () => {
      const snap = await getDocs(
        collection(db, "users", user.uid, "profiles")
      );

      const data = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setProfiles(data);

      // ✅ cache per user
      localStorage.setItem(key, JSON.stringify(data));
    };

    fetchProfiles();
  }, [user]);

  // ➕ ADD PROFILE
  const addProfile = async () => {
    const name = prompt("Enter profile name");
    if (!name) return;

    const newProfile = {
      name,
      avatar: `https://i.pravatar.cc/150?u=${name}`
    };

    const ref = await addDoc(
      collection(db, "users", user.uid, "profiles"),
      newProfile
    );

    const updated = [...profiles, { ...newProfile, id: ref.id }];
    setProfiles(updated);

    localStorage.setItem(
      `profiles_${user.uid}`,
      JSON.stringify(updated)
    );
  };

  // ❌ DELETE PROFILE
  const deleteProfile = async (id) => {
    await deleteDoc(doc(db, "users", user.uid, "profiles", id));

    const updated = profiles.filter(p => p.id !== id);
    setProfiles(updated);

    localStorage.setItem(
      `profiles_${user.uid}`,
      JSON.stringify(updated)
    );
  };

  // ✏️ EDIT PROFILE
  const updateProfile = async (id) => {
    const newName = prompt("Enter new name");
    if (!newName) return;

    await updateDoc(
      doc(db, "users", user.uid, "profiles", id),
      { name: newName }
    );

    const updated = profiles.map(p =>
      p.id === id ? { ...p, name: newName } : p
    );

    setProfiles(updated);

    localStorage.setItem(
      `profiles_${user.uid}`,
      JSON.stringify(updated)
    );
  };

  return (
    <div className="profile">
      <h1>Who's watching?</h1>

      <div className="profiles">
        {profiles.map(p => (
          <div
            key={p.id}
            className="profile-card"
            onClick={() => {
              localStorage.setItem("profile", JSON.stringify(p));
              setProfile(p);
            }}
            onContextMenu={(e) => {
              e.preventDefault();

              const action = prompt("Type 'edit' or 'delete'");

              if (action === "delete") deleteProfile(p.id);
              if (action === "edit") updateProfile(p.id);
            }}
          >
            <img src={p.avatar} alt="" />
            <p>{p.name}</p>
          </div>
        ))}

        {/* ➕ ADD PROFILE */}
        <div className="profile-card add" onClick={addProfile}>
          <div className="add-icon">+</div>
          <p>Add Profile</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;