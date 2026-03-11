"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function EditCustomer({ selectedData }: { selectedData: any }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Selalu gunakan fallback "" agar tidak pernah undefined (mencegah uncontrolled→controlled warning)
  const [formData, setFormData] = useState({
    name: selectedData?.name ?? "",
    address: selectedData?.address ?? "",
    phone: selectedData?.phone ?? "",
  });

  // ✅ Reset form ke data terbaru setiap kali dialog dibuka
  const handleOpenChange = (val: boolean) => {
    if (val) {
      setFormData({
        name: selectedData?.name ?? "",
        address: selectedData?.address ?? "",
        phone: selectedData?.phone ?? "",
      });
    }
    setOpen(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const getCookieValue = (name: string) => {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? decodeURIComponent(match[2]) : null;
      };

      const token = getCookieValue("accessToken");

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/customers/${selectedData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",  // ✅ huruf kapital
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          address: formData.address,
          phone: formData.phone,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok) {
        toast.success("Perubahan Disimpan!");
        setOpen(false);
        router.refresh();
      } else {
        const errorMsg =
          typeof result?.message === "string" ? result.message
          : Array.isArray(result?.message) ? result.message.join(", ")
          : JSON.stringify(result);
        toast.error(`Gagal: ${errorMsg}`);
      }
    } catch (err: any) {
      toast.error(`Error: ${err?.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-[10px] px-3 py-1 rounded-lg h-auto">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-3xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">EDIT PELANGGAN</DialogTitle>
          </DialogHeader>

          <div className="grid gap-3 py-2 text-sm">
            <div className="grid gap-1">
              <Label>Nama Lengkap</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="rounded-xl"
              />
            </div>
            <div className="grid gap-1">
              <Label>Alamat</Label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
                className="rounded-xl"
              />
            </div>
            <div className="grid gap-1">
              <Label>Nomor Telepon</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="08123456789"
                required
                className="rounded-xl"
              />
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <DialogClose asChild>
              <Button type="button" variant="ghost" className="rounded-xl flex-1">Batal</Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 rounded-xl font-bold flex-1 text-white disabled:opacity-60"
            >
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}