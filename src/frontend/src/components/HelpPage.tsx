import {
  BookOpen,
  Download,
  HelpCircle,
  Keyboard,
  Lock,
  PlusCircle,
  Receipt,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";

interface HelpSection {
  id: string;
  iconBn: string;
  iconEn: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export default function HelpPage() {
  const sections: HelpSection[] = [
    {
      id: "getting-started",
      iconBn: "শুরু করুন",
      iconEn: "Getting Started",
      icon: <BookOpen className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Atrai Online Bhumisheba And MA Computer ব্যবহার করতে এই ধাপগুলো অনুসরণ
            করুন / Follow these steps to use Atrai Online Bhumisheba And MA
            Computer:
          </p>
          <div className="space-y-3">
            {[
              {
                step: "১",
                bn: "কাস্টমার যোগ করুন",
                en: "Add a Customer",
                desc: "কাস্টমার ট্যাবে যান → 'কাস্টমার যোগ করুন' বাটনে ক্লিক করুন → নাম, ফোন ও ঠিকানা দিন / Go to Customers tab → Click 'Add Customer' → Enter name, phone and address.",
                icon: <Users className="h-4 w-4 text-blue-500" />,
              },
              {
                step: "২",
                bn: "লেনদেন যোগ করুন",
                en: "Add a Transaction",
                desc: "লেনদেন ট্যাবে যান → কাস্টমার নির্বাচন করুন → তারিখ ও পরিমাণ দিন → আয়/ব্যয়/বাকি/পরিশোধ বাটনে ক্লিক করুন / Go to Transactions tab → Select customer → Enter date and amount → Click Income/Expense/Due/Paid.",
                icon: <PlusCircle className="h-4 w-4 text-emerald-500" />,
              },
              {
                step: "৩",
                bn: "রিপোর্ট দেখুন",
                en: "View Reports",
                desc: "রিপোর্ট ট্যাবে যান — সারসংক্ষেপ কার্ড ও প্রতিটি কাস্টমারের বিস্তারিত হিসাব দেখুন / Go to Reports tab — View summary cards and detailed per-customer breakdown.",
                icon: <TrendingUp className="h-4 w-4 text-purple-500" />,
              },
              {
                step: "৪",
                bn: "ইনভয়েজ প্রিন্ট করুন",
                en: "Print Invoice",
                desc: "কাস্টমার ট্যাবে যে কোনো কাস্টমারের 'Invoice' বাটনে ক্লিক করুন → ইনভয়েজ খুলবে → প্রিন্ট করুন / Click 'Invoice' button on any customer → Invoice opens → Print it.",
                icon: <Receipt className="h-4 w-4 text-orange-500" />,
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex gap-3 p-3 rounded-lg bg-muted/40 border border-border/50"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  {item.step}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    {item.icon}
                    <span className="font-semibold text-sm text-foreground">
                      {item.bn} / {item.en}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "transaction-types",
      iconBn: "লেনদেনের ধরন",
      iconEn: "Transaction Types",
      icon: <TrendingUp className="h-5 w-5" />,
      content: (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/60 border-b border-border">
                <th className="px-4 py-2.5 text-left font-semibold text-muted-foreground">
                  ধরন / Type
                </th>
                <th className="px-4 py-2.5 text-left font-semibold text-muted-foreground">
                  বাংলা অর্থ
                </th>
                <th className="px-4 py-2.5 text-left font-semibold text-muted-foreground">
                  English Meaning
                </th>
                <th className="px-4 py-2.5 text-left font-semibold text-muted-foreground hidden sm:table-cell">
                  কখন ব্যবহার করবেন / When to Use
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  type: "Income",
                  badge: "bg-emerald-900/50 text-emerald-300",
                  bn: "আয়",
                  en: "Money received",
                  when: "যখন কাস্টমার টাকা দেয় / When customer pays you",
                },
                {
                  type: "Expense",
                  badge: "bg-red-900/50 text-red-300",
                  bn: "ব্যয়",
                  en: "Money spent",
                  when: "যখন কোনো খরচ হয় / When you spend money",
                },
                {
                  type: "Due",
                  badge: "bg-amber-900/50 text-amber-300",
                  bn: "বাকি",
                  en: "Amount owed",
                  when: "যখন কাস্টমার বাকিতে নেয় / When customer owes you",
                },
                {
                  type: "Paid",
                  badge: "bg-blue-900/50 text-blue-300",
                  bn: "পরিশোধ",
                  en: "Debt cleared",
                  when: "যখন বাকির টাকা পরিশোধ হয় / When due amount is paid",
                },
              ].map((row) => (
                <tr
                  key={row.type}
                  className="border-b border-border/60 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-2.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${row.badge}`}
                    >
                      {row.type}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-medium text-foreground">
                    {row.bn}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {row.en}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground text-xs hidden sm:table-cell">
                    {row.when}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ),
    },
    {
      id: "invoice-pdf",
      iconBn: "ইনভয়েজ ও PDF",
      iconEn: "Invoice & PDF",
      icon: <Receipt className="h-5 w-5" />,
      content: (
        <div className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              {
                title: "ইনভয়েজ খুলুন / Open Invoice",
                steps: [
                  "কাস্টমার ট্যাবে যান / Go to Customers tab",
                  "কাস্টমারের নীল 'Invoice' বাটনে ক্লিক করুন / Click blue 'Invoice' button",
                  "ইনভয়েজ প্রিভিউ দেখুন / View invoice preview",
                ],
                icon: <Receipt className="h-4 w-4 text-blue-500" />,
              },
              {
                title: "PDF সেভ করুন / Save as PDF",
                steps: [
                  "ইনভয়েজ খুলুন / Open invoice",
                  "'প্রিন্ট / Print' বাটনে ক্লিক করুন / Click Print button",
                  "Destination → 'Save as PDF' নির্বাচন করুন / Select 'Save as PDF'",
                  "'Save' বাটনে ক্লিক করুন / Click Save",
                ],
                icon: <Download className="h-4 w-4 text-emerald-500" />,
              },
              {
                title: "প্রিন্ট করুন / Print Invoice",
                steps: [
                  "ইনভয়েজ খুলুন / Open invoice",
                  "Ctrl+P অথবা 'প্রিন্ট' বাটন / Ctrl+P or click Print button",
                  "প্রিন্টার নির্বাচন করুন / Select your printer",
                  "'Print' ক্লিক করুন / Click Print",
                ],
                icon: <Download className="h-4 w-4 text-orange-500" />,
              },
              {
                title: "CSV/Excel রপ্তানি / Export CSV",
                steps: [
                  "লেনদেন ট্যাবে যান / Go to Transactions tab",
                  "'CSV রপ্তানি' বাটনে ক্লিক করুন / Click 'Export CSV'",
                  "ফাইলটি ডাউনলোড হবে / File will download automatically",
                  "Excel-এ খুলুন / Open in Excel or Google Sheets",
                ],
                icon: <Download className="h-4 w-4 text-purple-500" />,
              },
            ].map((card) => (
              <div
                key={card.title}
                className="p-3 rounded-lg bg-muted/40 border border-border/50"
              >
                <div className="flex items-center gap-2 mb-2">
                  {card.icon}
                  <span className="font-semibold text-sm text-foreground">
                    {card.title}
                  </span>
                </div>
                <ol className="space-y-1">
                  {card.steps.map((step, i) => (
                    <li
                      key={`${card.title}-step-${i}`}
                      className="text-xs text-muted-foreground flex gap-2"
                    >
                      <span className="text-primary font-semibold flex-shrink-0">
                        {i + 1}.
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "keyboard-shortcuts",
      iconBn: "কীবোর্ড শর্টকাট",
      iconEn: "Keyboard Shortcuts",
      icon: <Keyboard className="h-5 w-5" />,
      content: (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            পিসি/ল্যাপটপে দ্রুত ব্যবহারের জন্য কীবোর্ড শর্টকাট / Keyboard shortcuts for
            faster use on PC/laptop:
          </p>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/60 border-b border-border">
                  <th className="px-4 py-2.5 text-left font-semibold text-muted-foreground">
                    শর্টকাট / Shortcut
                  </th>
                  <th className="px-4 py-2.5 text-left font-semibold text-muted-foreground">
                    কাজ / Action (বাংলা)
                  </th>
                  <th className="px-4 py-2.5 text-left font-semibold text-muted-foreground hidden sm:table-cell">
                    Action (English)
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    key: "Ctrl + 1",
                    bn: "কাস্টমার ট্যাব",
                    en: "Go to Customers tab",
                  },
                  {
                    key: "Ctrl + 2",
                    bn: "লেনদেন ট্যাব",
                    en: "Go to Transactions tab",
                  },
                  {
                    key: "Ctrl + 3",
                    bn: "রিপোর্ট ট্যাব",
                    en: "Go to Reports tab",
                  },
                  {
                    key: "Ctrl + 4",
                    bn: "সাহায্য ট্যাব",
                    en: "Go to Help tab",
                  },
                  {
                    key: "Ctrl + N",
                    bn: "নতুন কাস্টমার যোগ",
                    en: "Add new customer",
                  },
                  {
                    key: "Ctrl + K",
                    bn: "সার্চ বক্সে ফোকাস",
                    en: "Focus search box",
                  },
                  { key: "Escape", bn: "সব মডাল বন্ধ", en: "Close all modals" },
                  {
                    key: "?",
                    bn: "শর্টকাট তালিকা দেখুন",
                    en: "Show shortcuts overlay",
                  },
                ].map((row) => (
                  <tr
                    key={row.key}
                    className="border-b border-border/60 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-2.5">
                      <kbd className="inline-flex items-center px-2 py-1 rounded bg-muted border border-border text-xs font-mono font-semibold text-foreground shadow-sm">
                        {row.key}
                      </kbd>
                    </td>
                    <td className="px-4 py-2.5 font-medium text-foreground text-sm">
                      {row.bn}
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground text-sm hidden sm:table-cell">
                      {row.en}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground">
            * Mac ব্যবহারকারীদের জন্য Ctrl এর পরিবর্তে Cmd (⌘) ব্যবহার করুন / Mac users:
            use Cmd (⌘) instead of Ctrl.
          </p>
        </div>
      ),
    },
    {
      id: "pin-security",
      iconBn: "PIN ও নিরাপত্তা",
      iconEn: "PIN & Security",
      icon: <Shield className="h-5 w-5" />,
      content: (
        <div className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              {
                title: "PIN সেটআপ / PIN Setup",
                desc: "প্রথমবার অ্যাপ খুললে ৪ সংখ্যার PIN তৈরি করতে হবে। এই PIN ছাড়া অ্যাপে প্রবেশ করা যাবে না। / On first launch, create a 4-digit PIN. App cannot be accessed without this PIN.",
                icon: <Lock className="h-4 w-4 text-blue-500" />,
              },
              {
                title: "অটো-লক / Auto-Lock",
                desc: "ব্রাউজার ট্যাব পরিবর্তন করলে বা অ্যাপ থেকে বের হলে স্বয়ংক্রিয়ভাবে লক হয়ে যাবে। ফিরে আসলে PIN দিতে হবে। / App auto-locks when you switch browser tabs. Enter PIN to unlock.",
                icon: <Lock className="h-4 w-4 text-amber-500" />,
              },
              {
                title: "PIN পরিবর্তন / Change PIN",
                desc: "সাইডবার বা হেডারে 'Change PIN' বাটনে ক্লিক করুন → পুরনো PIN দিন → নতুন PIN দিন → নিশ্চিত করুন। / Click 'Change PIN' in sidebar or header → Enter old PIN → Enter new PIN → Confirm.",
                icon: <Shield className="h-4 w-4 text-emerald-500" />,
              },
              {
                title: "ম্যানুয়াল লক / Manual Lock",
                desc: "সাইডবার বা হেডারে 'Lock App' বাটনে ক্লিক করে যেকোনো সময় ম্যানুয়ালি লক করতে পারবেন। / Click 'Lock App' in sidebar or header to manually lock anytime.",
                icon: <Lock className="h-4 w-4 text-red-500" />,
              },
            ].map((card) => (
              <div
                key={card.title}
                className="p-3 rounded-lg bg-muted/40 border border-border/50"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  {card.icon}
                  <span className="font-semibold text-sm text-foreground">
                    {card.title}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "data-storage",
      iconBn: "ডেটা সংরক্ষণ",
      iconEn: "Data Storage",
      icon: <Download className="h-5 w-5" />,
      content: (
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-blue-600/30 border border-blue-400/40">
            <p className="text-sm text-white font-medium mb-1">
              📦 ডেটা কোথায় সংরক্ষিত হয়? / Where is data stored?
            </p>
            <p className="text-xs text-white/80">
              আপনার সমস্ত ডেটা ব্রাউজারের localStorage-এ সংরক্ষিত হয়। এর মানে ডেটা শুধু এই
              ডিভাইস ও ব্রাউজারে থাকে। ব্রাউজার ক্লিয়ার করলে ডেটা হারিয়ে যাবে। / All data is
              stored in browser localStorage. It stays on this device and
              browser only. Clearing browser data will remove it.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-amber-500/30 border border-amber-400/40">
            <p className="text-sm text-white font-medium mb-1">
              ⚠️ ব্যাকআপ নিন / Take Backup
            </p>
            <p className="text-xs text-white/80">
              নিয়মিত CSV রপ্তানি করে ব্যাকআপ নিন। লেনদেন ট্যাবে 'CSV রপ্তানি' বাটন ব্যবহার
              করুন। এই ফাইলটি Excel বা Google Sheets-এ খুলতে পারবেন। / Regularly
              export CSV as backup. Use 'Export CSV' in Transactions tab. Open
              in Excel or Google Sheets.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-muted/40 border border-border/50">
              <p className="font-semibold text-sm text-foreground mb-1.5 flex items-center gap-1.5">
                <Download className="h-4 w-4 text-emerald-500" />
                CSV রপ্তানি / Export CSV
              </p>
              <p className="text-xs text-muted-foreground">
                লেনদেন ট্যাব → 'CSV রপ্তানি' বাটন → ফাইল ডাউনলোড হবে → Excel/Google
                Sheets-এ খুলুন। / Transactions tab → 'Export CSV' button → File
                downloads → Open in Excel/Google Sheets.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted/40 border border-border/50">
              <p className="font-semibold text-sm text-foreground mb-1.5 flex items-center gap-1.5">
                <Download className="h-4 w-4 text-red-500" />
                PDF রপ্তানি / Export PDF
              </p>
              <p className="text-xs text-muted-foreground">
                লেনদেন ট্যাব → 'PDF রপ্তানি' বাটন → প্রিন্ট ডায়ালগ খুলবে → 'Save as PDF'
                নির্বাচন করুন। / Transactions tab → 'Export PDF' → Print dialog
                opens → Select 'Save as PDF'.
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section aria-label="সাহায্য / Help">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <HelpCircle className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-foreground text-xl leading-tight">
              সাহায্য কেন্দ্র
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Help Center — Atrai Online Bhumisheba And MA Computer ব্যবহার
              নির্দেশিকা / User Guide
            </p>
          </div>
        </div>
      </div>

      {/* Quick Nav */}
      <div className="flex flex-wrap gap-2 mb-6">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#help-${s.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-muted hover:bg-primary/10 hover:text-primary text-muted-foreground border border-border/50 transition-colors"
          >
            {s.icon}
            {s.iconBn}
          </a>
        ))}
      </div>

      {/* Sections */}
      <div className="space-y-5">
        {sections.map((section) => (
          <div
            key={section.id}
            id={`help-${section.id}`}
            className="bg-card border border-border rounded-xl shadow-sm overflow-hidden scroll-mt-4"
          >
            {/* Section Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border/60 bg-muted/20">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                {section.icon}
              </div>
              <div>
                <h3 className="font-bold text-foreground text-base leading-tight">
                  {section.iconBn}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {section.iconEn}
                </p>
              </div>
            </div>
            {/* Section Content */}
            <div className="p-5">{section.content}</div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20 text-center">
        <p className="text-sm text-foreground font-medium mb-1">
          আরও সাহায্য দরকার? / Need more help?
        </p>
        <p className="text-xs text-muted-foreground">
          Atrai Online Bhumisheba And MA Computer — আপনার সেবা সহজ করুন / Simplify
          your services. Built with <span className="text-red-500">♥</span>{" "}
          using{" "}
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
    </section>
  );
}
