"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCookie } from "cookies-next";
import { toast } from "sonner";

export default function ResetPassword({ selectedData }: { selectedData: any }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      return toast.error("Konfirmasi password tidak cocok!");
    }

    setIsLoading(true);
    try {
      const token = getCookie("accessToken");
      const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/customers/${selectedData.id}`;

      const response = await fetch(url, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json", 
          "app-key": process.env.NEXT_PUBLIC_APP_KEY || "", 
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ password: newPassword }),
      });

      if (response.ok) {
        toast.success(`Password untuk pelanggan ${selectedData.name} berhasil direset!`);
        setOpen(false);
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error("Gagal mereset password pelanggan.");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan jaringan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg text-xs font-bold hover:bg-amber-100 transition-colors border border-amber-100">
          Reset PW
        </button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md rounded-3xl border-slate-100 shadow-2xl">
        <form onSubmit={handleReset} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center uppercase tracking-tight text-slate-800">
              Reset Password Pelanggan
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-2 text-sm font-medium text-slate-600">
            <p className="text-xs text-center text-slate-400 bg-slate-50 p-3 rounded-xl border border-dashed border-slate-200">
              Pelanggan: <span className="font-bold text-slate-700">{selectedData.name}</span> <br/>
              ID: <span className="font-mono">{String(selectedData.id).padStart(3, '0')}</span>
            </p>
            
            <div className="grid gap-1">
              <Label>Password Baru</Label>
              <Input 
                type="password" 
                placeholder="******" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required 
                className="rounded-xl border-slate-200" 
              />
            </div>

            <div className="grid gap-1">
              <Label>Konfirmasi Password</Label>
              <Input 
                type="password" 
                placeholder="******" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              className="bg-amber-600 hover:bg-amber-700 rounded-xl font-bold flex-1 text-white shadow-lg"
            >
              {isLoading ? "Proses..." : "Update Password"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}