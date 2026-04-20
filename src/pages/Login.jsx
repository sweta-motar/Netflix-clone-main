import { useState } from "react";
import "./Login.css";

function Login({ setUser }) {
  const [isSignup, setIsSignup] = useState(false);
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

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleAuth}>
          {isSignup ? "Sign Up" : "Sign In"}
        </button>

        {/* 🔁 NORMAL SWITCH */}
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