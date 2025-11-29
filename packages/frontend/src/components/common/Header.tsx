import { logout } from '@/api/auth';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-between gap-4 p-4 shadow-md">
      <SidebarTrigger className="mb-4" />
      <div className="cursor-pointer hover:underline" onClick={handleLogout}>
        Log out
      </div>
    </header>
  );
}
