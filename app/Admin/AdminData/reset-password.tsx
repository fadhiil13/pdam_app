"use client";

/**
 * RESET PASSWORD ADMIN
 * 
 * Alur:
 * 1. User mengisi password baru + konfirmasi
 * 2. Validasi: password cocok, minimal 6 karakter
 * 3. Kirim ke API → backend yang melakukan bcrypt hashing
 * 
 * CATATAN PENTING:
 * Hashing TIDAK dilakukan di frontend karena:
 * - Tidak aman (user bisa manipulasi hash)
 * - Backend (NestJS/Express) yang harus hash menggunakan bcrypt
 * - Frontend hanya kirim plain password lewat HTTPS
 */

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCookie } from "cookies-next";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type AdminData = {
  id: number;
  name: string;
};

export default function ResetPassword({ selectedData }: { selectedData: AdminData }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  // Reset state saat dialog ditutup
  const handleOpenChange = (val: boolean) => {
    if (!val) {
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswords(false);
    }
    setOpen(val);
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi 1: Password tidak boleh kosong
    if (!newPassword.trim()) {
      return toast.error("Password baru tidak boleh kosong.");
    }

    // Validasi 2: Minimal 6 karakter
    if (newPassword.length < 6) {
      return toast.error("Password minimal 6 karakter.");
    }

    // Validasi 3: Password harus cocok
    if (newPassword !== confirmPassword) {
      return toast.error("Konfirmasi password tidak cocok!");
    }

    setIsLoading(true);
    try {
      const token = getCookie("accessToken");

      // Endpoint reset password admin
      // Backend akan menerima { password: "plaintext" } lalu melakukan bcrypt.hash()
      const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/admins/${selectedData.id}`;

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
          Authorization: `Bearer ${token}`,
        },
        // Hanya kirim password — backend yang hash dengan bcrypt
        body: JSON.stringify({ password: newPassword }),
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok) {
        toast.success(`Password ${selectedData.name} berhasil direset!`);
        handleOpenChange(false);
        router.refresh();
      } else {
        const errorMsg =
          typeof result?.message === "string"
            ? result.message
            : "Gagal mereset password.";
        toast.error(errorMsg);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan jaringan.");
      console.error("Reset Password Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Indikator kekuatan password
  const getPasswordStrength = (pass: string) => {
    if (pass.length === 0) return null;
    if (pass.length < 6) return { label: "Terlalu pendek", color: "bg-red-400", width: "w-1/4" };
    if (pass.length < 8) return { label: "Lemah", color: "bg-orange-400", width: "w-2/4" };
    if (pass.length < 12) return { label: "Cukup", color: "bg-yellow-400", width: "w-3/4" };
    return { label: "Kuat", color: "bg-green-500", width: "w-full" };
  };

  const strength = getPasswordStrength(newPassword);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button className="px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg text-xs font-bold hover:bg-amber-100 transition-colors border border-amber-100">
          Reset PW
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-3xl border-slate-100 shadow-2xl">
        <form onSubmit={handleReset} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center uppercase tracking-tight text-slate-800">
              Reset Password Admin
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-2 text-sm font-medium text-slate-600">
            {/* Info akun */}
            <div className="text-xs text-center text-slate-400 bg-slate-50 p-3 rounded-xl border border-dashed border-slate-200">
              Mengubah password untuk akun: <br />
              <span className="font-bold text-slate-700">{selectedData.name}</span>
            </div>

            {/* Toggle lihat password */}
            <div className="flex items-center justify-end gap-2">
              <input
                type="checkbox"
                id="show-pw"
                checked={showPasswords}
                onChange={(e) => setShowPasswords(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="show-pw" className="text-xs text-slate-500 cursor-pointer">
                Tampilkan password
              </label>
            </div>

            {/* Input Password Baru */}
            <div className="grid gap-1">
              <Label htmlFor="new-pass">Password Baru</Label>
              <Input
                id="new-pass"
                type={showPasswords ? "text" : "password"}
                placeholder="Minimal 6 karakter"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="rounded-xl border-slate-200"
              />
              {/* Indikator kekuatan password */}
              {strength && (
                <div className="space-y-1 mt-1">
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">{strength.label}</p>
                </div>
              )}
            </div>

            {/* Input Konfirmasi Password */}
            <div className="grid gap-1">
              <Label htmlFor="confirm-pass">Konfirmasi Password</Label>
              <Input
                id="confirm-pass"
                type={showPasswords ? "text" : "password"}
                placeholder="Ulangi password baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={`rounded-xl ${
                  confirmPassword && newPassword !== confirmPassword
                    ? "border-red-300 focus:border-red-400"
                    : confirmPassword && newPassword === confirmPassword
                    ? "border-green-300 focus:border-green-400"
                    : "border-slate-200"
                }`}
              />
              {/* Feedback cocok/tidak cocok */}
              {confirmPassword && (
                <p
                  className={`text-[10px] ${
                    newPassword === confirmPassword
                      ? "text-green-500"
                      : "text-red-400"
                  }`}
                >
                  {newPassword === confirmPassword
                    ? "✓ Password cocok"
                    : "✗ Password tidak cocok"}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="flex gap-2 pt-4 border-t border-slate-50">
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                className="rounded-xl flex-1"
                disabled={isLoading}
              >
                Batal
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isLoading || newPassword !== confirmPassword || newPassword.length < 6}
              className="bg-amber-600 hover:bg-amber-700 rounded-xl font-bold flex-1 text-white shadow-lg disabled:opacity-60"
            >
              {isLoading ? "Memproses..." : "Update Password"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}