import { Button } from "@/components/ui/button";
import {
  ArrowLeftRight,
  Download,
  FileText,
  HelpCircle,
  KeyRound,
  LayoutDashboard,
  Lock,
  Moon,
  Settings,
  Sun,
  Users,
} from "lucide-react";

type TabId =
  | "dashboard"
  | "customers"
  | "transactions"
  | "reports"
  | "settings"
  | "help";

interface SidebarNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  darkMode: boolean;
  onToggleDark: () => void;
  onLock: () => void;
  onChangePin: () => void;
  className?: string;
  showInstallBanner?: boolean;
  onInstall?: () => void;
}

const navItems: {
  id: TabId;
  labelBn: string;
  labelEn: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "dashboard",
    labelBn: "ড্যাশবোর্ড",
    labelEn: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5 flex-shrink-0" />,
  },
  {
    id: "customers",
    labelBn: "কাস্টমার প্রোফাইল",
    labelEn: "Customers",
    icon: <Users className="h-5 w-5 flex-shrink-0" />,
  },
  {
    id: "transactions",
    labelBn: "লেনদেন যোগ করুন",
    labelEn: "Transactions",
    icon: <ArrowLeftRight className="h-5 w-5 flex-shrink-0" />,
  },
  {
    id: "reports",
    labelBn: "কাস্টমার রিপোর্ট",
    labelEn: "Reports",
    icon: <FileText className="h-5 w-5 flex-shrink-0" />,
  },
  {
    id: "settings",
    labelBn: "সেটিংস",
    labelEn: "Settings",
    icon: <Settings className="h-5 w-5 flex-shrink-0" />,
  },
  {
    id: "help",
    labelBn: "সাহায্য",
    labelEn: "Help",
    icon: <HelpCircle className="h-5 w-5 flex-shrink-0" />,
  },
];

export default function SidebarNav({
  activeTab,
  onTabChange,
  darkMode,
  onToggleDark,
  onLock,
  onChangePin,
  className = "",
  showInstallBanner = false,
  onInstall,
}: SidebarNavProps) {
  return (
    <aside
      className={`w-60 xl:w-64 flex-shrink-0 flex flex-col h-screen sticky top-0 sidebar-glass border-r border-sidebar-border shadow-sm ${className}`}
    >
      {/* Logo & App Name */}
      <div className="px-5 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <img
            src="/assets/uploads/logo-1.jpg"
            alt="ভূমি সেবা"
            className="h-12 w-12 object-contain rounded-lg ring-1 ring-sidebar-border flex-shrink-0"
          />
          <div className="min-w-0">
            <h1 className="font-bold text-sidebar-foreground text-base leading-tight tracking-tight">
              Atrai Online Bhumisheba And MA Computer
            </h1>
            <p className="text-xs text-sidebar-accent-foreground/60 leading-tight mt-0.5">
              ভূমি সেবা ও কম্পিউটার
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav
        className="flex-1 px-3 py-4 space-y-1 overflow-y-auto"
        aria-label="Main navigation"
      >
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              aria-current={isActive ? "page" : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 group ${
                isActive
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              {/* Active indicator */}
              <span
                className={`flex-shrink-0 transition-transform duration-150 ${
                  isActive ? "scale-110" : "group-hover:scale-105"
                }`}
              >
                {item.icon}
              </span>
              <div className="min-w-0">
                <div className="text-sm leading-tight truncate">
                  {item.labelBn}
                </div>
                <div className="text-[10px] leading-tight opacity-60 truncate">
                  {item.labelEn}
                </div>
              </div>
              {/* Active dot */}
              {isActive && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Controls */}
      <div className="px-3 py-4 border-t border-sidebar-border space-y-1">
        {/* PWA Install Button */}
        {showInstallBanner && onInstall && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onInstall}
            className="w-full justify-start gap-3 text-primary hover:text-primary hover:bg-primary/10 h-10 px-3 border border-primary/30 mb-1"
          >
            <Download className="h-4 w-4 flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-sm leading-tight">অ্যাপ ইনস্টল করুন</div>
              <div className="text-[10px] leading-tight opacity-70">
                Install App
              </div>
            </div>
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleDark}
          className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent h-10 px-3"
        >
          {darkMode ? (
            <Sun className="h-4 w-4 flex-shrink-0" />
          ) : (
            <Moon className="h-4 w-4 flex-shrink-0" />
          )}
          <div className="min-w-0">
            <div className="text-sm leading-tight">
              {darkMode ? "Light Mode" : "Dark Mode"}
            </div>
            <div className="text-[10px] leading-tight opacity-60">
              {darkMode ? "আলো মোড" : "অন্ধকার মোড"}
            </div>
          </div>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onChangePin}
          className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent h-10 px-3"
        >
          <KeyRound className="h-4 w-4 flex-shrink-0" />
          <div className="min-w-0">
            <div className="text-sm leading-tight">Change PIN</div>
            <div className="text-[10px] leading-tight opacity-60">
              পিন পরিবর্তন
            </div>
          </div>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onLock}
          className="w-full justify-start gap-3 text-destructive/80 hover:text-destructive hover:bg-destructive/10 h-10 px-3"
        >
          <Lock className="h-4 w-4 flex-shrink-0" />
          <div className="min-w-0">
            <div className="text-sm leading-tight">Lock App</div>
            <div className="text-[10px] leading-tight opacity-60">লক করুন</div>
          </div>
        </Button>
      </div>
    </aside>
  );
}
