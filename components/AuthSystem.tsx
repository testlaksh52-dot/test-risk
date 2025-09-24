"use client";

import { useState, useEffect, useRef } from "react";
import { mockDataStore, User } from "@/lib/mockDataStore";

interface AuthSystemProps {
  onLogin: (user: User) => void;
  onLogout: () => void;
}

const AuthSystem = ({ onLogin, onLogout }: AuthSystemProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only run once on mount
    if (hasInitialized.current) return;

    // Check for existing session
    const savedUser = localStorage.getItem("cora-user");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
        onLogin(user);
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("cora-user");
        setShowLogin(true);
      }
    } else {
      setShowLogin(true);
    }

    hasInitialized.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    const user = mockDataStore.authenticateUser(
      loginForm.username,
      loginForm.password
    );
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      setShowLogin(false);
      localStorage.setItem("cora-user", JSON.stringify(user));
      onLogin(user);
    } else {
      setLoginError("Invalid username or password");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("cora-user");
    onLogout();
  };

  if (!isAuthenticated || showLogin) {
    return (
      <div
        className="fixed inset-0 bg-navy-darker flex items-center justify-center z-[99999]"
        style={{
          backgroundImage:
            'url("https://staging.ampliforcehub.com/_next/static/media/background%20dots.bd991869.jpg")',
        }}
      >
        <div className="bg-glass-aurora backdrop-blur-sm rounded-2xl border border-glass-border shadow-2xl p-8 w-96">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-glass-mystic backdrop-blur-sm rounded-xl border border-glass-border shadow-lg flex items-center justify-center mx-auto mb-4">
              <img
                src="/images/logos/amp.png"
                alt="Logo"
                width={32}
                height={32}
              />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">CORA</h1>
            <p className="text-gray-300 text-sm">
              Control & Risk Analytics Platform
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, username: e.target.value })
                }
                className="w-full bg-glass-aurora backdrop-blur-sm text-white px-4 py-3 rounded-xl border border-glass-border focus:ring-2 focus:ring-cora-blue focus:border-cora-blue transition-colors"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
                className="w-full bg-glass-aurora backdrop-blur-sm text-white px-4 py-3 rounded-xl border border-glass-border focus:ring-2 focus:ring-cora-blue focus:border-cora-blue transition-colors"
                placeholder="Enter your password"
                required
              />
            </div>

            {loginError && (
              <div className="text-cora-red text-sm bg-cora-red/10 border border-cortex-red/20 rounded-lg p-3">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-cora-blue text-white py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-xs mb-3">Demo Credentials:</p>
            <div className="space-y-1 text-xs text-gray-300">
              <div>1LOD: john.smith / password123</div>
              <div>Data Owner: sarah.jones / password123</div>
              <div>2LOD: mike.wilson / password123</div>
              <div>Manager: lisa.brown / password123</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthSystem;
