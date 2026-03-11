import { Home, UserPen, User, Users, Toolbox, Receipt, Banknote} from "lucide-react";

export const items = [
    {
        title: "Home",
        url: "/Admin/Dashboard",
        icon: Home,
    },
    {
        title: "My Profile",
        // SUDAH DIPERBAIKI: Mengarah ke folder Profile yang baru
        url: "/Admin/Dashboard", 
        icon: UserPen,
    },
    {
        title: "Admin Data",
        // SUDAH BENAR: Mengarah ke halaman CRUD Admin
        url: "/Admin/AdminData", 
        icon: User,
    },
    {
        title: "Customer Data",
        url: "/Admin/CustomerData",
        icon: Users,
    },
    {
        title: "Services",
        url: "/Admin/Services",
        icon: Toolbox,
    },
    {
        title: "bill",
        url: "#",
        icon: Receipt,
    },
    {
        title: "Payments",
        url: "#",
        icon: Banknote,
    },
]