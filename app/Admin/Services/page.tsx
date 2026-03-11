import { getCookies } from "@/lib/server-cookies";
import { Services } from "@/app/types";
import AddService from "./add";
import EditService from "./edit";
import DeleteService from "./delete"; // Import Delete yang baru
import { Dialog } from "@/components/ui/dialog";
import Search from "@/components/search";
import Link from "next/link";

type ResultData = {
    success: boolean,
    message: string,
    data: Services[]
    count: number
}

type Props = {
    searchParams: Promise<{
        page?: string 
        quantity?: string
        search?: string
    }>
}

async function getServices(page: number, quantity: number, search: string): Promise<ResultData> {
    try {
        const token = await getCookies('accessToken');
        const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/services?page=${page}&quantity=${quantity}&search=${search}`
        
        const response = await fetch(url, 
            {
                method: "GET",
                headers: {
                    "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                    "Authorization": `Bearer ${token}`,
                },
                cache: "no-store"
            }
        );

        const responseData: ResultData = await response.json()

        if (!response.ok) {
            return {
                success: false,
                message: responseData.message || "Gagal mengambil data",
                data: [],
                count: 0,
            };
        }
        
        return {
            success: true,
            message: responseData.message,
            data: responseData.data,
            count: responseData.count,
        }

    } catch (error) {
        return {
            success: false,
            message: "Error fetching services",
            data: [],
            count: 0
        };
    }
}

export default async function ServicesPage (prop: Props) {
    const params = await prop.searchParams;
    const page = Number(params?.page) || 1;
    const quantity = 5; // Maksimal 5 data per halaman
    const search = params?.search || "";

    const { count: totalItems, data: services } = await getServices(page, quantity, search);
    const totalPages = Math.ceil(totalItems / quantity);

    return (
        <div className="w-full bg-white p-6">
            <div className="w-full bg-white rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 p-8">
                
                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Layanan & Tarif Air</h1>
                        <p className="text-sm text-slate-500 mt-1">Kelola kategori layanan dan batasan penggunaan air.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <AddService />
                        <Dialog />
                    </div>
                </div>

                {/* SEARCH */}
                <div className="mb-8 max-w-md">
                    <Search search={search} />
                </div>

                {/* TABLE */}
                {services.length === 0 ? (
                    <div className="w-full py-20 text-center border-2 border-dashed border-slate-100 rounded-3xl text-slate-400 font-medium">
                        Data Service Tidak Ada
                    </div>
                ) : (
                    <div className="w-full overflow-hidden bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    <th className="px-8 py-4 w-16 text-center">No</th>
                                    <th className="px-8 py-4">Nama Layanan</th>
                                    <th className="px-8 py-4">Rentang Penggunaan (m³)</th>
                                    <th className="px-8 py-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {services.map((service, index) => (
                                    <tr key={service.id} className="hover:bg-blue-50/20 transition-colors text-sm">
                                        <td className="px-8 py-5 text-center text-slate-400 font-medium">
                                            {(page - 1) * quantity + index + 1}
                                        </td>
                                        <td className="px-8 py-5 font-bold text-slate-800">{service.name}</td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold">
                                                    {service.min_usage}
                                                </span>
                                                <span className="text-slate-300">—</span>
                                                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold border border-blue-100">
                                                    {service.max_usage}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center justify-center gap-2">
                                                <EditService selectedData={service} />
                                                <DeleteService selectedData={service} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* PAGINATION SECTION */}
                {totalPages > 1 && (
                    <div className="mt-10 flex items-center justify-center gap-6">
                        <Link
                            href={`/Admin/Services?page=${Math.max(page - 1, 1)}&search=${search}`}
                            className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold border transition-all text-xs
                                ${page === 1 
                                    ? "bg-slate-50 text-slate-300 border-slate-100 pointer-events-none" 
                                    : "bg-white text-slate-700 border-slate-200 hover:border-blue-500 hover:text-blue-600 shadow-sm"}`}
                        >
                            ← Kembali
                        </Link>
                        
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hal</span>
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm shadow-md shadow-blue-500/20">
                                {page}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">/ {totalPages}</span>
                        </div>

                        <Link
                            href={`/Admin/Services?page=${Math.min(page + 1, totalPages)}&search=${search}`}
                            className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold border transition-all text-xs
                                ${page === totalPages 
                                    ? "bg-slate-50 text-slate-300 border-slate-100 pointer-events-none" 
                                    : "bg-white text-slate-700 border-slate-200 hover:border-blue-500 hover:text-blue-600 shadow-sm"}`}
                        >
                            Lanjut →
                        </Link>
                    </div>
                )}

                <div className="mt-6 flex justify-end">
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                        Total {totalItems} Data Layanan
                    </p>
                </div>

            </div>
        </div>
    );
}