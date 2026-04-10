import { useState } from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
import "./Login.css";

function Login({ setUser }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAuth = async () => {
    try {
      let userCredential;

      if (isSignup) {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
      } else {
        userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
      }

      setUser(userCredential.user); // ✅ FIXED
    } catch (error) {
      alert(error.message);
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

        <p onClick={() => setIsSignup(!isSignup)}>
          {isSignup
            ? "Already have an account? Sign In"
            : "New to Netflix? Sign Up now"}
        </p>
      </div>
    </div>
  );
}

export default Login;