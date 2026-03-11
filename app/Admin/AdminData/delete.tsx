"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function DeleteAdmin({ selectedData }: { selectedData: any }) {
  const router = useRouter();

  const handleDelete = async () => {
    const token = getCookie("accessToken");
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/admins/${selectedData.id}`, {
      method: "DELETE",
      headers: { "app-key": process.env.NEXT_PUBLIC_APP_KEY || "", "Authorization": `Bearer ${token}` },
    });

    if (response.ok) {
      toast.success("Admin Berhasil Dihapus!");
      router.refresh();
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="bg-red-50 text-red-600 hover:bg-red-100 font-bold text-[10px] px-3 py-1 rounded-lg border border-red-100 h-auto">Hapus</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-3xl border-slate-100 shadow-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold text-center">Hapus Admin?</AlertDialogTitle>
          <AlertDialogDescription className="text-center text-sm">
            Tindakan ini permanen. Akun admin <b>{selectedData.name}</b> akan dihapus dari sistem.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row gap-3 justify-center">
          <AlertDialogCancel className="rounded-xl flex-1 mt-0">Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold flex-1">Ya, Hapus</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}