import React, {useState} from "react";
import "./Login.css";
import Logo from "../assets/Group.png";
import {MdOutlineEmail} from "react-icons/md";
import {RiLockPasswordLine} from "react-icons/ri";
import Button from "../Props/Button";
import {jwtDecode} from "jwt-decode";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5085";

// ── Demo accounts (portfolio / recruiter access) ───────────────────────────
const DEMO_ACCOUNTS = [
  { role: "Super Admin", badge: "SA", email: "demo.superadmin@cskms.com", password: "Demo123!" },
  { role: "Admin",       badge: "A",  email: "demo.admin@cskms.com",       password: "Demo123!" },
  { role: "Staff",       badge: "S",  email: "demo.staff@cskms.com",       password: "Demo123!" },
];
// ──────────────────────────────────────────────────────────────────────────

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  /** Pre-fill credentials — user still clicks Login to submit */
  const fillDemo = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    toast("Credentials filled — click Login to continue.", { icon: "🔑" });
  };

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

            {/* RIGHT COLUMN: logo + demo panel */}
            <div className="right-panel">
              <div className="logo">
                <img src={Logo} alt="logo" />
                <p>"connect with your colleagues with ease"</p>
              </div>

              {/* ── Demo Access Panel ─────────────────────────────────── */}
              <div className="demo-panel">
                <div className="demo-panel__header">
                  <span className="demo-panel__badge">DEMO</span>
                  <p className="demo-panel__title">Portfolio / Recruiter Access</p>
                  <p className="demo-panel__subtitle">
                    Click a role to pre-fill credentials, then press&nbsp;<strong>Login</strong>.
                  </p>
                </div>
                <div className="demo-panel__cards">
                  {DEMO_ACCOUNTS.map((account) => (
                    <div key={account.role} className="demo-card">
                      <div className="demo-card__avatar">{account.badge}</div>
                      <div className="demo-card__info">
                        <span className="demo-card__role">{account.role}</span>
                        <span className="demo-card__email">{account.email}</span>
                      </div>
                      <button
                        type="button"
                        className="demo-card__btn"
                        onClick={() => fillDemo(account)}
                      >
                        Login as {account.role}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              {/* ──────────────────────────────────────────────────────── */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
