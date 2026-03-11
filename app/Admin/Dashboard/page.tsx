import { Admin } from "@/app/types"
import { getCookies } from "@/lib/server-cookies";
import AdminProfileForm from "./form";

type ResultData = {
    success: boolean,
    message: string,
    data: Admin,
}

async function getAdminProfile(): Promise<Admin | null> {
    try {
        const Token = await getCookies('accessToken');
        const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/admins/me`
        const response = await fetch(url, {
            method: `GET`,
            headers: {
                "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
                "Authorization": `Bearer ${Token}`,
            }
        })

        const responseData: ResultData = await response.json()

        if (!response.ok) {
            console.log(responseData?.message)
            return null
        }
        return responseData.data
    
    } catch (error) {
        console.log(error)
        return null
    }
}

export default async function AdminProfilePage() {
    const adminData = await getAdminProfile()
    
    if (adminData == null) {
        return (
            <div className="p-6 text-red-500 font-semibold m-6">
                Maaf, data admin tidak ditemukan atau sesi telah habis.
            </div>
        )
    }
    
    return (
        // Background abu-abu dihapus, diganti menjadi transparan/menyatu dengan layout utama
        <div className="w-full p-6 md:p-8">
            <div className="max-w-2xl"> 
                <AdminProfileForm admin={adminData} />
            </div>
        </div>
    )
}