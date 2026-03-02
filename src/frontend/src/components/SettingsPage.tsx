import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Database,
  Download,
  FileSpreadsheet,
  Info,
  KeyRound,
  Lock,
  Moon,
  Settings,
  Sun,
  Trash2,
  Upload,
} from "lucide-react";

interface SettingsPageProps {
  darkMode: boolean;
  onToggleDark: () => void;
  onLock: () => void;
  onChangePin: () => void;
  onExportCSV: () => void;
  onExportJSON: () => void;
  onImportCSV: () => void;
  onImportJSON: () => void;
  onClearTransactions: () => void;
  customerCount: number;
  transactionCount: number;
}

export default function SettingsPage({
  darkMode,
  onToggleDark,
  onLock,
  onChangePin,
  onExportCSV,
  onExportJSON,
  onImportCSV,
  onImportJSON,
  onClearTransactions,
  customerCount,
  transactionCount,
}: SettingsPageProps) {
  return (
    <section aria-label="সেটিংস">
      <div className="mb-5">
        <h2 className="font-bold text-foreground text-xl leading-tight mb-0.5 flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          সেটিংস
        </h2>
        <p className="text-xs text-muted-foreground">
          Settings — App preferences, data management, and security
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ── Appearance ── */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Sun className="h-4 w-4 text-primary" />
              অ্যাপিয়ারেন্স / Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/60">
              <div>
                <p className="text-sm font-medium text-foreground">
                  {darkMode ? "ডার্ক মোড চালু" : "লাইট মোড চালু"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {darkMode ? "Dark mode is active" : "Light mode is active"}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={onToggleDark}
                className="gap-2"
              >
                {darkMode ? (
                  <>
                    <Sun className="h-3.5 w-3.5" />
                    Light
                  </>
                ) : (
                  <>
                    <Moon className="h-3.5 w-3.5" />
                    Dark
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ── Security ── */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Lock className="h-4 w-4 text-primary" />
              নিরাপত্তা / Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/60">
              <div>
                <p className="text-sm font-medium text-foreground">
                  PIN পরিবর্তন
                </p>
                <p className="text-xs text-muted-foreground">
                  Change your 4-digit PIN
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={onChangePin}
                className="gap-2"
              >
                <KeyRound className="h-3.5 w-3.5" />
                Change PIN
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/60">
              <div>
                <p className="text-sm font-medium text-foreground">
                  অ্যাপ লক করুন
                </p>
                <p className="text-xs text-muted-foreground">
                  Lock the app immediately
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={onLock}
                className="gap-2 text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10"
              >
                <Lock className="h-3.5 w-3.5" />
                Lock
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ── Export / Import ── */}
        <Card className="shadow-sm lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Database className="h-4 w-4 text-primary" />
              ডেটা ম্যানেজমেন্ট / Data Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {/* Export Section */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  রপ্তানি / Export
                </p>
                <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-600/60 border border-emerald-400/30">
                  <div>
                    <p className="text-sm font-medium text-white">CSV রপ্তানি</p>
                    <p className="text-xs text-white/70">
                      Export customers as CSV/Excel
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={onExportCSV}
                    className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white border-0"
                  >
                    <FileSpreadsheet className="h-3.5 w-3.5" />
                    CSV
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-blue-600/60 border border-blue-400/30">
                  <div>
                    <p className="text-sm font-medium text-white">JSON ব্যাকআপ</p>
                    <p className="text-xs text-white/70">
                      Full backup of all data
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={onExportJSON}
                    className="gap-2 bg-blue-600 hover:bg-blue-700 text-white border-0"
                  >
                    <Download className="h-3.5 w-3.5" />
                    JSON
                  </Button>
                </div>
              </div>

              {/* Import Section */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  আমদানি / Import
                </p>
                <div className="flex items-center justify-between p-3 rounded-lg bg-amber-500/60 border border-amber-400/30">
                  <div>
                    <p className="text-sm font-medium text-white">CSV আমদানি</p>
                    <p className="text-xs text-white/70">
                      Import customers from CSV
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={onImportCSV}
                    className="gap-2 bg-amber-500 hover:bg-amber-600 text-white border-0"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    CSV
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-violet-600/60 border border-violet-400/30">
                  <div>
                    <p className="text-sm font-medium text-white">
                      JSON পুনরুদ্ধার
                    </p>
                    <p className="text-xs text-white/70">
                      Restore from JSON backup
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={onImportJSON}
                    className="gap-2 bg-violet-600 hover:bg-violet-700 text-white border-0"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    JSON
                  </Button>
                </div>
              </div>
            </div>

            {/* Data Stats */}
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/40 border border-border/60 mb-3">
              <Info className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <p className="text-xs text-muted-foreground">
                বর্তমান ডেটা:{" "}
                <strong className="text-foreground">
                  {customerCount}জন কাস্টমার
                </strong>{" "}
                এবং{" "}
                <strong className="text-foreground">
                  {transactionCount}টি লেনদেন
                </strong>{" "}
                সংরক্ষিত আছে। Current data:{" "}
                <strong className="text-foreground">
                  {customerCount} customers
                </strong>{" "}
                and{" "}
                <strong className="text-foreground">
                  {transactionCount} transactions
                </strong>{" "}
                stored.
              </p>
            </div>

            {/* Danger Zone */}
            <div className="border border-destructive/30 rounded-lg p-3 bg-destructive/5">
              <p className="text-xs font-semibold text-destructive uppercase tracking-wide mb-2">
                বিপদ অঞ্চল / Danger Zone
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    সব লেনদেন মুছুন
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Clear all transaction records (cannot be undone)
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onClearTransactions}
                  className="gap-2 text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  মুছুন
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── About ── */}
        <Card className="shadow-sm lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Info className="h-4 w-4 text-primary" />
              সম্পর্কে / About
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/40 border border-border/60">
              <img
                src="/assets/uploads/logo-1.jpg"
                alt="Atrai Online Bhumisheba And MA Computer"
                className="h-12 w-12 object-contain rounded-lg ring-1 ring-border flex-shrink-0"
              />
              <div>
                <p className="font-bold text-foreground">
                  Atrai Online Bhumisheba And MA Computer
                </p>
                <p className="text-xs text-muted-foreground">
                  ভূমি সেবা ও কম্পিউটার — বাংলা ও ইংরেজিতে সহজে হিসাব রাখুন।
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Built with ♥ using{" "}
                  <a
                    href="https://caffeine.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    caffeine.ai
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
