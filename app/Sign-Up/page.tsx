"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, UserPlus, Lock, User, Phone, BadgeCheck } from "lucide-react";

export default function SignUpPage() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  // Status state: idle | loading | success | error
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const payload = JSON.stringify({ username, password, name, phone });
      
      // PASTIKAN JALUR API BENAR (tambahkan /api jika perlu)
      const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/admins`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "app-key": `${process.env.NEXT_PUBLIC_APP_KEY}`,
        },
        body: payload,
      });

      const responseData = await response.json();

      if (!response.ok) {
        setStatus("error");
        setMessage(responseData.message || "Gagal registrasi. Username mungkin sudah ada.");
        return;
      }

      // JIKA BERHASIL
      setStatus("success");
      
      // Delay 2 detik sebelum pindah ke Login agar user lihat animasi suksesnya
      setTimeout(() => {
        window.location.href = "/Sign-In"; // Sesuaikan jalur login kamu
      }, 2000);

    } catch (error) {
      console.error("Error during sign up:", error);
      setStatus("error");
      setMessage("Terjadi kesalahan jaringan.");
    }
  }

  return (
    <div className="w-full h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl shadow-blue-100 border border-slate-100 p-8 md:p-10 transition-all relative overflow-hidden">
        
        {/* AKSEN GARIS ATAS */}
        <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>

        {/* STATE SUKSES */}
        {status === "success" ? (
          <div className="py-12 text-center animate-in zoom-in duration-500">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-5 rounded-full">
                <CheckCircle2 className="text-green-500 w-16 h-16 animate-bounce" />
              </div>
            </div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Akun Terdaftar!</h2>
            <p className="text-slate-500 mt-3 font-medium">Data Admin berhasil disimpan. <br/> Mengalihkan ke halaman Login...</p>
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="text-center mb-8">
              <div className="bg-blue-600 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-xl shadow-blue-200">
                <UserPlus className="text-white w-8 h-8" />
              </div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">Register Admin</h1>
              <p className="text-slate-400 text-sm mt-2 font-semibold uppercase tracking-widest">Buat Akses Administrator Baru</p>
            </div>

            {/* ERROR FEEDBACK */}
            {status === "error" && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-xl font-bold animate-in fade-in duration-300">
                ⚠️ {message}
              </div>
            )}

            {/* FORM REGISTRASI */}
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Kolom Nama */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative group">
                    <BadgeCheck className="absolute left-4 top-3.5 text-slate-300 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="text"
                      placeholder="Nama Lengkap"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all font-bold"
                      required
                    />
                  </div>
                </div>

                {/* Kolom Phone */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-3.5 text-slate-300 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="text"
                      placeholder="0812..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all font-bold"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Username */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
                <div className="relative group">
                  <User className="absolute left-4 top-3.5 text-slate-300 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Username Akun"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all font-bold"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-3.5 text-slate-300 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all font-bold"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-blue-600 text-white py-4 mt-4 font-black rounded-2xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-xl shadow-blue-500/30 disabled:opacity-50 flex items-center justify-center gap-3 text-lg"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Mendaftarkan...
                  </>
                ) : (
                  "Buat Akun Sekarang"
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500 font-medium">
                Sudah punya akun?{" "}
                <a href="/auth/signin" className="text-blue-600 font-black hover:underline">
                  Login di sini
                </a>
              </p>
            </div>
          </>
        )}

        {/* FOOTER */}
        <div className="mt-10 text-center">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
            Digital PDAM System • SMK Telkom Malang
          </p>
        </div>
      </div>
    </div>
  );
}