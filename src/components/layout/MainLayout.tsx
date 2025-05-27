import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen min-w-screen bg-background text-foreground">
      <nav className="bg-white dark:bg-zinc-900 border-b border-border shadow-sm">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-8">
              <Link to="/dashboard" className="text-xl font-bold text-blue-600 dark:text-blue-400">Lexo Admin</Link>
              <Link to="/dashboard" className="text-blue-600/80 hover:text-blue-700 dark:text-blue-400/80 dark:hover:text-blue-300 font-medium">Dashboard</Link>
              <Link to="/users" className="text-blue-600/80 hover:text-blue-700 dark:text-blue-400/80 dark:hover:text-blue-300 font-medium">Users</Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-200">
                      {user?.username?.[0]?.toUpperCase()}
                    </span>
                  </div>
                </button>
                {isUserMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-zinc-900 ring-1 ring-black ring-opacity-5">
                    <div className="px-4 py-2 text-sm text-blue-700 dark:text-blue-200">
                      {user?.email}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-blue-700 dark:text-blue-200 hover:bg-blue-50 dark:hover:bg-blue-800"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="w-full py-8 px-4">
        {children}
      </main>
    </div>
  );
} 