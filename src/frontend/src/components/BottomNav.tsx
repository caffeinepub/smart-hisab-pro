import { ArrowLeftRight, FileText, HelpCircle, Users } from "lucide-react";

type TabId = "customers" | "transactions" | "reports" | "help";

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  className?: string;
}

const tabs: {
  id: TabId;
  labelBn: string;
  labelEn: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "customers",
    labelBn: "কাস্টমার",
    labelEn: "Customers",
    icon: <Users className="h-5 w-5" />,
  },
  {
    id: "transactions",
    labelBn: "লেনদেন",
    labelEn: "Transactions",
    icon: <ArrowLeftRight className="h-5 w-5" />,
  },
  {
    id: "reports",
    labelBn: "রিপোর্ট",
    labelEn: "Reports",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    id: "help",
    labelBn: "সাহায্য",
    labelEn: "Help",
    icon: <HelpCircle className="h-5 w-5" />,
  },
];

export default function BottomNav({
  activeTab,
  onTabChange,
  className = "",
}: BottomNavProps) {
  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border shadow-lg ${className}`}
    >
      <div className="flex items-stretch h-16 max-w-5xl mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 px-1 py-2 transition-all duration-150 relative
                ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }
              `}
              aria-label={`${tab.labelBn} / ${tab.labelEn}`}
              aria-current={isActive ? "page" : undefined}
            >
              {/* Active indicator line */}
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary" />
              )}

              {/* Icon with active bg */}
              <span
                className={`p-1.5 rounded-lg transition-all duration-150 ${
                  isActive ? "bg-primary/10" : ""
                }`}
              >
                {tab.icon}
              </span>

              {/* Labels */}
              <span className="text-[9px] font-semibold leading-none">
                {tab.labelBn}
              </span>
              <span className="text-[8px] font-medium leading-none opacity-70">
                {tab.labelEn}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
