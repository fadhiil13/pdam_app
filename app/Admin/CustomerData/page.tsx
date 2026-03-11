import { getCookies } from "@/lib/server-cookies";
import AddCustomer from "./add";
import EditCustomer from "./edit";
import DeleteCustomer from "./delete";
import ResetPassword from "./reset-password"; // <--- IMPORT BARU
import Search from "@/components/search";
import Link from "next/link";

type Props = {
  searchParams: Promise<{ page?: string; search?: string }>
}

async function getCustomers(page: number, search: string) {
  try {
    const token = await getCookies('accessToken');
    const quantity = 5; 
    const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/customers?page=${page}&quantity=${quantity}&search=${search}`;
    
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
    return { data: [], count: 0 };
  }
}

export default async function CustomerDataPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const search = params?.search || "";
  const { data: customers, count: totalItems } = await getCustomers(page, search);
  const totalPages = Math.ceil(totalItems / 5);

  return (
    <div className="w-full bg-white p-6">
      <div className="w-full bg-white rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 p-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Data Pelanggan PDAM</h1>
            <p className="text-sm text-slate-500 mt-1">Kelola informasi sambungan air dan identitas pelanggan.</p>
          </div>
          <AddCustomer />
        </div>

        {/* SEARCH */}
        <div className="mb-8 max-w-md">
          <Search search={search} />
        </div>

        {/* TABLE */}
        <div className="w-full overflow-hidden bg-white rounded-2xl border border-slate-100 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <th className="px-8 py-4 w-16 text-center">No</th>
                <th className="px-8 py-4">ID Pelanggan</th>
                <th className="px-8 py-4">Nama Pelanggan</th>
                <th className="px-8 py-4">Nomor HP</th>
                <th className="px-8 py-4">Alamat</th>
                <th className="px-8 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {customers.length > 0 ? customers.map((c: any, index: number) => (
                <tr key={c.id} className="hover:bg-blue-50/20 transition-colors">
                  <td className="px-8 py-5 text-center text-slate-400 font-medium">{(page - 1) * 5 + index + 1}</td>
                  <td className="px-8 py-5 font-mono font-bold text-blue-600">
                    {c.customer_number || String(c.id).padStart(3, '0')}
                  </td>
                  <td className="px-8 py-5 font-bold text-slate-800">{c.name}</td>
                  <td className="px-8 py-5 text-slate-600 font-medium">{c.phone || "-"}</td>
                  <td className="px-8 py-5 text-slate-500">{c.address || "-"}</td>
                  <td className="px-8 py-5">
                    {/* KOLOM AKSI DENGAN 3 TOMBOL */}
                    <div className="flex items-center justify-center gap-2">
                      <EditCustomer selectedData={c} />
                      <ResetPassword selectedData={c} /> {/* <--- TOMBOL RESET PW */}
                      <DeleteCustomer selectedData={c} />
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={6} className="px-8 py-16 text-center text-slate-400 font-medium">Data Pelanggan Kosong.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-6">
            <Link 
              href={`/Admin/CustomerData?page=${Math.max(page - 1, 1)}&search=${search}`}
              className={`px-6 py-2 rounded-xl font-bold border border-slate-200 text-xs transition-all ${page === 1 ? "opacity-30 pointer-events-none" : "hover:bg-blue-50 shadow-sm"}`}
            >
              ← Kembali
            </Link>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm shadow-md shadow-blue-500/20">{page}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">/ {totalPages}</span>
            </div>
            <Link 
              href={`/Admin/CustomerData?page=${Math.min(page + 1, totalPages)}&search=${search}`}
              className={`px-6 py-2 rounded-xl font-bold border border-slate-200 text-xs transition-all ${page === totalPages ? "opacity-30 pointer-events-none" : "hover:bg-blue-50 shadow-sm"}`}
            >
              Lanjut →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}