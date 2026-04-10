import { useState, useEffect } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

import Home from "./pages/home";
import Login from "./pages/login";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";
import TrailerPage from "./pages/TrailerPage";

function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [page, setPage] = useState("home");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 AUTH LISTENER
  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
    setLoading(false);
  });

  return () => unsubscribe();
}, []);

// ⏳ Wait until Firebase loads
if (loading) {
  return <div className="loader-container">NETFLIX</div>;
}

// 🔐 ALWAYS SHOW LOGIN FIRST (until user logs in manually)
if (!user) {
  return <Login setUser={setUser} />;
}

  // 🔐 LOGIN PAGE
  if (!user) {
  return (
    <div className="fade">
      <Login setUser={setUser} />
    </div>
  );
}

  // 👤 PROFILE PAGE
  if (!profile) return <Profile setProfile={setProfile} />;

  return (
    <div style={{ background: "#141414", color: "white" }}>

      {/* 🎬 TRAILER PAGE */}
      {selectedMovie && (
        <TrailerPage
          movie={selectedMovie}
          setSelectedMovie={setSelectedMovie}
        />
      )}

      {/* 🏠 HOME */}
      {!selectedMovie && page === "home" && (
        <Home
          setPage={setPage}
          setProfile={setProfile}
          setUser={setUser}
          setSelectedMovie={setSelectedMovie}
        />
      )}

      {/* ❤️ WISHLIST */}
      {!selectedMovie && page === "wishlist" && (
      <Wishlist 
        setPage={setPage} 
        setSelectedMovie={(movie) => {
          setSelectedMovie(movie);
          setShowDetails(false); // go to trailer
        }}
  />
)}
    </div>
  );
}

export default App;