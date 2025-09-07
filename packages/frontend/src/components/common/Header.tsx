// import { NavLink } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
// import { cn } from "@/lib/utils";

export default function Header() {
  return (
    <header className="bg-sidebar-primary text-sidebar-primary-foreground p-4 flex gap-4 shadow-md">
      <SidebarTrigger className="mb-4" />
    </header>
  );
}