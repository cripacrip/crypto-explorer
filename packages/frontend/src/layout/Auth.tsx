import { Outlet } from "react-router-dom";

export default function SignUp() {
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-sidebar-accent-foreground">
        <Outlet />
    </div>
  );
}