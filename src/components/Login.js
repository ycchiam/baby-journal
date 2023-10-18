// Login.js
import { GoogleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React from "react";
import { auth } from "../firebase";

function Login() {
  const handleLogin = async () => {
    // const auth = getAuth();
    console.log(auth);
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      // Once the user logs in, you can get their info with auth.currentUser or listen to auth state changes.
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Button type="primary" icon={<GoogleOutlined />} onClick={handleLogin}>
        Sign in with Google
      </Button>
    </div>
  );
}

export default Login;
