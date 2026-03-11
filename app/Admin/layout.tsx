import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/admin-tamplate/app-sidebar"

export default function Layout({ children}: {children: React.ReactNode}) {
    return (
        <div className="flex w-full overflow-hidden">
            <SidebarProvider>
                <AppSidebar/>
                <main>
                    <SidebarTrigger/>
                    {children}
                </main>
            </SidebarProvider>
        </div>
    )
}