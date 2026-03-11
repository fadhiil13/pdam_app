"use client";

import { useState, useEffect } from "react";

type Props = { token: string };

export default function CustomerDataClient({ token }: Props) {
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; 

  const API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
  const headers = {
    "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/customers`, { headers });
      const result = await response.json();
      if (response.ok) setCustomers(result.data);
    } catch (error) { console.error("Error:", error); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchCustomers(); }, []);

  // --- FUNGSI REGISTRASI DENGAN INPUT PHONE ---
  const handleRegister = async () => {
    const name = window.prompt("Nama Pelanggan:");
    if (!name) return;
    
    const phone = window.prompt("Nomor Telepon/HP:"); // <-- TAMBAHAN INPUT PHONE
    if (!phone) return;

    const address = window.prompt("Alamat:");
    if (!address) return;

    const username = window.prompt("Buat Username Login:");
    if (!username) return;
    
    const password = window.prompt("Buat Password Login:");
    if (!password) return;

    const custNum = window.prompt("Masukkan Nomor Sambungan (Contoh: 001):");
    if (!custNum) return;

    const serviceId = window.prompt("Masukkan ID Layanan (Contoh: 1):", "1");
    if (!serviceId) return;

    try {
      const response = await fetch(`${API_URL}/customers`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: name,
          phone: phone,          // <-- KIRIM KE DATABASE
          address: address,
          username: username,
          password: password,
          customer_number: custNum,
          service_id: Number(serviceId)
        }),
      });

      if (response.ok) {
        alert("Pendaftaran Berhasil!");
        fetchCustomers();
      } else {
        const errorData = await response.json();
        alert("Gagal mendaftar: " + JSON.stringify(errorData.message));
      }
    } catch (error) {
      alert("Kesalahan koneksi ke server.");
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Hapus ${name}?`)) return;
    const response = await fetch(`${API_URL}/customers/${id}`, { method: "DELETE", headers });
    if (response.ok) { alert("Terhapus!"); fetchCustomers(); }
  };

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.address || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.phone || "").includes(searchTerm) // Pencarian berdasarkan nomor telp
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="w-full bg-white p-6">
      <div className="w-full bg-white rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 p-8">
        
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Data Pelanggan PDAM</h1>
            <p className="text-sm text-slate-500 mt-1">Manajemen seluruh data sambungan air pelanggan.</p>
          </div>
          <button 
            onClick={handleRegister}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-500 transition-all shadow-lg active:scale-95"
          >
            + Registrasi Pelanggan
          </button>
        </div>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Cari nama, alamat, atau telepon..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full max-w-md px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all"
          />
        </div>

        <div className="w-full overflow-hidden bg-white rounded-2xl border border-slate-100 shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <th className="px-8 py-4 text-center">No</th>
                <th className="px-8 py-4">ID Pelanggan</th>
                <th className="px-8 py-4">Nama Pelanggan</th>
                <th className="px-8 py-4">Telepon</th> {/* <-- HEADER BARU */}
                <th className="px-8 py-4">Alamat</th>
                <th className="px-8 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan={6} className="px-8 py-12 text-center text-slate-400">Loading...</td></tr>
              ) : currentItems.length > 0 ? (
                currentItems.map((c, index) => (
                  <tr key={c.id} className="hover:bg-blue-50/20 transition-colors text-sm">
                    <td className="px-8 py-4 text-center text-slate-400">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="px-8 py-4 font-mono font-bold text-blue-600">
                      {c.customer_number || String(c.id).padStart(3, '0')}
                    </td>
                    <td className="px-8 py-4 font-bold text-slate-800">{c.name}</td>
                    <td className="px-8 py-4 text-slate-600">{c.phone || "-"}</td> {/* <-- KOLOM TELEPON */}
                    <td className="px-8 py-4 text-slate-500">{c.address || "-"}</td>
                    <td className="px-8 py-4 text-center space-x-2">
                      <button className="text-blue-600 font-bold text-xs hover:underline">Edit</button>
                      <button onClick={() => handleDelete(c.id, c.name)} className="text-red-600 font-bold text-xs hover:underline">Hapus</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} className="px-8 py-12 text-center text-slate-400">Data tidak ditemukan.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 rounded-xl font-bold border disabled:opacity-30">Kembali</button>
            <span className="text-sm font-bold text-slate-500">Hal {currentPage} / {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-4 py-2 rounded-xl font-bold border disabled:opacity-30">Lanjut</button>
          </div>
        )}
      </div>
    </div>
  );
}