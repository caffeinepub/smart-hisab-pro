import { Button } from "@/components/ui/button";
import {
  ArrowLeftRight,
  BookOpen,
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
  Wallet,
} from "lucide-react";

type TabId =
  | "dashboard"
  | "customers"
  | "transactions"
  | "reports"
  | "customer-report"
  | "due-ledger"
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
    labelBn: "সামগ্রিক রিপোর্ট",
    labelEn: "Summary Reports",
    icon: <FileText className="h-5 w-5 flex-shrink-0" />,
  },
  {
    id: "customer-report",
    labelBn: "কাস্টমার রিপোর্ট",
    labelEn: "Customer Reports",
    icon: <BookOpen className="h-5 w-5 flex-shrink-0" />,
  },
  {
    id: "due-ledger",
    labelBn: "বাকির হিসাব",
    labelEn: "Due Ledger",
    icon: <Wallet className="h-5 w-5 flex-shrink-0" />,
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
      className={`w-60 xl:w-64 flex-shrink-0 flex flex-col h-screen sticky top-0 sidebar-glass ${className}`}
      data-ocid="sidebar.panel"
    >
      {/* ── Brand Header ── */}
      <div
        className="px-4 py-5"
        style={{
          borderBottom: "1px solid oklch(0.82 0.16 62 / 0.20)",
          background: "oklch(0.09 0.04 155 / 0.60)",
        }}
      >
        <div className="flex items-center gap-3">
          <img
            src="/assets/uploads/logo-1.jpg"
            alt="ভূমি সেবা"
            className="h-12 w-12 object-contain rounded-xl flex-shrink-0"
            style={{
              boxShadow:
                "0 0 20px oklch(0.82 0.16 62 / 0.25), 0 2px 8px oklch(0 0 0 / 0.40)",
              border: "1px solid oklch(0.82 0.16 62 / 0.30)",
            }}
          />
          <div className="min-w-0">
            {/* Playfair Display — matching image 1 title font */}
            <h1
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "0.85rem",
                fontWeight: 800,
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
                color: "white",
                textShadow: "0 1px 6px oklch(0 0 0 / 0.60)",
              }}
            >
              Atrai Online
            </h1>
            <h1
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "0.85rem",
                fontWeight: 800,
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
                color: "white",
                textShadow: "0 1px 6px oklch(0 0 0 / 0.60)",
              }}
            >
              Bhumisheba &amp; MA
            </h1>
            {/* Gold accent label */}
            <p
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "0.60rem",
                fontWeight: 700,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                color: "oklch(0.88 0.15 62)",
                textShadow: "0 0 10px oklch(0.82 0.16 62 / 0.35)",
                marginTop: "0.25rem",
              }}
            >
              ভূমি সেবা ও কম্পিউটার
            </p>
          </div>
        </div>

        {/* Thin gold decorative line */}
        <div className="mt-3 gold-divider" style={{ opacity: 0.6 }} />
      </div>

      {/* ── Navigation Items ── */}
      <nav
        className="flex-1 px-2.5 py-4 space-y-0.5 overflow-y-auto"
        aria-label="Main navigation"
      >
        {/* Nav section label */}
        <p
          className="px-3 mb-2"
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "0.60rem",
            fontWeight: 700,
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            color: "oklch(1 0 0 / 0.40)",
          }}
        >
          মেনু / Menu
        </p>

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              aria-current={isActive ? "page" : undefined}
              data-ocid={`sidebar.${item.id}.tab`}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group relative overflow-hidden"
              style={
                isActive
                  ? {
                      background:
                        "linear-gradient(90deg, oklch(0.82 0.16 62 / 0.20), oklch(0.82 0.16 62 / 0.07))",
                      borderLeft: "3px solid oklch(0.88 0.15 62)",
                      paddingLeft: "0.625rem",
                      boxShadow: "inset 0 1px 0 oklch(1 0 0 / 0.06)",
                    }
                  : {
                      borderLeft: "3px solid transparent",
                      paddingLeft: "0.625rem",
                    }
              }
            >
              {/* Icon */}
              <span
                className="flex-shrink-0 transition-all duration-200"
                style={{
                  color: isActive
                    ? "oklch(0.88 0.15 62)"
                    : "oklch(1 0 0 / 0.55)",
                  transform: isActive ? "scale(1.1)" : undefined,
                  filter: isActive
                    ? "drop-shadow(0 0 6px oklch(0.82 0.16 62 / 0.50))"
                    : undefined,
                }}
              >
                {item.icon}
              </span>

              {/* Labels */}
              <div className="min-w-0 flex-1">
                <div
                  className="leading-tight truncate"
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: "0.875rem",
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "white" : "oklch(1 0 0 / 0.70)",
                    textShadow: isActive
                      ? "0 1px 4px oklch(0 0 0 / 0.40)"
                      : undefined,
                  }}
                >
                  {item.labelBn}
                </div>
                <div
                  className="leading-tight truncate"
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: "0.63rem",
                    fontWeight: 500,
                    letterSpacing: "0.04em",
                    color: isActive
                      ? "oklch(0.88 0.15 62)"
                      : "oklch(1 0 0 / 0.38)",
                  }}
                >
                  {item.labelEn}
                </div>
              </div>

              {/* Active dot */}
              {isActive && (
                <span
                  className="h-2 w-2 rounded-full flex-shrink-0"
                  style={{
                    background: "oklch(0.88 0.15 62)",
                    boxShadow: "0 0 10px oklch(0.88 0.15 62 / 0.80)",
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Bottom Controls ── */}
      <div
        className="px-2.5 py-4 space-y-0.5"
        style={{ borderTop: "1px solid oklch(0.82 0.16 62 / 0.18)" }}
      >
        {/* PWA Install */}
        {showInstallBanner && onInstall && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onInstall}
            className="w-full justify-start gap-3 h-10 px-3 mb-1 font-semibold rounded-xl"
            style={{
              color: "oklch(0.88 0.15 62)",
              border: "1px solid oklch(0.82 0.16 62 / 0.40)",
              background: "oklch(0.82 0.16 62 / 0.12)",
              fontFamily: "'Outfit', sans-serif",
            }}
            data-ocid="sidebar.install.button"
          >
            <Download className="h-4 w-4 flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-sm leading-tight font-bold">অ্যাপ ইনস্টল</div>
              <div
                className="leading-tight"
                style={{
                  fontSize: "0.60rem",
                  opacity: 0.72,
                  letterSpacing: "0.04em",
                }}
              >
                Install App
              </div>
            </div>
          </Button>
        )}

        {/* Dark mode toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleDark}
          className="w-full justify-start gap-3 h-10 px-3 rounded-xl transition-all"
          style={{
            color: "oklch(1 0 0 / 0.65)",
            fontFamily: "'Outfit', sans-serif",
          }}
          data-ocid="sidebar.darkmode.toggle"
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
                fontSize: "0.60rem",
                opacity: 0.58,
                letterSpacing: "0.04em",
              }}
            >
              {darkMode ? "আলো মোড" : "অন্ধকার মোড"}
            </div>
          </div>
        </Button>

        {/* Change PIN */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onChangePin}
          className="w-full justify-start gap-3 h-10 px-3 rounded-xl transition-all"
          style={{
            color: "oklch(1 0 0 / 0.65)",
            fontFamily: "'Outfit', sans-serif",
          }}
          data-ocid="sidebar.changepin.button"
        >
          <KeyRound className="h-4 w-4 flex-shrink-0" />
          <div className="min-w-0">
            <div className="text-sm leading-tight font-medium">Change PIN</div>
            <div
              className="leading-tight"
              style={{
                fontSize: "0.60rem",
                opacity: 0.58,
                letterSpacing: "0.04em",
              }}
            >
              পিন পরিবর্তন
            </div>
          </div>
        </Button>

        {/* Lock */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onLock}
          className="w-full justify-start gap-3 h-10 px-3 rounded-xl transition-all"
          style={{
            color: "oklch(0.72 0.18 22 / 0.88)",
            fontFamily: "'Outfit', sans-serif",
          }}
          data-ocid="sidebar.lock.button"
        >
          <Lock className="h-4 w-4 flex-shrink-0" />
          <div className="min-w-0">
            <div className="text-sm leading-tight font-medium">Lock App</div>
            <div
              className="leading-tight"
              style={{
                fontSize: "0.60rem",
                opacity: 0.65,
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
