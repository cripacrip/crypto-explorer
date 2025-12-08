import { logout } from '@/api/auth';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useUser } from '@/hooks/use-user';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const { user, loading } = useUser();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-between gap-4 p-4 shadow-md">
      <SidebarTrigger className="mb-4" />
      <div className="flex items-center gap-4">
        {loading ? (
          <div className="text-sm">Loading...</div>
        ) : (
          user && (
            <div className="text-sm">
              Welcome, <span className="font-semibold">{user.username}</span>
            </div>
          )
        )}
        <div className="cursor-pointer hover:underline" onClick={handleLogout}>
          Log out
        </div>
      </div>
    </header>
  );
}
