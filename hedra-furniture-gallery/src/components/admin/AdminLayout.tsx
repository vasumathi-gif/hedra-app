import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Package, Plus, Settings, LogOut, Eye,FileUp, Tags } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import edendekLogo from "../../assets/icons/300px.png";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Add Product', href: '/admin/products/add', icon: Plus },
  { name: 'Upload Catalogue', href: '/admin/catalogue/upload', icon: FileUp },
  { name: 'Catalogue', href: '/admin/catalogue', icon: Tags },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-border">
  <div className="flex flex-col items-center space-y-2"> {/* Add space between logo and text */}
    <img src={edendekLogo} alt="Edendek logo" className="block h-8 w-auto" /> {/* Increased size here */}
    <p className="text-xs text-muted-foreground">Admin Panel</p> {/* Admin Panel text under the logo */}
  </div>
</div>


        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {navigation.map((item) => {
              const IconComponent = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <IconComponent className="mr-3 h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="mt-8 pt-4 border-t border-border">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
            >
              <Eye className="mr-3 h-4 w-4" />
              View Website
            </a>
          </div>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-secondary rounded-full flex items-center justify-center">
                <span className="text-secondary-foreground font-medium text-sm">
                  {user?.name?.charAt(0) || "?"}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.name || "Admin"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email || "admin@hedrafabrications.com"}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-sm font-medium text-muted-foreground">
                Admin Panel
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Visit Website →
              </a>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
