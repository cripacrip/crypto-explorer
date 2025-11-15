import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import Header from "@/components/common/Header";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="w-full">
          <Header />
          <ScrollArea className="h-[calc(100vh-76px)]">
            <div className="p-4 h-full">
              <Outlet />
            </div>
          </ScrollArea>
        </main>
      </div>
    </SidebarProvider>
  );
}