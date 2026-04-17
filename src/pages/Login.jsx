import { useState } from "react";
import "./Login.css";

function Login({ setUser }) {
  const [isSignup, setIsSignup] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false); // ✅ NEW
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAuth = async () => {
    const url = isSignup
      ? "http://127.0.0.1:8000/api/signup/"
      : "http://127.0.0.1:8000/api/login/";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.user_id) {

        // 🔐 ADMIN CHECK
        if (isAdminLogin && !data.is_admin) {
          alert("❌ You are not an admin");
          return;
        }

        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("is_admin", data.is_admin);

        setUser(data.user_id);

      } else {
        alert("Login failed");
      }
    } catch {
      alert("Server error");
    }
  };

  return (
    <div className="login">
      <div className="login-overlay"></div>

      <h1 className="login-logo">NETFLIX</h1>

      <div className="login-box">

        <h1>
          {isAdminLogin
            ? "Admin Login"
            : isSignup
            ? "Sign Up"
            : "Sign In"}
        </h1>

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleAuth}>
          {isAdminLogin
            ? "Login as Admin"
            : isSignup
            ? "Sign Up"
            : "Sign In"}
        </button>

        {/* 🔁 NORMAL SWITCH */}
        {!isAdminLogin && (
          <p className="switch">
            {isSignup
              ? "Already have an account? "
              : "New to Netflix? "}
            <span onClick={() => setIsSignup(!isSignup)}>
              {isSignup ? "Sign In" : "Sign Up now"}
            </span>
          </p>
        )}

        {/* 🔐 ADMIN MODE TOGGLE (NO UI BREAK) */}
        <p
          style={{
            marginTop: "15px",
            fontSize: "12px",
            color: "gray",
            cursor: "pointer",
          }}
          onClick={() => setIsAdminLogin(!isAdminLogin)}
        >
          {isAdminLogin ? "← Back to User Login" : "Admin Login"}
        </p>

      </div>
    </div>
  );
}

export default Login;