import { useState, useEffect } from "react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";
import TrailerPage from "./pages/TrailerPage";

function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [page, setPage] = useState("home");
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user_id");
    const savedProfile = localStorage.getItem("profile");

    if (savedUser) setUser(savedUser);
    if (savedProfile) setProfile(JSON.parse(savedProfile));
  }, []);

  const isAdmin = localStorage.getItem("is_admin") === "true";

  // 🔐 LOGIN
  if (!user) return <Login setUser={setUser} />;

  // ADMIN DIRECT ACCESS
  //if (isAdmin) {
    //return (
      //<Admin
        //setPage={setPage}
        //setProfile={setProfile}
        //setUser={setUser}
      //>
    //);
  //}

  // 👤 USER PROFILE
  if (!profile) return <Profile setProfile={setProfile} />;

  return (
    <div style={{ background: "#141414", color: "white" }}>

      {selectedMovie && (
        <TrailerPage
          movie={selectedMovie}
          setSelectedMovie={setSelectedMovie}
        />
      )}

      {!selectedMovie && page === "home" && (
        <Home
          setPage={setPage}
          setProfile={setProfile}
          setUser={setUser}
          setSelectedMovie={setSelectedMovie}
        />
      )}

      {!selectedMovie && page === "wishlist" && (
        <Wishlist
          setPage={setPage}
          setSelectedMovie={setSelectedMovie}
          setUser={setUser}
        />
      )}

    </div>
  );
}

export default App;