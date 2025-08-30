import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { ScrollArea } from "@/components/ui/scroll-area"
import Header from "@/components/common/Header";
import Home from "@/pages/Home";
import About from "@/pages/About";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="w-full">
            <Header />
            <ScrollArea>
            <div className="p-4">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/inbox" element={<div>Inbox Page</div>} />
                <Route path="/calendar" element={<div>Calendar Page</div>} />
                <Route path="/search" element={<div>Search Page</div>} />
                <Route path="/settings" element={<div>Settings Page</div>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            </ScrollArea>
          </main>
        </div>
      </SidebarProvider>
    </BrowserRouter>
  );
}