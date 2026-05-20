import { useState } from "react";
import "./Login.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

function Login({ setUser }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleAuth = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail === "" || password === "") { alert("Enter email and password"); return; }
    const url = isSignup ? API + "/signup/" : API + "/login/";
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password })
      });
      const data = await res.json();
      if (res.ok && data.user_id) {
        localStorage.setItem("user_id", data.user_id);
        setUser(data.user_id);
      } else {
        alert(data.error || "Login failed");
      }
    } catch (err) {
      alert("Server error. Please check if Django backend is running.");
    }
  };

  const handleForgot = async () => {
    if (resetEmail === "" || newPassword === "") { alert("Fill all fields"); return; }
    try {
      const res = await fetch(API + "/reset-password/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail.trim().toLowerCase(), new_password: newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Password reset successful! Please sign in.");
        setShowForgot(false);
        setResetEmail("");
        setNewPassword("");
      } else {
        alert(data.error || "Reset failed");
      }
    } catch (err) {
      alert("Server error.");
    }
  };

  return (
    <div className="login">
      <div className="login-overlay"></div>
      <h1 className="login-logo">NETFLIX</h1>
      <div className="login-box">
        <h1>{isSignup ? "Sign Up" : "Sign In"}</h1>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <span onClick={() => setShowPassword(prev => prev === false ? true : false)} className="show-pass">
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>
        <button onClick={handleAuth}>{isSignup ? "Sign Up" : "Sign In"}</button>
        {isSignup === false && (
          <p className="forgot" onClick={() => setShowForgot(true)}>Forgot Password?</p>
        )}
        <p className="switch">
          {isSignup ? "Already have an account? " : "New to Netflix? "}
          <span onClick={() => setIsSignup(prev => prev === false ? true : false)}>
            {isSignup ? "Sign In" : "Sign Up now"}
          </span>
        </p>
      </div>
      {showForgot && (
        <div className="forgot-overlay">
          <div className="forgot-box">
            <h2>Reset Password</h2>
            <input placeholder="Enter your email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} />
            <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <button onClick={handleForgot}>Reset Password</button>
            <button className="cancel-btn" onClick={() => setShowForgot(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
