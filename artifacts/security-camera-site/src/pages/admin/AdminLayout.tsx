import { ReactNode, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useVerifyAdmin } from "@workspace/api-client-react";
import { auth } from "@/lib/auth";
import { LayoutDashboard, Package, Users, LogOut, ShieldCheck, Loader2 } from "lucide-react";

export function AdminLayout({ children }: { children: ReactNode }) {
  const [, setLocation] = useLocation();
  const [currentPath] = useLocation();

  const { data, isLoading, isError } = useVerifyAdmin({
    request: { headers: auth.getHeaders() }
  });

  useEffect(() => {
    if (!isLoading && (isError || !data)) {
      auth.clearToken();
      setLocation("/admin/login");
    }
  }, [isLoading, isError, data, setLocation]);

  const handleLogout = () => {
    auth.clearToken();
    setLocation("/admin/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Manage Products", icon: Package },
    { href: "/admin/contacts", label: "Contact Submissions", icon: Users },
  ];

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-72 bg-card border-r border-white/5 flex flex-col shrink-0 hidden md:flex">
        <div className="h-20 flex items-center px-8 border-b border-white/5">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-primary" />
            <span className="font-display font-bold text-xl">Admin Panel</span>
          </div>
        </div>
        
        <nav className="flex-1 py-8 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = currentPath === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  isActive 
                    ? "bg-primary/10 text-primary border border-primary/20" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-card border-b border-white/5 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <span className="font-display font-bold">Admin</span>
          </div>
          <button onClick={handleLogout} className="text-muted-foreground"><LogOut className="w-5 h-5"/></button>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
