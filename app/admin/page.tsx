"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, Key, Mail, Sparkles, AlertCircle } from "lucide-react";
import axios from "axios";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      router.push("/admin/dashboard");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post("/api/admin/login", { email, password });
      const data = res.data;

      if (data.success) {
        localStorage.setItem("admin_token", data.token);
        router.push("/admin/dashboard");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen flex items-center justify-center pt-24 pb-16 relative">
      <div className="absolute top-[10%] left-[-10%] w-[300px] h-[300px] bg-gold/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full px-6 relative z-10">
        <div className="p-8 sm:p-10 rounded-2xl bg-charcoal border border-gold/15 shadow-2xl flex flex-col items-center">
          {/* Top Shield */}
          <div className="p-4 bg-gold/10 rounded-full border border-gold/30 text-gold mb-6 animate-pulse">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <h1 className="font-serif text-3xl font-bold tracking-wide text-white text-center">
            CMS Portal
          </h1>
          <p className="text-white/50 text-xs sm:text-sm text-center font-light mt-2 leading-relaxed">
            Authorized administrator access only. Enter secure keys to moderate website content & view client leads.
          </p>

          {error && (
            <div className="w-full mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="w-full space-y-5 mt-8">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-white/70 uppercase tracking-wider flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gold" />
                <span>Admin Email</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@skysfx.com"
                className="w-full px-4 py-3 bg-black border border-white/10 hover:border-gold/30 focus:border-gold rounded-lg outline-none text-white text-sm transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-white/70 uppercase tracking-wider flex items-center gap-2">
                <Key className="w-3.5 h-3.5 text-gold" />
                <span>Security Passkey</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-black border border-white/10 hover:border-gold/30 focus:border-gold rounded-lg outline-none text-white text-sm transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gold hover:bg-gold-hover text-black font-bold uppercase tracking-wider text-xs sm:text-sm rounded-lg transition-all duration-300 shadow-lg gold-glow-btn flex items-center justify-center gap-2 mt-4 clickable"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <Sparkles className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
