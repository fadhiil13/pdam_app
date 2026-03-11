"use client";

import { getCookie } from "cookies-next";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const AddService = () => {
  const router = useRouter();

  // State untuk kontrol modal agar bisa tertutup otomatis
  const [open, setOpen] = useState(false);
  
  const [name, setName] = useState<string>("");
  const [minUsage, setMinUsage] = useState<number>(0);
  const [maxUsage, setMaxUsage] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const Token = getCookie("accessToken"); // Cookies-next biasanya tidak butuh await
      const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/services`; // Pastikan huruf kecil 'services'

      // Payload disesuaikan dengan standar API (snake_case)
      const payload = JSON.stringify({
        name,
        min_usage: minUsage, // Diubah agar sesuai database
        max_usage: maxUsage, // Diubah agar sesuai database
        price,
      });

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
          Authorization: `Bearer ${Token}`,
        },
        body: payload,
      });

      const result = await response.json();

      if (response.ok || result.success) {
        setOpen(false); // Modal tertutup otomatis
        toast.success("Layanan Berhasil Ditambahkan!");
        
        // Reset Form
        setName("");
        setMinUsage(0);
        setMaxUsage(0);
        setPrice(0);

        // Refresh data di halaman tanpa reload penuh
        router.refresh();
      } else {
        toast.warning(result.message || "Gagal menyimpan data");
      }
    } catch (error) {
      toast.error(`Terjadi kesalahan: ${error}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* Tombol disesuaikan agar seragam dengan tema Biru Modern */}
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl px-6">
          + Tambah Layanan
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md rounded-3xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-800">TAMBAH LAYANAN</DialogTitle>
            <DialogDescription>
              Isi detail tarif dan batasan penggunaan air untuk kategori layanan baru ini.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="font-semibold">Nama Layanan</Label>
              <Input
                id="name"
                placeholder="Contoh: Rumah Tangga A"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl border-slate-200 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="price" className="font-semibold">Tarif per m³ (Rp)</Label>
              <Input
                id="price"
                type="number"
                placeholder="0"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="rounded-xl border-slate-200"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="min_usage" className="font-semibold">Min. Pakai</Label>
                <Input
                  id="min_usage"
                  type="number"
                  value={minUsage}
                  onChange={(e) => setMinUsage(Number(e.target.value))}
                  className="rounded-xl border-slate-200"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="max_usage" className="font-semibold">Max. Pakai</Label>
                <Input
                  id="max_usage"
                  type="number"
                  value={maxUsage}
                  onChange={(e) => setMaxUsage(Number(e.target.value))}
                  className="rounded-xl border-slate-200"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button type="button" variant="ghost" className="rounded-xl">Batal</Button>
            </DialogClose>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 rounded-xl px-8 font-bold">
              Simpan Data
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddService;