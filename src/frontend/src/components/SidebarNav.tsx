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
      <div className="px-4 py-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <img
            src="/assets/uploads/logo-1.jpg"
            alt="ভূমি সেবা"
            className="h-11 w-11 object-contain rounded-xl ring-1 ring-white/20 flex-shrink-0 shadow-lg"
            style={{ boxShadow: "0 0 16px oklch(0.82 0.15 62 / 0.20)" }}
          />
          <div className="min-w-0">
            <h1
              className="text-white leading-tight"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "0.82rem",
                fontWeight: 800,
                letterSpacing: "0",
                textShadow: "0 1px 6px rgba(0,0,0,0.6)",
                lineHeight: 1.25,
              }}
            >
              Atrai Online
            </h1>
            <div
              className="text-white leading-tight"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "0.82rem",
                fontWeight: 800,
                letterSpacing: "0",
                textShadow: "0 1px 6px rgba(0,0,0,0.6)",
                lineHeight: 1.25,
              }}
            >
              Bhumisheba &amp; MA
            </div>
            <p
              className="leading-tight mt-0.5"
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "0.62rem",
                color: "oklch(0.88 0.14 62)",
                letterSpacing: "0.05em",
                fontWeight: 600,
                textTransform: "uppercase",
                textShadow: "0 0 8px oklch(0.82 0.15 62 / 0.30)",
              }}
            >
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
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group relative overflow-hidden ${
                isActive
                  ? "text-white font-semibold"
                  : "text-white/65 hover:text-white hover:bg-white/8"
              }`}
              style={
                isActive
                  ? {
                      background:
                        "linear-gradient(90deg, oklch(0.82 0.15 62 / 0.18), oklch(0.82 0.15 62 / 0.06))",
                      borderLeft: "2px solid oklch(0.88 0.14 62)",
                    }
                  : {
                      borderLeft: "2px solid transparent",
                    }
              }
            >
              {/* Active indicator */}
              <span
                className={`flex-shrink-0 transition-transform duration-200 ${
                  isActive ? "scale-110" : "group-hover:scale-105"
                }`}
                style={isActive ? { color: "oklch(0.88 0.14 62)" } : {}}
              >
                {item.icon}
              </span>
              <div className="min-w-0">
                <div
                  className="leading-tight truncate"
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: "0.875rem",
                    fontWeight: isActive ? 700 : 500,
                  }}
                >
                  {item.labelBn}
                </div>
                <div
                  className="leading-tight truncate"
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: "0.65rem",
                    opacity: 0.65,
                    letterSpacing: "0.04em",
                    fontWeight: 500,
                  }}
                >
                  {item.labelEn}
                </div>
              </div>
              {/* Active glow dot */}
              {isActive && (
                <span
                  className="ml-auto h-1.5 w-1.5 rounded-full flex-shrink-0"
                  style={{
                    background: "oklch(0.88 0.14 62)",
                    boxShadow: "0 0 8px oklch(0.88 0.14 62 / 0.8)",
                  }}
                />
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
            className="w-full justify-start gap-3 h-10 px-3 border mb-1 font-semibold"
            style={{
              color: "oklch(0.88 0.14 62)",
              borderColor: "oklch(0.82 0.15 62 / 0.40)",
              background: "oklch(0.82 0.15 62 / 0.10)",
            }}
          >
            <Download className="h-4 w-4 flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-sm leading-tight font-bold">
                অ্যাপ ইনস্টল করুন
              </div>
              <div
                className="leading-tight"
                style={{
                  fontSize: "0.65rem",
                  opacity: 0.75,
                  letterSpacing: "0.04em",
                }}
              >
                Install App
              </div>
            </div>
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleDark}
          className="w-full justify-start gap-3 h-10 px-3 text-white/70 hover:text-white hover:bg-white/8"
        >
          {darkMode ? (
            <Sun className="h-4 w-4 flex-shrink-0" />
          ) : (
            <Moon className="h-4 w-4 flex-shrink-0" />
          )}
          <div className="min-w-0">
            <div className="text-sm leading-tight font-medium">
              {darkMode ? "Light Mode" : "Dark Mode"}
            </div>
            <div
              className="leading-tight"
              style={{
                fontSize: "0.65rem",
                opacity: 0.65,
                letterSpacing: "0.04em",
              }}
            >
              {darkMode ? "আলো মোড" : "অন্ধকার মোড"}
            </div>
          </div>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onChangePin}
          className="w-full justify-start gap-3 h-10 px-3 text-white/70 hover:text-white hover:bg-white/8"
        >
          <KeyRound className="h-4 w-4 flex-shrink-0" />
          <div className="min-w-0">
            <div className="text-sm leading-tight font-medium">Change PIN</div>
            <div
              className="leading-tight"
              style={{
                fontSize: "0.65rem",
                opacity: 0.65,
                letterSpacing: "0.04em",
              }}
            >
              পিন পরিবর্তন
            </div>
          </div>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onLock}
          className="w-full justify-start gap-3 h-10 px-3 hover:bg-red-500/10"
          style={{ color: "oklch(0.70 0.20 22 / 0.90)" }}
        >
          <Lock className="h-4 w-4 flex-shrink-0" />
          <div className="min-w-0">
            <div className="text-sm leading-tight font-medium">Lock App</div>
            <div
              className="leading-tight"
              style={{
                fontSize: "0.65rem",
                opacity: 0.7,
                letterSpacing: "0.04em",
              }}
            >
              লক করুন
            </div>
          </div>
        </Button>
      </div>
    </aside>
  );
}
