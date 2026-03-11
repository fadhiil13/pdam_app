"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AddAdmin() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", username: "", phone: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getCookie("accessToken");
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/admins`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        "app-key": process.env.NEXT_PUBLIC_APP_KEY || "", 
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      toast.success("Admin Baru Berhasil Ditambahkan!");
      setOpen(false);
      setFormData({ name: "", username: "", phone: "", password: "" }); // Reset form
      router.refresh();
    } else {
      toast.error("Gagal menambah admin. Cek kembali data Anda.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl px-6 py-6 shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
          + Tambah Admin Baru
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-3xl border-slate-100 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-800 text-center uppercase tracking-tight">Tambah Administrator</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2 text-sm font-medium text-slate-600">
            <div className="grid gap-1">
              <Label>Nama Lengkap</Label>
              <Input placeholder="Nama Admin" onChange={(e) => setFormData({...formData, name: e.target.value})} required className="rounded-xl border-slate-200" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1">
                <Label>Username</Label>
                <Input placeholder="Username" onChange={(e) => setFormData({...formData, username: e.target.value})} required className="rounded-xl border-slate-200" />
              </div>
              <div className="grid gap-1">
                <Label>Password</Label>
                <Input type="password" placeholder="******" onChange={(e) => setFormData({...formData, password: e.target.value})} required className="rounded-xl border-slate-200" />
              </div>
            </div>
            <div className="grid gap-1">
              <Label>Nomor Handphone</Label>
              <Input placeholder="0812345678" onChange={(e) => setFormData({...formData, phone: e.target.value})} required className="rounded-xl border-slate-200" />
            </div>
          </div>
          <DialogFooter className="flex gap-2 pt-4 border-t border-slate-50">
            <DialogClose asChild><Button variant="ghost" className="rounded-xl flex-1">Batal</Button></DialogClose>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 rounded-xl font-bold flex-1 text-white shadow-lg shadow-blue-200">Simpan Admin</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}