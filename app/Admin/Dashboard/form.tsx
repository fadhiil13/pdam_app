"use client"; 

import { Admin } from "@/app/types"
import { useState } from "react"

type Props = {
    admin: Admin
}

export default function AdminProfileForm({admin}: Props) {
    const [isEdit, setIsEdit] = useState(false);

    const [profile, setProfile] = useState({
        name: admin.name,
        username: admin.user.username,
        phone: admin.phone,
    });

    return (
        // Shadow diperbesar menjadi shadow-lg agar lebih menonjol tanpa background abu-abu
        <div className="w-full bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-8">
            
            {/* Header Form */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-800">Detail Akun Admin</h2>

                {!isEdit ? (
                    <button
                        onClick={() => setIsEdit(true)}
                        className="text-sm px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-sm active:scale-95"
                    >
                        Edit Profil
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                setProfile({
                                    name: admin.name,
                                    username: admin.user.username,
                                    phone: admin.phone,
                                })
                                setIsEdit(false)
                            }}
                            className="text-sm px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-colors active:scale-95"
                        >
                            Batal
                        </button>

                        <button
                            onClick={() => {
                                console.log("Data disimpan:", profile);
                                setIsEdit(false);
                                alert("Profil berhasil diperbarui!");
                            }}
                            className="text-sm px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-500 transition-colors shadow-sm active:scale-95">
                            Simpan
                        </button>
                    </div>
                )}
            </div>

            {/* Input Fields */}
            <div className="flex flex-col gap-5">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">Nama Lengkap</label>
                    <input 
                        id="name"
                        type="text"
                        value={profile.name}
                        disabled={!isEdit}
                        onChange={(e) =>
                            setProfile({...profile, name: e.target.value})
                        }
                        className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition-all outline-none 
                        ${
                            isEdit
                                ? "border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white"
                                : "bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed"
                        }`}
                    /> 
                </div>

                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1.5">
                        Username <span className="text-xs font-normal text-slate-400 ml-1">(Tidak dapat diubah)</span>
                    </label>
                    <input 
                        id="username"
                        type="text"
                        value={profile.username}
                        disabled
                        className="w-full rounded-xl border px-3.5 py-2.5 text-sm bg-slate-50 border-slate-200 text-slate-500 outline-none cursor-not-allowed"
                    /> 
                </div>

                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1.5">
                        Nomor Telepon
                    </label>
                    <input 
                        id="phone"
                        type="tel"
                        value={profile.phone}
                        disabled={!isEdit}
                        onChange={(e) =>
                            setProfile({...profile, phone: e.target.value})
                        }
                        className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition-all outline-none
                        ${
                            isEdit
                                ? "border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white"
                                : "bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed"
                        }`}
                    /> 
                </div>
            </div>
        </div>
    )
}