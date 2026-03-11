"use client";

import { Services } from "@/app/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const DeleteService = ({ selectedData }: { selectedData: Services }) => {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const token = getCookie("accessToken"); // Pastikan key 'accessToken' konsisten
      const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/services/${selectedData.id}`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok || result.success) {
        toast.success(result.message || "Layanan berhasil dihapus!");
        setOpen(false); // Menutup dialog secara otomatis
        router.refresh(); // Memperbarui tabel di belakang
      } else {
        toast.warning(result.message || "Gagal menghapus layanan");
      }
    } catch (error) {
      toast.error(`Kesalahan jaringan: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {/* Tombol Hapus: Merah muda, kecil, elegan */}
        <Button 
          variant="outline" 
          className="bg-red-50 text-red-600 hover:bg-red-100 border-red-100 font-bold rounded-lg text-[10px] px-3 py-1 h-auto"
        >
          Hapus
        </Button>
      </AlertDialogTrigger>
      
      <AlertDialogContent className="rounded-3xl border-slate-100 shadow-2xl">
        <AlertDialogHeader>
          <div className="mx-auto w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-2">
             <span className="text-red-500 text-xl font-bold">!</span>
          </div>
          <AlertDialogTitle className="text-xl font-bold text-slate-800 text-center">
            Hapus Layanan Ini?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-center">
            Tindakan ini permanen. Kategori <span className="font-bold text-slate-900">"{selectedData.name}"</span> akan dihapus dari sistem PDAM.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="mt-4 flex flex-row gap-3 justify-center">
          <AlertDialogCancel className="rounded-xl border-slate-200 flex-1 mt-0">Batal</AlertDialogCancel>
          <Button 
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl px-6 flex-1 shadow-lg shadow-red-200"
          >
            {isLoading ? "Proses..." : "Ya, Hapus"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteService;