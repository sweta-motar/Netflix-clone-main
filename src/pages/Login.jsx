import { useState } from "react";
import "./Login.css";

function Login({ setUser }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Alphanumeric validation
  const isValidPassword = (pwd) => {
    return /^[a-zA-Z0-9]+$/.test(pwd);
  };

  const handleAuth = async () => {
    // 🔒 Validate password before API call
    if (!isValidPassword(password)) {
      alert("Password must be alphanumeric (no special characters)");
      return;
    }

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
        localStorage.setItem("user_id", data.user_id);
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

        <h1>{isSignup ? "Sign Up" : "Sign In"}</h1>

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* 🔐 Password + Show/Hide */}
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password (Alphanumeric only)"
            onChange={(e) => setPassword(e.target.value)}
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "10px",
              top: "12px",
              cursor: "pointer",
              fontSize: "12px",
              color: "gray"
            }}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        <button onClick={handleAuth}>
          {isSignup ? "Sign Up" : "Sign In"}
        </button>

        <p className="switch">
          {isSignup
            ? "Already have an account? "
            : "New to Netflix? "}
          <span onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? "Sign In" : "Sign Up now"}
          </span>
        </p>

      </div>
    </div>
  );
}

export default Login;