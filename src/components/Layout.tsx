import type { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, Upload, BookmarkCheck, CheckCircle, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/publish', icon: Upload, label: 'Publish' },
    { path: '/saved', icon: BookmarkCheck, label: 'Saved Profiles' },
    { path: '/verify', icon: CheckCircle, label: 'Verify Profiles' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h1 className={styles.logo}>Hunerz</h1>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <button onClick={handleLogout} className={styles.logoutBtn}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </aside>

      <main className={styles.main}>{children}</main>
    </div>
  );
};
