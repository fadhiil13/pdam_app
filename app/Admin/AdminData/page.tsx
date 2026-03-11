import { getCookies } from "@/lib/server-cookies";
import AddAdmin from "./add";
import EditAdmin from "./edit";
import DeleteAdmin from "./delete";
import ResetPassword from "./reset-password";
import Search from "@/components/search";
import Link from "next/link";

type Props = {
  searchParams: Promise<{ page?: string; search?: string }>
}

// FUNGSI AMBIL DATA ADMIN DARI DATABASE
async function getAdmins(page: number, search: string) {
  try {
    const token = await getCookies('accessToken');
    const quantity = 5; // Pakem: 5 data per halaman
    const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/admins?page=${page}&quantity=${quantity}&search=${search}`;
    
    const response = await fetch(url, {
      headers: {
        "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
        "Authorization": `Bearer ${token}`,
      },
      cache: "no-store"
    });

    const result = await response.json();
    return {
      data: result.data || [],
      count: result.count || 0
    };
  } catch (error) {
    console.error("Fetch Error:", error);
    return { data: [], count: 0 };
  }
}

export default async function AdminDataPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const search = params?.search || "";
  
  const { data: admins, count: totalItems } = await getAdmins(page, search);
  const totalPages = Math.ceil(totalItems / 5);

  return (
    <div className="w-full bg-white p-6">
      {/* CONTAINER UTAMA - DESIGN SERAGAM DENGAN PELANGGAN */}
      <div className="w-full bg-white rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 p-8">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Data Administrator</h1>
            <p className="text-sm text-slate-500 mt-1">Kelola informasi akun dan hak akses administrator sistem.</p>
          </div>
          <div className="flex items-center gap-3">
            <AddAdmin />
          </div>
        </div>

        {/* SEARCH SECTION */}
        <div className="mb-8 max-w-md">
          <Search search={search} />
        </div>

        {/* TABLE SECTION - JSX RAPAT UNTUK CEGAH HYDRATION ERROR */}
        <div className="w-full overflow-hidden bg-white rounded-2xl border border-slate-100 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <th className="px-8 py-4 w-16 text-center">No</th>
                <th className="px-8 py-4">Nama Lengkap</th>
                <th className="px-8 py-4">Username</th>
                <th className="px-8 py-4">No. Handphone</th>
                <th className="px-8 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {admins.length > 0 ? (
                admins.map((admin: any, index: number) => (
                  <tr key={admin.id} className="hover:bg-blue-50/20 transition-colors">
                    <td className="px-8 py-5 text-center text-slate-400 font-medium">
                      {(page - 1) * 5 + index + 1}
                    </td>
                    <td className="px-8 py-5 font-bold text-slate-800">
                      {admin.name}
                    </td>
                    <td className="px-8 py-5 text-slate-600 font-medium">
                      {admin.user?.username || "-"}
                    </td>
                    <td className="px-8 py-5 text-slate-500 font-medium">
                      {admin.phone || "-"}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-center gap-2">
                        {/* 3 TOMBOL AKSI LENGKAP */}
                        <EditAdmin selectedData={admin} />
                        <ResetPassword selectedData={admin} />
                        <DeleteAdmin selectedData={admin} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-16 text-center text-slate-400 font-medium">
                    Data Administrator Tidak Ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION SECTION - LIMIT 5 DATA PER SLIDE */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-6">
            <Link 
              href={`/Admin/AdminData?page=${Math.max(page - 1, 1)}&search=${search}`}
              className={`px-6 py-2 rounded-xl font-bold border transition-all text-xs
                ${page === 1 
                  ? "bg-slate-50 text-slate-300 border-slate-100 pointer-events-none" 
                  : "bg-white text-slate-700 border-slate-200 hover:border-blue-500 hover:text-blue-600 shadow-sm"}`}
            >
              ← Kembali
            </Link>
            
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm shadow-md shadow-blue-500/20">
                {page}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">/ {totalPages}</span>
            </div>

            <Link 
              href={`/Admin/AdminData?page=${Math.min(page + 1, totalPages)}&search=${search}`}
              className={`px-6 py-2 rounded-xl font-bold border transition-all text-xs
                ${page === totalPages 
                  ? "bg-slate-50 text-slate-300 border-slate-100 pointer-events-none" 
                  : "bg-white text-slate-700 border-slate-200 hover:border-blue-500 hover:text-blue-600 shadow-sm"}`}
            >
              Lanjut →
            </Link>
          </div>
        )}

        {/* FOOTER INFO */}
        <div className="mt-6 flex justify-end">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            Total {totalItems} Akun Administrator
          </p>
        </div>

      </div>
    </div>
  );
}