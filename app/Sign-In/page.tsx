"use client";

import { useState } from "react";
import { storeCookie } from "@/lib/client-cookies";
import { Loader2, CheckCircle2, Lock, User, AlertCircle, Eye, EyeOff } from "lucide-react";

export default function SignInPage() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Status state: idle | loading | success | error
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const payload = JSON.stringify({ username, password });
      
      /** * PENTING: Cek alamat ini di Network Tab (F12)
       * Jika 404, coba ganti '/api/auth' menjadi '/api/login' 
       */
      const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth`; 
      
      const response = await fetch(url, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
          "app-key": `${process.env.NEXT_PUBLIC_APP_KEY}`,
        },
        body: payload,
      });

      const responseData = await response.json();

      // DEBUG: Lihat di console browser (F12) apa isi dari database
      console.log("Respon Database:", responseData);

      if (!response.ok) {
        setStatus("error");
        setMessage(responseData.message || "Username atau Password salah!");
        return;
      }

      // JIKA BERHASIL LOGIN
      setStatus("success");
      storeCookie('accessToken', responseData.token, 1);

      // Normalisasi Role (biar nggak sensitif huruf besar/kecil)
      const userRole = responseData.role?.toUpperCase();

      // Kasih jeda 1.5 detik biar user lihat animasi suksesnya
      setTimeout(() => {
        if (userRole === "ADMIN") {
          window.location.href = "/Admin/Dashboard";
        } else {
          // Jika role bukan admin, arahkan ke dashboard pelanggan atau home
          window.location.href = "/Admin/CustomerData"; 
        }
      }, 1500);

    } catch (error) {
      console.error("error during login:", error);
      setStatus("error");
      setMessage("Koneksi server terputus atau API tidak merespon.");
    }
  }

  return (
    <div className="w-full h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl shadow-blue-100 border border-slate-100 p-8 md:p-10 transition-all relative overflow-hidden">
        
        {/* AKSEN DEKORASI */}
        <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>

        {/* STATE SUKSES: Tampilan saat berhasil login */}
        {status === "success" ? (
          <div className="py-12 text-center animate-in zoom-in duration-500">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-5 rounded-full">
                <CheckCircle2 className="text-green-500 w-16 h-16 animate-bounce" />
              </div>
            </div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Login Berhasil!</h2>
            <p className="text-slate-500 mt-3 font-medium">Mengarahkan Anda ke Dashboard...</p>
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="text-center mb-10">
              <div className="bg-blue-600 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-200">
                <Lock className="text-white w-8 h-8" />
              </div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">Sign In Admin</h1>
              <p className="text-slate-400 text-sm mt-2 font-semibold uppercase tracking-widest">Digital PDAM System</p>
            </div>

            {/* ERROR MESSAGE */}
            {status === "error" && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-xl flex items-center gap-3 animate-in slide-in-from-top duration-300">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="font-bold">{message}</span>
              </div>
            )}

            {/* FORM LOGIN */}
            <form onSubmit={handleSignIn} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Username</label>
                <div className="relative group">
                  <User className="absolute left-4 top-4 text-slate-300 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Contoh: admin_pdam"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-blue-400 transition-all font-bold"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-4 text-slate-300 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-blue-400 transition-all font-bold"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-slate-300 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-blue-600 text-white py-4 font-black rounded-2xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-xl shadow-blue-500/30 disabled:opacity-50 flex items-center justify-center gap-3 text-lg"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Checking Account...
                  </>
                ) : (
                  "Masuk Ke Sistem"
                )}
              </button>
            </form>
          </>
        )}

        {/* FOOTER */}
        <div className="mt-12 text-center">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
            SMK TELKOM MALANG • PDAM APP v3.0
          </p>
        </div>
      </div>
    </div>
  );
}