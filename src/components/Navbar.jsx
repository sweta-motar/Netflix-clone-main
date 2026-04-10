import { useState, useEffect } from "react";
import "./Navbar.css";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const handleLogout = () => {
  signOut(auth);
};
function Navbar({ setPage, setSearch, setProfile, setUser }) {
  const [input, setInput] = useState("");
  const [show, setShow] = useState(false);
  
  const handleSearch = (e) => {
    setInput(e.target.value);
    setSearch(e.target.value);
  };

  const handleLogout = () => {
      localStorage.removeItem("user");
      localStorage.removeItem("profile"); // ✅ IMPORTANT
      setUser(null);
  };

  // 🎬 Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
   <div className={`navbar ${show ? "navbar-black" : ""}`}>

  <div className="nav-left">
    <h2 className="logo" onClick={() => setPage("home")}>
      NETFLIX
    </h2>

    <button onClick={() => setPage("home")}>Home</button>
    <button onClick={() => setPage("wishlist")}>My List</button>
  </div>

  <div className="nav-right">

    <input
      type="text"
      placeholder="Search"
      value={input}
      onChange={handleSearch}
      className="search"
    />

    <div
      className="avatar"
      onClick={() => {
        localStorage.removeItem("profile"); // ✅ go back to profile page
        setProfile(null);
      }}
    >
      <img src="https://i.pravatar.cc/40" />
    </div>

    <button
      className="logout-btn"
      onClick={() => {
        signOut(auth);
        localStorage.removeItem("profile");
        window.location.reload();
      }}
    >
      Logout
    </button>

  </div>
</div>
  );
}

export default Navbar;
