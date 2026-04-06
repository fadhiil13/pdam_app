"use client";

/**
 * EDIT SERVICE - dengan field status (active/inactive)
 * 
 * Field baru:
 * - status: "active" | "inactive"
 * 
 * Validasi:
 * - min_usage tidak boleh lebih dari max_usage
 * - price tidak boleh negatif
 * - name tidak boleh kosong
 */

import { useState } from "react";
import { Services } from "@/app/types";
import { getCookie } from "cookies-next";
import { FormEvent } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Extend tipe Services dengan field status
type ServicesWithStatus = Services & { status?: "active" | "inactive" };

const EditService = ({ selectedData }: { selectedData: ServicesWithStatus }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: selectedData.name,
    min_usage: selectedData.min_usage,
    max_usage: selectedData.max_usage,
    price: selectedData.price,
    status: (selectedData.status || "active") as "active" | "inactive",
  });

  // Validasi tambahan
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Nama layanan tidak boleh kosong.";
    if (formData.price < 0) newErrors.price = "Harga tidak boleh negatif.";
    if (formData.min_usage < 0) newErrors.min_usage = "Minimal penggunaan tidak boleh negatif.";
    if (formData.max_usage <= formData.min_usage) {
      newErrors.max_usage = "Maksimal harus lebih besar dari minimal.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const token = getCookie("accessToken");
      const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/services/${selectedData.id}`;

      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok || result.success) {
        toast.success("Layanan berhasil diperbarui!");
        setOpen(false);
        router.refresh();
      } else {
        toast.warning(result.message || "Gagal memperbarui layanan");
      }
    } catch (error) {
      toast.error(`Terjadi kesalahan: ${error}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold rounded-lg text-[10px] px-3 py-1 h-auto border border-blue-100">
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-3xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-800">EDIT LAYANAN</DialogTitle>
            <DialogDescription>
              Perbarui rincian tarif, batasan, dan status layanan.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-6">
            {/* Nama Layanan */}
            <div className="grid gap-1">
              <Label className="font-semibold text-slate-700">
                Nama Layanan <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`rounded-xl ${errors.name ? "border-red-300" : "border-slate-200"}`}
                required
              />
              {errors.name && <p className="text-[10px] text-red-400">{errors.name}</p>}
            </div>

            {/* Harga */}
            <div className="grid gap-1">
              <Label className="font-semibold text-slate-700">
                Tarif per m³ (Rp) <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                min={0}
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className={`rounded-xl ${errors.price ? "border-red-300" : "border-slate-200"}`}
                required
              />
              {errors.price && <p className="text-[10px] text-red-400">{errors.price}</p>}
            </div>

            {/* Min & Max Usage */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1">
                <Label className="font-semibold text-slate-700">Min. Pakai (m³)</Label>
                <Input
                  type="number"
                  min={0}
                  value={formData.min_usage}
                  onChange={(e) => setFormData({ ...formData, min_usage: Number(e.target.value) })}
                  className={`rounded-xl ${errors.min_usage ? "border-red-300" : "border-slate-200"}`}
                />
                {errors.min_usage && <p className="text-[10px] text-red-400">{errors.min_usage}</p>}
              </div>
              <div className="grid gap-1">
                <Label className="font-semibold text-slate-700">Max. Pakai (m³)</Label>
                <Input
                  type="number"
                  min={0}
                  value={formData.max_usage}
                  onChange={(e) => setFormData({ ...formData, max_usage: Number(e.target.value) })}
                  className={`rounded-xl ${errors.max_usage ? "border-red-300" : "border-slate-200"}`}
                />
                {errors.max_usage && <p className="text-[10px] text-red-400">{errors.max_usage}</p>}
              </div>
            </div>

            {/* Status Toggle */}
            <div className="grid gap-2">
              <Label className="font-semibold text-slate-700">Status Layanan</Label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: "active" })}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-all ${
                    formData.status === "active"
                      ? "bg-green-600 text-white border-green-600 shadow-md"
                      : "bg-white text-slate-500 border-slate-200 hover:border-green-300"
                  }`}
                >
                  ✓ Aktif
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: "inactive" })}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-all ${
                    formData.status === "inactive"
                      ? "bg-slate-500 text-white border-slate-500 shadow-md"
                      : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"
                  }`}
                >
                  ✗ Nonaktif
                </button>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 border-t pt-4">
            <DialogClose asChild>
              <Button type="button" variant="ghost" className="rounded-xl">Batal</Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 rounded-xl px-8 font-bold text-white"
            >
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditService;