import { cn } from "@/lib/utils";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "../hooks/useAuth";

const NAV_ITEMS = [
  { label: "Dashboard", emoji: "🏠", path: "/dashboard" },
  { label: "Food Scanner", emoji: "🍽️", path: "/food-scanner" },
  { label: "Mood", emoji: "😊", path: "/mood-tracker" },
  { label: "Symptoms", emoji: "🔍", path: "/symptoms" },
  { label: "Health Risk", emoji: "❤️", path: "/health-risk" },
  { label: "Diet", emoji: "🥗", path: "/diet-recommendations" },
  { label: "Analytics", emoji: "📊", path: "/analytics" },
  { label: "History", emoji: "📋", path: "/history" },
  { label: "Report", emoji: "📄", path: "/report" },
  { label: "Profile", emoji: "👤", path: "/profile" },
];

// Bottom tab bar shows 5 primary items
const BOTTOM_TABS = NAV_ITEMS.slice(0, 5);

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isActive = (path: string) =>
    currentPath === path || currentPath.startsWith(`${path}/`);

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  const firstName = userProfile?.basicInfo.fullName.split(" ")[0] ?? "User";

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar — desktop only */}
      <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-border shadow-elevated fixed left-0 top-0 bottom-0 z-30">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌊</span>
            <span className="font-display text-xl font-bold text-primary">
              OceanWell
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            AI Health Tracker
          </p>
        </div>

        {/* User greeting */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
              {firstName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{firstName}</p>
              <p className="text-xs text-muted-foreground truncate">
                {userProfile?.basicInfo.email}
              </p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav
          className="flex-1 overflow-y-auto px-3 py-4 space-y-1"
          data-ocid="sidebar.nav"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              data-ocid={`sidebar.${item.label.toLowerCase().replace(/ /g, "_")}.link`}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-smooth",
                isActive(item.path)
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground hover:bg-muted",
              )}
            >
              <span className="text-lg leading-none">{item.emoji}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-border">
          <button
            type="button"
            onClick={handleLogout}
            data-ocid="sidebar.logout_button"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-smooth"
          >
            <span className="text-lg">🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top header */}
        <header className="bg-card border-b border-border shadow-subtle sticky top-0 z-20">
          <div className="flex items-center justify-between px-4 lg:px-6 h-14">
            {/* Mobile logo */}
            <div className="flex items-center gap-2 lg:hidden">
              <span className="text-xl">🌊</span>
              <span className="font-display text-lg font-bold text-primary">
                OceanWell
              </span>
            </div>
            {/* Desktop spacer */}
            <div className="hidden lg:block" />

            {/* Right actions */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Hello,</span>
                <span className="font-semibold text-foreground">
                  {firstName} 👋
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                data-ocid="header.logout_button"
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth border border-border"
              >
                <span>🚪</span>
                <span>Sign out</span>
              </button>
              {/* Mobile avatar */}
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs lg:hidden">
                {firstName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 bg-background pb-20 lg:pb-0">{children}</main>

        {/* Footer — desktop */}
        <footer className="bg-card border-t border-border">
          <div className="px-6 py-3 text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== "undefined" ? window.location.hostname : "",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              Built with love using caffeine.ai
            </a>
          </div>
        </footer>
      </div>

      {/* Bottom tab bar — mobile */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-card border-t border-border"
        data-ocid="bottom_nav"
      >
        <div className="flex items-center justify-around h-16 px-2">
          {BOTTOM_TABS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              data-ocid={`bottom_nav.${item.label.toLowerCase().replace(/ /g, "_")}.link`}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1 rounded-md transition-smooth min-w-0",
                isActive(item.path) ? "text-primary" : "text-muted-foreground",
              )}
            >
              <span className="text-xl leading-none">{item.emoji}</span>
              <span className="text-[10px] font-medium leading-none truncate max-w-[50px]">
                {item.label}
              </span>
            </Link>
          ))}
          {/* More button */}
          <Link
            to="/profile"
            data-ocid="bottom_nav.more.link"
            className={cn(
              "flex flex-col items-center gap-0.5 px-2 py-1 rounded-md transition-smooth",
              isActive("/profile") ? "text-primary" : "text-muted-foreground",
            )}
          >
            <span className="text-xl leading-none">⋯</span>
            <span className="text-[10px] font-medium leading-none">More</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
