"use client";

import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogTrigger, 
  DialogFooter, 
  DialogClose 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function EditAdmin({ selectedData }: { selectedData: any }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: ""
  });

  useEffect(() => {
    if (open) {
      setFormData({
        name: selectedData.name || "",
        phone: selectedData.phone || ""
      });
    }
  }, [open, selectedData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = getCookie("accessToken");
      
      // JALUR API: Sesuaikan dengan endpoint server (admin tanpa s untuk update)
      const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/admin/${selectedData.id}`;

      const response = await fetch(url, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json", 
          "app-key": process.env.NEXT_PUBLIC_APP_KEY || "", 
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(`Berhasil memperbarui data!`);
        setOpen(false);
        router.refresh();
      } else {
        toast.error("Gagal update ke database.");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan koneksi.");
    } finally {
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
            <div className="grid gap-1">
              <Label>Nama Lengkap</Label>
              <Input 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                required 
                className="rounded-xl border-slate-200" 
              />
            </div>
            
            <div className="grid gap-1">
              <Label>Nomor Handphone</Label>
              <Input 
                value={formData.phone} 
                onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                required 
                className="rounded-xl border-slate-200" 
              />
            </div>
          </div>

          <DialogFooter className="flex gap-2 pt-4 border-t border-slate-50">
            <DialogClose asChild>
              <Button type="button" variant="ghost" className="rounded-xl flex-1">Batal</Button>
            </DialogClose>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 rounded-xl font-bold flex-1 text-white shadow-lg"
            >
              {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}