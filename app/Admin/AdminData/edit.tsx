"use client";

/**
 * PERBAIKAN:
 * 1. URL endpoint diperbaiki dari `/api/admin/${id}` → `/admins/${id}`
 * 2. useEffect memastikan form selalu sinkron dengan data terbaru saat dialog dibuka
 * 3. Konsistensi header key: "APP-KEY" (kapital) sesuai standar backend
 * 4. Loading state + error handling lebih lengkap
 */

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Tipe data yang diterima komponen ini
type AdminData = {
  id: number;
  name: string;
  phone: string;
  user?: { username: string };
};

export default function EditAdmin({ selectedData }: { selectedData: AdminData }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // State form dengan nilai awal kosong
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  // PERBAIKAN: Sync form dengan data terbaru setiap kali dialog dibuka
  // Ini memastikan form tidak menampilkan data lama
  useEffect(() => {
    if (open && selectedData) {
      setFormData({
        name: selectedData.name ?? "",
        phone: selectedData.phone ?? "",
      });
    }
  }, [open, selectedData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi sederhana di sisi client
    if (!formData.name.trim()) {
      return toast.error("Nama tidak boleh kosong.");
    }
    if (!formData.phone.trim()) {
      return toast.error("Nomor HP tidak boleh kosong.");
    }

    setIsLoading(true);

    try {
      const token = getCookie("accessToken");

      // PERBAIKAN UTAMA: URL endpoint yang benar
      // Sebelumnya: `/api/admin/${selectedData.id}` → SALAH
      // Sekarang:   `/admins/${selectedData.id}`    → BENAR
      const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/admins/${selectedData.id}`;

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // PERBAIKAN: Konsisten menggunakan "APP-KEY" kapital
          "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
        }),
      });

      // Parse response body untuk mendapatkan pesan error dari server
      const result = await response.json().catch(() => ({}));

      if (response.ok) {
        toast.success("Data admin berhasil diperbarui!");
        setOpen(false);
        // router.refresh() memberitahu Next.js untuk fetch ulang data server component
        router.refresh();
      } else {
        // Tampilkan pesan error spesifik dari server jika ada
        const errorMsg =
          typeof result?.message === "string"
            ? result.message
            : Array.isArray(result?.message)
            ? result.message.join(", ")
            : "Gagal memperbarui data. Coba lagi.";
        toast.error(errorMsg);
      }
    } catch (error) {
      // Error jaringan atau server tidak merespon
      toast.error("Terjadi kesalahan koneksi. Pastikan server berjalan.");
      console.error("Edit Admin Error:", error);
    } finally {
      // Selalu matikan loading state, apapun hasilnya
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-[10px] px-3 py-1.5 rounded-lg border border-blue-100 h-auto transition-all">
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-3xl border-slate-100 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-slate-800 uppercase tracking-tight">
              Edit Admin
            </DialogTitle>
            <DialogDescription className="text-center text-xs text-slate-500">
              Perbarui informasi administrator ini.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2 text-sm font-medium text-slate-600">
            {/* Field Nama */}
            <div className="grid gap-1">
              <Label htmlFor="edit-admin-name">Nama Lengkap</Label>
              <Input
                id="edit-admin-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Masukkan nama lengkap"
                required
                className="rounded-xl border-slate-200"
              />
            </div>

            {/* Field Nomor HP */}
            <div className="grid gap-1">
              <Label htmlFor="edit-admin-phone">Nomor Handphone</Label>
              <Input
                id="edit-admin-phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="0812345678"
                required
                className="rounded-xl border-slate-200"
              />
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
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 rounded-xl font-bold flex-1 text-white shadow-lg disabled:opacity-60"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Menyimpan...
                </span>
              ) : (
                "Simpan Perubahan"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}