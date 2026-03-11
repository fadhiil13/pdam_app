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

const AddCustomer = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  
  // State Form
  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [phone, setPhone] = useState<string>(""); // <--- STATE BARU
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [customerNumber, setCustomerNumber] = useState<string>("");
  const [serviceId, setServiceId] = useState<number>(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const Token = getCookie("accessToken");
      const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/customers`;;

      const payload = JSON.stringify({
        name,
        address,
        phone, // <--- KIRIM KE DATABASE
        username,
        password,
        customer_number: customerNumber,
        service_id: Number(serviceId),
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

      if (response.ok) {
        setOpen(false);
        toast.success("Pelanggan Berhasil Didaftarkan!");
        // Reset Form
        setName(""); setAddress(""); setPhone(""); 
        setUsername(""); setPassword(""); setCustomerNumber("");
        router.refresh();
      } else {
        toast.warning("Gagal menyimpan data.");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl px-6 py-6 shadow-lg active:scale-95 transition-all">
          + Registrasi Pelanggan
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md rounded-3xl border-slate-100 shadow-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-800 tracking-tight text-center">REGISTRASI PELANGGAN</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-6">
            <div className="grid gap-1">
              <Label className="font-semibold text-slate-700">Nama Lengkap</Label>
              <Input placeholder="Nama Pelanggan" value={name} onChange={(e) => setName(e.target.value)} required className="rounded-xl" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="grid gap-1">
                  <Label className="font-semibold text-slate-700">Nomor HP</Label>
                  <Input placeholder="0812..." value={phone} onChange={(e) => setPhone(e.target.value)} required className="rounded-xl" />
               </div>
               <div className="grid gap-1">
                  <Label className="font-semibold text-slate-700">ID Pelanggan</Label>
                  <Input placeholder="001" value={customerNumber} onChange={(e) => setCustomerNumber(e.target.value)} required className="rounded-xl" />
               </div>
            </div>

            <div className="grid gap-1">
              <Label className="font-semibold text-slate-700">Alamat</Label>
              <Input placeholder="Alamat rumah" value={address} onChange={(e) => setAddress(e.target.value)} required className="rounded-xl" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1">
                <Label className="font-semibold text-slate-700">Username</Label>
                <Input placeholder="User Login" value={username} onChange={(e) => setUsername(e.target.value)} required className="rounded-xl" />
              </div>
              <div className="grid gap-1">
                <Label className="font-semibold text-slate-700">Password</Label>
                <Input type="password" placeholder="***" value={password} onChange={(e) => setPassword(e.target.value)} required className="rounded-xl" />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <DialogClose asChild><Button variant="ghost" className="rounded-xl flex-1">Batal</Button></DialogClose>
            <Button type="submit" className="bg-blue-600 rounded-xl font-bold flex-1 text-white">Simpan Data</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomer;