"use client";

import { Services } from "@/app/types";
import { getCookie } from "cookies-next"; // Konsisten menggunakan cookies-next
import { FormEvent, useState } from "react";
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

const EditService = ({ selectedData }: { selectedData: Services }) => {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  
  // Inisialisasi state langsung dari data yang dipilih
  const [name, setName] = useState<string>(selectedData.name);
  const [min_usage, setMinUsage] = useState<number>(selectedData.min_usage);
  const [max_usage, setMaxUsage] = useState<number>(selectedData.max_usage);
  const [price, setPrice] = useState<number>(selectedData.price);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const token = getCookie("accessToken"); // Pastikan key 'accessToken' sama dengan file lain
      const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/services/${selectedData.id}`;
      
      const payload = JSON.stringify({
        name,
        min_usage,
        max_usage,
        price,
      });

      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });

      const result = await response.json();

      if (response.ok || result.success) {
        toast.success(result.message || "Layanan berhasil diperbarui!");
        setOpen(false); // Modal tutup otomatis
        router.refresh(); // Refresh data tabel
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
        {/* Tombol Edit dibuat lebih kecil dan elegan untuk di dalam tabel */}
        <Button
          className="bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold rounded-lg text-[10px] px-3 py-1"
        >
          Edit
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md rounded-3xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-800">EDIT LAYANAN</DialogTitle>
            <DialogDescription>
              Perbarui rincian tarif atau batasan penggunaan untuk layanan ini.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-6">
            <div className="grid gap-2">
              <Label htmlFor="name" className="font-semibold text-slate-700">Nama Layanan</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl border-slate-200 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="price" className="font-semibold text-slate-700">Tarif per m³ (Rp)</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="rounded-xl border-slate-200"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="min_usage" className="font-semibold text-slate-700">Min. Pakai</Label>
                <Input
                  id="min_usage"
                  type="number"
                  value={min_usage}
                  onChange={(e) => setMinUsage(Number(e.target.value))}
                  className="rounded-xl border-slate-200"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="max_usage" className="font-semibold text-slate-700">Max. Pakai</Label>
                <Input
                  id="max_usage"
                  type="number"
                  value={max_usage}
                  onChange={(e) => setMaxUsage(Number(e.target.value))}
                  className="rounded-xl border-slate-200"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 border-t pt-4">
            <DialogClose asChild>
              <Button type="button" variant="ghost" className="rounded-xl">Batal</Button>
            </DialogClose>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 rounded-xl px-8 font-bold text-white">
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditService;