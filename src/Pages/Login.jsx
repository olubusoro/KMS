import React, {useState} from "react";
import "./Login.css";
import Logo from "../assets/Group.png";
import {MdOutlineEmail} from "react-icons/md";
import {RiLockPasswordLine} from "react-icons/ri";
import Button from "../Props/Button";
import {jwtDecode} from "jwt-decode";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const baseUrl = import.meta.env.VITE_BACKEND_URL || "https://localhost:7161";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${baseUrl}/api/Auth/login`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({email, password}),
      });

      const data = await res.json();

      if (res.ok) {
        const token = data.message;

        // Decode the JWT token
        const decoded = jwtDecode(token);
        console.log("Decoded JWT:", decoded);

        // Extract role from standard or custom claim
        const role =
          decoded.role ||
          decoded[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ];

        const userId =
          decoded.name ||
          decoded[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
    ];

        // Store data in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("userRole", role);
        localStorage.setItem("userId", userId);

        toast.success("Login successful!");

        // Navigate to dashboard layout and refresh to load sidebar correctly
        navigate("/");
        // setTimeout(() => navigate(0), 200); // Refresh after short delay
      } else {
        toast.error(data.message || "Login failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="main">
      <div className="card">
        <div className="card-content">
          <h1 className="title">
            WE SHARE <span>WE GROW</span>
          </h1>
          <div className="card-body">
            <div className="login">
              <h1>WELCOME</h1>
              <form>
                <div className="email">
                  <MdOutlineEmail className="email-icon" />
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="password">
                  <RiLockPasswordLine className="password-icon" />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button
                  label="Login"
                  onClick={handleLogin}
                  type="submit"
                  className="btn hover:bg-green-700"
                />
              </form>
            </div>
            <div className="logo">
              <img src={Logo} alt="logo" />
              <p>"connect with your colleagues with ease"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
