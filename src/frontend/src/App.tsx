import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import {
  BarChart3,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Download,
  Edit2,
  FileSpreadsheet,
  FileText,
  HelpCircle,
  KeyRound,
  Lock,
  MapPin,
  Moon,
  MoreVertical,
  Phone,
  PlusCircle,
  Receipt,
  Sun,
  Trash2,
  TrendingDown,
  TrendingUp,
  Upload,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import AddCustomerModal from "./components/AddCustomerModal";
import BottomNav from "./components/BottomNav";
import ChangePinModal from "./components/ChangePinModal";
import CustomerReportPage from "./components/CustomerReportPage";
import DashboardPage from "./components/DashboardPage";
import EditCustomerModal from "./components/EditCustomerModal";
import EditTransactionModal from "./components/EditTransactionModal";
import HelpPage from "./components/HelpPage";
import InvoiceModal from "./components/InvoiceModal";
import PinLogin from "./components/PinLogin";
import SettingsPage from "./components/SettingsPage";
import SidebarNav from "./components/SidebarNav";

// ─── Data Model ───────────────────────────────────────────────────────────────

interface Customer {
  name: string;
  phone: string;
  address: string;
}

type TransactionType = "Income" | "Expense" | "Due" | "Paid";
type TabId =
  | "dashboard"
  | "customers"
  | "transactions"
  | "reports"
  | "customer-report"
  | "due-ledger"
  | "settings"
  | "help";

interface Transaction {
  date: string;
  type: TransactionType;
  customer: number;
  amount: number;
}

interface TransactionWithIndex {
  item: Transaction;
  originalIndex: number;
}

// ─── Type Badge Config ─────────────────────────────────────────────────────────

const typeBadgeVariant: Record<TransactionType, string> = {
  Income: "bg-emerald-900/50 text-emerald-300",
  Expense: "bg-red-900/50 text-red-300",
  Due: "bg-amber-900/50 text-amber-300",
  Paid: "bg-blue-900/50 text-blue-300",
};

// ─── Avatar Colors ─────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  { bg: "bg-violet-500", border: "border-violet-400", hex: "#8b5cf6" },
  { bg: "bg-emerald-500", border: "border-emerald-400", hex: "#10b981" },
  { bg: "bg-blue-500", border: "border-blue-400", hex: "#3b82f6" },
  { bg: "bg-amber-500", border: "border-amber-400", hex: "#f59e0b" },
  { bg: "bg-rose-500", border: "border-rose-400", hex: "#f43f5e" },
  { bg: "bg-cyan-500", border: "border-cyan-400", hex: "#06b6d4" },
  { bg: "bg-indigo-500", border: "border-indigo-400", hex: "#6366f1" },
  { bg: "bg-teal-500", border: "border-teal-400", hex: "#14b8a6" },
];

// ─── Chart Colors ──────────────────────────────────────────────────────────────

const BAR_COLORS = ["#22c55e", "#ef4444", "#eab308", "#3b82f6", "#6b7280"];

function getPieColor(idx: number) {
  return `hsl(${(idx * 47 + 200) % 360}, 65%, 55%)`;
}

function fmtAmt(n: number) {
  if (n >= 100000) return `${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toLocaleString();
}

// ─── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  // ─── PIN Auth ─────────────────────────────────────────────────────────────────
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinMode, setPinMode] = useState<"setup" | "unlock">(() =>
    localStorage.getItem("hisabPIN") ? "unlock" : "setup",
  );
  const [changePinOpen, setChangePinOpen] = useState(false);

  // Auto-lock when tab becomes hidden
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        setIsUnlocked(false);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // Dark mode
  const [darkMode, setDarkMode] = useState<boolean>(
    () => localStorage.getItem("hisabDark") === "true",
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("hisabDark", String(darkMode));
  }, [darkMode]);

  // Tab State
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");

  // Data
  const [customers, setCustomers] = useState<Customer[]>(() =>
    JSON.parse(localStorage.getItem("hisabData_customers") || "[]"),
  );
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    JSON.parse(localStorage.getItem("hisabData_transactions") || "[]"),
  );

  // Persist data
  useEffect(() => {
    localStorage.setItem("hisabData_customers", JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(
      "hisabData_transactions",
      JSON.stringify(transactions),
    );
  }, [transactions]);

  // Modal state
  const [addCustomerOpen, setAddCustomerOpen] = useState(false);
  const [editCustomerIndex, setEditCustomerIndex] = useState<number | null>(
    null,
  );
  const [invoiceCustomerIdx, setInvoiceCustomerIdx] = useState<number | null>(
    null,
  );

  // Expanded transactions per customer row
  const [expandedCustomers, setExpandedCustomers] = useState<Set<number>>(
    new Set(),
  );

  const toggleExpanded = (index: number) => {
    setExpandedCustomers((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  // Transaction form state
  const [selectedCustomerIdx, setSelectedCustomerIdx] = useState<string>("");
  const [txnDate, setTxnDate] = useState<string>(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [amount, setAmount] = useState<string>("");
  const [search, setSearch] = useState("");
  const [txnType] = useState<TransactionType>("Income");

  // Keyboard shortcuts overlay
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Edit transaction modal
  const [editTxnIndex, setEditTxnIndex] = useState<number | null>(null);

  // Search input ref for Ctrl+K focus
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Hidden file input refs for CSV/JSON import
  const csvImportRef = useRef<HTMLInputElement>(null);
  const jsonImportRef = useRef<HTMLInputElement>(null);

  // PWA Install prompt
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstallBanner(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    (
      installPrompt as unknown as {
        prompt: () => void;
        userChoice: Promise<{ outcome: string }>;
      }
    ).prompt();
    const { outcome } = await (
      installPrompt as unknown as {
        prompt: () => void;
        userChoice: Promise<{ outcome: string }>;
      }
    ).userChoice;
    if (outcome === "accepted") {
      setInstallPrompt(null);
      setShowInstallBanner(false);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;
      const tag = (
        document.activeElement as HTMLElement
      )?.tagName?.toLowerCase();
      const isInput = tag === "input" || tag === "textarea" || tag === "select";

      if (ctrl && e.key === "1") {
        e.preventDefault();
        setActiveTab("dashboard");
        return;
      }
      if (ctrl && e.key === "2") {
        e.preventDefault();
        setActiveTab("customers");
        return;
      }
      if (ctrl && e.key === "3") {
        e.preventDefault();
        setActiveTab("transactions");
        return;
      }
      if (ctrl && e.key === "4") {
        e.preventDefault();
        setActiveTab("reports");
        return;
      }
      if (ctrl && e.key === "5") {
        e.preventDefault();
        setActiveTab("settings");
        return;
      }
      if (ctrl && e.key === "6") {
        e.preventDefault();
        setActiveTab("help");
        return;
      }
      if (ctrl && e.key === "n") {
        e.preventDefault();
        setAddCustomerOpen(true);
        return;
      }
      if (ctrl && e.key === "k") {
        e.preventDefault();
        setActiveTab("transactions");
        setTimeout(() => searchInputRef.current?.focus(), 100);
        return;
      }
      if (e.key === "Escape") {
        setAddCustomerOpen(false);
        setEditCustomerIndex(null);
        setInvoiceCustomerIdx(null);
        setChangePinOpen(false);
        setShowShortcuts(false);
        setEditTxnIndex(null);
        return;
      }
      if (e.key === "?" && !isInput) {
        e.preventDefault();
        setShowShortcuts((s) => !s);
        return;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // ─── Calculated Totals ───────────────────────────────────────────────────────

  let totalIncome = 0;
  let totalExpense = 0;
  let totalDue = 0;
  let totalPaid = 0;

  for (const item of transactions) {
    if (item.type === "Income") totalIncome += item.amount;
    if (item.type === "Expense") totalExpense += item.amount;
    if (item.type === "Due") totalDue += item.amount;
    if (item.type === "Paid") {
      totalPaid += item.amount;
      totalIncome += item.amount;
    }
  }
  const profit = totalIncome - totalExpense;

  // ─── Customer Management ──────────────────────────────────────────────────────

  const addCustomer = (name: string, phone: string, address: string) => {
    setCustomers((prev) => [...prev, { name, phone, address }]);
    toast.success("কাস্টমার যোগ করা হয়েছে / Customer added!");
  };

  const editCustomer = (name: string, phone: string, address: string) => {
    if (editCustomerIndex === null) return;
    setCustomers((prev) =>
      prev.map((c, i) =>
        i === editCustomerIndex ? { name, phone, address } : c,
      ),
    );
    setEditCustomerIndex(null);
    toast.success("কাস্টমার আপডেট হয়েছে / Customer updated!");
  };

  const deleteCustomer = (index: number) => {
    if (window.confirm("এই কাস্টমার মুছে ফেলবেন? / Delete this customer?")) {
      setCustomers((prev) => prev.filter((_, i) => i !== index));
      // Remove transactions for this customer and re-index
      setTransactions((prev) =>
        prev
          .filter((t) => t.customer !== index)
          .map((t) => ({
            ...t,
            customer: t.customer > index ? t.customer - 1 : t.customer,
          })),
      );
      toast.success("কাস্টমার মুছে ফেলা হয়েছে / Customer deleted!");
    }
  };

  // ─── Transaction Management ───────────────────────────────────────────────────

  const addTransaction = (type: TransactionType) => {
    if (selectedCustomerIdx === "") {
      toast.error(
        "প্রথমে একজন কাস্টমার নির্বাচন করুন / Please select a customer first",
      );
      return;
    }
    const parsedAmount = Number.parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      toast.error("সঠিক পরিমাণ দিন / Please enter a valid amount");
      return;
    }
    const date = txnDate || new Date().toISOString().slice(0, 10);
    setTransactions((prev) => [
      ...prev,
      {
        date,
        type,
        customer: Number.parseInt(selectedCustomerIdx),
        amount: parsedAmount,
      },
    ]);
    setAmount("");
    toast.success(`${type} — ${parsedAmount.toLocaleString()} যোগ হয়েছে!`);
  };

  const deleteTransaction = (index: number) => {
    if (window.confirm("এই লেনদেন মুছবেন? / Delete this transaction?")) {
      setTransactions((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const updateTransaction = (index: number, updated: Transaction) => {
    setTransactions((prev) => prev.map((t, i) => (i === index ? updated : t)));
    toast.success("লেনদেন আপডেট হয়েছে / Transaction updated!");
  };

  // ─── Export Customers CSV ──────────────────────────────────────────────────

  const exportCustomersCSV = () => {
    const rows = [["Name", "Phone", "Address"]];
    for (const c of customers) {
      rows.push([c.name, c.phone, c.address]);
    }
    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "atrai_bhumisheba_customers.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("কাস্টমার CSV রপ্তানি সফল / Customers CSV exported!");
  };

  // ─── Export Full JSON Backup ───────────────────────────────────────────────

  const exportJSON = () => {
    const data = { customers, transactions };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `atrai_bhumisheba_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("JSON ব্যাকআপ রপ্তানি সফল / JSON backup exported!");
  };

  // ─── Import Customers CSV ──────────────────────────────────────────────────

  const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target?.result as string;
        const lines = text.trim().split("\n");
        // Skip header row
        const imported: Customer[] = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i]
            .split(",")
            .map((c) => c.replace(/^"|"$/g, "").trim());
          if (cols.length >= 1 && cols[0]) {
            imported.push({
              name: cols[0] ?? "",
              phone: cols[1] ?? "",
              address: cols[2] ?? "",
            });
          }
        }
        // Merge: append only if phone doesn't already exist
        setCustomers((prev) => {
          const existingPhones = new Set(prev.map((c) => c.phone));
          const newOnes = imported.filter(
            (c) => !c.phone || !existingPhones.has(c.phone),
          );
          if (newOnes.length === 0) {
            toast.error(
              "সব কাস্টমার ইতিমধ্যে বিদ্যমান / All customers already exist",
            );
            return prev;
          }
          toast.success(
            `${newOnes.length}জন কাস্টমার আমদানি হয়েছে / ${newOnes.length} customer(s) imported!`,
          );
          return [...prev, ...newOnes];
        });
      } catch {
        toast.error("CSV পড়তে সমস্যা হয়েছে / Failed to parse CSV file");
      }
      // Reset file input
      if (csvImportRef.current) csvImportRef.current.value = "";
    };
    reader.readAsText(file);
  };

  // ─── Import JSON Backup ────────────────────────────────────────────────────

  const handleJSONImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string) as {
          customers?: Customer[];
          transactions?: Transaction[];
        };
        const importedCustomers: Customer[] = data.customers ?? [];
        const importedTransactions: Transaction[] = data.transactions ?? [];

        setCustomers((prevCustomers) => {
          // Build a map from old imported index → new merged index
          const existingPhones = new Map(
            prevCustomers.map((c, i) => [c.phone, i]),
          );
          const indexMap = new Map<number, number>();
          const newCustomers: Customer[] = [...prevCustomers];

          importedCustomers.forEach((c, oldIdx) => {
            if (c.phone && existingPhones.has(c.phone)) {
              // Map to existing index
              indexMap.set(oldIdx, existingPhones.get(c.phone)!);
            } else {
              indexMap.set(oldIdx, newCustomers.length);
              newCustomers.push(c);
            }
          });

          // Remap transaction customer indices
          const remappedTxns = importedTransactions
            .filter((t) => indexMap.has(t.customer))
            .map((t) => ({ ...t, customer: indexMap.get(t.customer)! }));

          setTransactions((prevTxns) => [...prevTxns, ...remappedTxns]);

          const addedCustomers = newCustomers.length - prevCustomers.length;
          toast.success(
            `আমদানি সফল: ${addedCustomers}জন কাস্টমার, ${remappedTxns.length}টি লেনদেন / Imported: ${addedCustomers} customer(s), ${remappedTxns.length} transaction(s)`,
          );
          return newCustomers;
        });
      } catch {
        toast.error("JSON পড়তে সমস্যা হয়েছে / Failed to parse JSON backup");
      }
      // Reset file input
      if (jsonImportRef.current) jsonImportRef.current.value = "";
    };
    reader.readAsText(file);
  };

  const clearAllData = () => {
    if (
      window.confirm(
        "সব লেনদেন ডেটা মুছে ফেলবেন? এটি পূর্বাবস্থায় ফেরানো যাবে না। / Clear ALL transaction data? This cannot be undone.",
      )
    ) {
      setTransactions([]);
      toast.success("সব লেনদেন মুছে ফেলা হয়েছে / All transactions cleared");
    }
  };

  // ─── Drill-Down ───────────────────────────────────────────────────────────────

  const drillDown = (customerName: string) => {
    setSearch(customerName);
    setActiveTab("transactions");
  };

  // ─── Filtered Transactions (with original indices) ────────────────────────────

  const filteredTransactions: TransactionWithIndex[] = transactions
    .map((item, originalIndex) => ({ item, originalIndex }))
    .filter(({ item }) => {
      const cust = customers[item.customer];
      if (!cust) return false;
      if (search && !cust.name.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    });

  // ─── Customer Report ──────────────────────────────────────────────────────────

  const customerReport = customers.map((c, i) => {
    let income = 0;
    let expense = 0;
    let due = 0;
    let paid = 0;

    for (const item of transactions) {
      if (item.customer !== i) continue;
      if (item.type === "Income") income += item.amount;
      if (item.type === "Expense") expense += item.amount;
      if (item.type === "Due") due += item.amount;
      if (item.type === "Paid") {
        paid += item.amount;
        income += item.amount;
      }
    }

    return {
      customer: c,
      income,
      expense,
      due,
      paid,
      profit: income - expense,
    };
  });

  // ─── Chart Data ────────────────────────────────────────────────────────────────

  const barData = [
    { name: "আয় / Income", value: totalIncome },
    { name: "ব্যয় / Expense", value: totalExpense },
    { name: "বাকি / Due", value: totalDue },
    { name: "পরিশোধ / Paid", value: totalPaid },
    { name: "লাভ / Profit", value: profit },
  ];

  const pieData = customers
    .map((c, i) => {
      const income = transactions
        .filter(
          (d) => d.customer === i && (d.type === "Income" || d.type === "Paid"),
        )
        .reduce((acc, d) => acc + d.amount, 0);
      return income > 0 ? { name: c.name, value: income } : null;
    })
    .filter((d): d is { name: string; value: number } => d !== null);

  // ─── Export CSV (Excel-compatible) ───────────────────────────────────────────

  const exportExcel = () => {
    const rows = [["Date", "Type", "Customer", "Phone", "Address", "Amount"]];
    for (const item of transactions) {
      const c = customers[item.customer];
      if (c) {
        rows.push([
          item.date,
          item.type,
          c.name,
          c.phone,
          c.address,
          String(item.amount),
        ]);
      }
    }
    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "atrai_bhumisheba_transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV রপ্তানি সফল / CSV exported successfully!");
  };

  // ─── Export PDF (Print) ───────────────────────────────────────────────────────

  const exportPDF = () => {
    const rows = transactions
      .map((item) => {
        const c = customers[item.customer];
        return c
          ? `<tr><td>${item.date}</td><td>${item.type}</td><td>${c.name}</td><td>${c.phone}</td><td>${c.address}</td><td style="text-align:right">${item.amount.toLocaleString()}</td></tr>`
          : "";
      })
      .join("");

    const html = `<!DOCTYPE html><html><head><title>Atrai Online Bhumisheba And MA Computer Report</title>
    <style>body{font-family:sans-serif;font-size:12px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ccc;padding:6px 8px}th{background:#f0f0f0;font-weight:600}h2{margin-bottom:4px}p{margin:0 0 12px;color:#666;font-size:11px}</style>
    </head><body>
    <h2>Atrai Online Bhumisheba And MA Computer – Transaction Report</h2>
    <p>Generated: ${new Date().toLocaleDateString()}</p>
    <table><thead><tr><th>Date</th><th>Type</th><th>Customer</th><th>Phone</th><th>Address</th><th>Amount</th></tr></thead><tbody>${rows}</tbody></table>
    </body></html>`;

    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
      win.focus();
      win.print();
    }
    toast.success("PDF প্রিন্ট ডায়ালগ খোলা হয়েছে / PDF print dialog opened!");
  };

  // ─── Sample Data ──────────────────────────────────────────────────────────────

  const loadSampleData = () => {
    const sampleCustomers: Customer[] = [
      {
        name: "রহিম মিয়া",
        phone: "01711-234567",
        address: "ঢাকা, বাংলাদেশ",
      },
      {
        name: "করিম সাহেব",
        phone: "01812-345678",
        address: "চট্টগ্রাম, বাংলাদেশ",
      },
      {
        name: "সালমা বেগম",
        phone: "01913-456789",
        address: "সিলেট, বাংলাদেশ",
      },
    ];
    setCustomers(sampleCustomers);
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .slice(0, 10);
    setTransactions([
      { date: yesterday, type: "Income", customer: 0, amount: 50000 },
      { date: yesterday, type: "Expense", customer: 0, amount: 15000 },
      { date: yesterday, type: "Income", customer: 1, amount: 75000 },
      { date: today, type: "Due", customer: 1, amount: 20000 },
      { date: today, type: "Paid", customer: 2, amount: 30000 },
      { date: today, type: "Income", customer: 2, amount: 45000 },
    ]);
    toast.success("নমুনা ডেটা লোড হয়েছে / Sample data loaded!");
  };

  // ─── PIN screen ────────────────────────────────────────────────────────────────

  if (!isUnlocked) {
    return (
      <>
        <Toaster richColors position="bottom-right" />
        <PinLogin
          mode={pinMode}
          onUnlock={() => {
            setIsUnlocked(true);
            setPinMode("unlock");
          }}
        />
      </>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────────

  const currentYear = new Date().getFullYear();

  return (
    <div
      className="min-h-screen font-sans flex flex-col"
      style={{
        backgroundImage:
          "url('/assets/uploads/dfe62c06-78a6-4a41-bddc-1e867d7af519-2.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Toaster richColors position="bottom-right" />

      <ChangePinModal
        open={changePinOpen}
        onClose={() => setChangePinOpen(false)}
      />

      {/* ── Keyboard Shortcuts Overlay ── */}
      {showShortcuts && (
        <dialog
          open
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 w-full h-full max-w-none m-0 border-0 bg-transparent"
          onClick={() => setShowShortcuts(false)}
          onKeyDown={(e) => e.key === "Escape" && setShowShortcuts(false)}
          aria-label="Keyboard Shortcuts"
        >
          <div
            className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                <h2 className="font-bold text-foreground text-base">
                  কীবোর্ড শর্টকাট / Keyboard Shortcuts
                </h2>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowShortcuts(false)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                aria-label="Close shortcuts overlay"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-2 text-left text-xs font-semibold text-muted-foreground">
                      শর্টকাট / Shortcut
                    </th>
                    <th className="pb-2 text-left text-xs font-semibold text-muted-foreground">
                      কাজ / Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {[
                    { key: "Ctrl + 1", action: "ড্যাশবোর্ড / Dashboard tab" },
                    { key: "Ctrl + 2", action: "কাস্টমার ট্যাব / Customers tab" },
                    {
                      key: "Ctrl + 3",
                      action: "লেনদেন ট্যাব / Transactions tab",
                    },
                    { key: "Ctrl + 4", action: "রিপোর্ট ট্যাব / Reports tab" },
                    { key: "Ctrl + 5", action: "সেটিংস ট্যাব / Settings tab" },
                    { key: "Ctrl + 6", action: "সাহায্য ট্যাব / Help tab" },
                    { key: "Ctrl + N", action: "নতুন কাস্টমার / New customer" },
                    { key: "Ctrl + K", action: "সার্চ ফোকাস / Focus search" },
                    { key: "Escape", action: "মডাল বন্ধ / Close modals" },
                    { key: "?", action: "এই তালিকা / This overlay" },
                  ].map((row) => (
                    <tr key={row.key}>
                      <td className="py-2.5 pr-4">
                        <kbd className="inline-flex items-center px-2 py-1 rounded bg-muted border border-border text-xs font-mono font-semibold text-foreground shadow-sm whitespace-nowrap">
                          {row.key}
                        </kbd>
                      </td>
                      <td className="py-2.5 text-sm text-foreground">
                        {row.action}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-3 text-xs text-muted-foreground text-center">
                Mac: Ctrl → Cmd (⌘) · Press ? to toggle
              </p>
            </div>
          </div>
        </dialog>
      )}

      <AddCustomerModal
        open={addCustomerOpen}
        onClose={() => setAddCustomerOpen(false)}
        onAdd={addCustomer}
      />

      <EditCustomerModal
        open={editCustomerIndex !== null}
        customer={
          editCustomerIndex !== null ? customers[editCustomerIndex] : null
        }
        onClose={() => setEditCustomerIndex(null)}
        onSave={editCustomer}
      />

      <InvoiceModal
        open={invoiceCustomerIdx !== null}
        onClose={() => setInvoiceCustomerIdx(null)}
        customer={
          invoiceCustomerIdx !== null ? customers[invoiceCustomerIdx] : null
        }
        customerIndex={invoiceCustomerIdx ?? 0}
        transactions={transactions}
        report={
          invoiceCustomerIdx !== null
            ? (customerReport[invoiceCustomerIdx] ?? null)
            : null
        }
      />

      <EditTransactionModal
        open={editTxnIndex !== null}
        onClose={() => setEditTxnIndex(null)}
        transaction={editTxnIndex !== null ? transactions[editTxnIndex] : null}
        originalIndex={editTxnIndex ?? 0}
        customers={customers}
        onSave={updateTransaction}
      />

      {/* Hidden file inputs for Import */}
      <input
        ref={csvImportRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleCSVImport}
        aria-label="Import CSV"
      />
      <input
        ref={jsonImportRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleJSONImport}
        aria-label="Import JSON"
      />

      {/* ── Mobile Header ── */}
      <header className="md:hidden financial-gradient sticky top-0 z-50 shadow-lg">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/assets/uploads/logo-1.jpg"
              alt="ভূমি সেবা"
              className="h-9 w-9 object-contain rounded-lg"
              style={{ boxShadow: "0 0 12px oklch(0.82 0.15 62 / 0.25)" }}
            />
            <div>
              <h1
                className="text-white font-black leading-none"
                style={{
                  fontSize: "0.9rem",
                  letterSpacing: "-0.02em",
                  textShadow: "0 1px 3px rgba(0,0,0,0.5)",
                }}
              >
                Atrai Online Bhumisheba
              </h1>
              <p
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: "oklch(0.88 0.14 62)",
                }}
              >
                ভূমি সেবা ও কম্পিউটার
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setChangePinOpen(true)}
              className="text-white hover:bg-white/10 hover:text-white border border-white/20 h-8 w-8 p-0"
              aria-label="Change PIN"
            >
              <KeyRound className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsUnlocked(false)}
              className="text-white hover:bg-white/10 hover:text-white border border-white/20 h-8 w-8 p-0"
              aria-label="Lock app"
            >
              <Lock className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDarkMode((d) => !d)}
              className="text-white hover:bg-white/10 hover:text-white border border-white/20 h-8 w-8 p-0"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <SidebarNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          darkMode={darkMode}
          onToggleDark={() => setDarkMode((d) => !d)}
          onLock={() => setIsUnlocked(false)}
          onChangePin={() => setChangePinOpen(true)}
          className="hidden md:flex"
          showInstallBanner={showInstallBanner}
          onInstall={handleInstall}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto min-h-0 p-4 md:p-6 xl:p-8 pb-24 md:pb-8 space-y-6 w-full main-glass">
          {/* ── Mobile PWA Install Banner ── */}
          {showInstallBanner && (
            <div className="md:hidden flex items-center gap-3 p-3 rounded-xl bg-primary/10 border border-primary/30 text-sm">
              <Download className="h-4 w-4 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-primary">
                  অ্যাপ ইনস্টল করুন
                </span>
                <span className="text-muted-foreground text-xs ml-1">
                  / Install App
                </span>
              </div>
              <Button
                size="sm"
                onClick={handleInstall}
                className="h-7 text-xs px-3 flex-shrink-0"
              >
                ইনস্টল
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowInstallBanner(false)}
                className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground flex-shrink-0"
                aria-label="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              TAB 0 — DASHBOARD
          ═══════════════════════════════════════════════════════════ */}
          {activeTab === "dashboard" && (
            <DashboardPage
              customers={customers}
              transactions={transactions}
              darkMode={darkMode}
              onDrillDown={(name) => {
                setSearch(name);
                setActiveTab("transactions");
              }}
            />
          )}

          {/* ═══════════════════════════════════════════════════════════
              TAB 1 — CUSTOMERS (Row Layout)
          ═══════════════════════════════════════════════════════════ */}
          {activeTab === "customers" && (
            <section aria-label="কাস্টমার তালিকা">
              {/* Header row */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="section-header">কাস্টমার প্রোফাইল</h2>
                  <p className="section-subheader">
                    Customer Profiles — {customers.length}জন /{" "}
                    {customers.length} customers
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Export / Import Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="outline" className="gap-1.5">
                        <Download className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">ফাইল / </span>File
                        <ChevronDown className="h-3 w-3 ml-0.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                      <DropdownMenuItem
                        onClick={exportCustomersCSV}
                        className="gap-2 cursor-pointer"
                      >
                        <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                        CSV রপ্তানি / Export CSV
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={exportJSON}
                        className="gap-2 cursor-pointer"
                      >
                        <Download className="h-3.5 w-3.5 text-blue-600" />
                        JSON ব্যাকআপ / Export JSON
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => csvImportRef.current?.click()}
                        className="gap-2 cursor-pointer"
                      >
                        <Upload className="h-3.5 w-3.5 text-amber-600" />
                        CSV আমদানি / Import CSV
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => jsonImportRef.current?.click()}
                        className="gap-2 cursor-pointer"
                      >
                        <Upload className="h-3.5 w-3.5 text-violet-600" />
                        JSON পুনরুদ্ধার / Import JSON
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Add Customer Button */}
                  <Button
                    size="sm"
                    onClick={() => setAddCustomerOpen(true)}
                    className="gap-1.5"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">কাস্টমার যোগ করুন / </span>
                    Add
                  </Button>
                </div>
              </div>

              {/* Empty State */}
              {customers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      কোনো কাস্টমার নেই
                    </p>
                    <p className="text-sm text-muted-foreground">
                      No customers yet. Add your first customer to get started.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      size="sm"
                      onClick={() => setAddCustomerOpen(true)}
                      className="gap-1.5"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      কাস্টমার যোগ করুন / Add Customer
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={loadSampleData}
                    >
                      নমুনা ডেটা / Load Sample Data
                    </Button>
                  </div>
                </div>
              ) : (
                /* ── Customer Row Layout ── */
                <div className="flex flex-col gap-3">
                  {customers.map((customer, index) => {
                    const report = customerReport[index];
                    const avatarConfig =
                      AVATAR_COLORS[index % AVATAR_COLORS.length];
                    const initial = customer.name.charAt(0).toUpperCase();
                    const netBalance =
                      (report?.income ?? 0) - (report?.expense ?? 0);
                    const isPositive = netBalance >= 0;
                    const isExpanded = expandedCustomers.has(index);

                    // Transactions for this customer, newest first (last 5 when expanded)
                    const custTxnsAll = transactions
                      .map((t, i) => ({ t, i }))
                      .filter(({ t }) => t.customer === index)
                      .reverse();
                    const custTxns = custTxnsAll.slice(0, 5);

                    return (
                      <div
                        key={`customer-row-${index}-${customer.name}`}
                        className="bg-card border border-border rounded-xl shadow-sm overflow-hidden"
                      >
                        {/* ── Colored left accent bar ── */}
                        <div className="flex">
                          <div
                            className="w-1 flex-shrink-0"
                            style={{ background: avatarConfig.hex }}
                          />

                          {/* ── Main row content ── */}
                          <div className="flex-1 p-4">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                              {/* LEFT: Avatar + Info */}
                              <div className="flex items-center gap-3 sm:w-56 flex-shrink-0">
                                <div
                                  className={`${avatarConfig.bg} flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm`}
                                >
                                  {initial}
                                </div>
                                <div className="min-w-0">
                                  <h3
                                    className="font-bold text-white leading-tight"
                                    style={{
                                      fontSize: "1rem",
                                      letterSpacing: "-0.01em",
                                      textShadow: "0 1px 3px rgba(0,0,0,0.4)",
                                    }}
                                  >
                                    {customer.name}
                                  </h3>
                                  <span
                                    className={`inline-flex items-center mt-0.5 px-2 py-0.5 rounded-full text-xs font-semibold ${
                                      isPositive
                                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                                        : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                                    }`}
                                  >
                                    {isPositive ? "+" : ""}
                                    {fmtAmt(netBalance)} ৳
                                  </span>
                                  <div className="mt-1.5 space-y-0.5">
                                    {customer.phone && (
                                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Phone className="h-3 w-3 flex-shrink-0" />
                                        <span className="truncate">
                                          {customer.phone}
                                        </span>
                                      </div>
                                    )}
                                    {customer.address && (
                                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <MapPin className="h-3 w-3 flex-shrink-0" />
                                        <span className="truncate">
                                          {customer.address}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* MIDDLE: Stats grid */}
                              <div className="flex-1 grid grid-cols-4 gap-1.5">
                                <div className="text-center py-2 px-1.5 rounded-lg bg-emerald-600/60 border border-emerald-400/30">
                                  <p
                                    style={{
                                      fontSize: "0.6rem",
                                      fontWeight: 700,
                                      letterSpacing: "0.06em",
                                      textTransform: "uppercase",
                                      color: "rgba(255,255,255,0.88)",
                                      lineHeight: 1,
                                      marginBottom: "0.25rem",
                                    }}
                                  >
                                    আয়
                                  </p>
                                  <p
                                    className="text-white tabular-nums"
                                    style={{
                                      fontSize: "0.8125rem",
                                      fontWeight: 900,
                                      letterSpacing: "-0.01em",
                                    }}
                                  >
                                    {fmtAmt(report?.income ?? 0)}
                                  </p>
                                </div>
                                <div className="text-center py-2 px-1.5 rounded-lg bg-red-600/60 border border-red-400/30">
                                  <p
                                    style={{
                                      fontSize: "0.6rem",
                                      fontWeight: 700,
                                      letterSpacing: "0.06em",
                                      textTransform: "uppercase",
                                      color: "rgba(255,255,255,0.88)",
                                      lineHeight: 1,
                                      marginBottom: "0.25rem",
                                    }}
                                  >
                                    ব্যয়
                                  </p>
                                  <p
                                    className="text-white tabular-nums"
                                    style={{
                                      fontSize: "0.8125rem",
                                      fontWeight: 900,
                                      letterSpacing: "-0.01em",
                                    }}
                                  >
                                    {fmtAmt(report?.expense ?? 0)}
                                  </p>
                                </div>
                                <div className="text-center py-2 px-1.5 rounded-lg bg-amber-500/60 border border-amber-400/30">
                                  <p
                                    style={{
                                      fontSize: "0.6rem",
                                      fontWeight: 700,
                                      letterSpacing: "0.06em",
                                      textTransform: "uppercase",
                                      color: "rgba(255,255,255,0.88)",
                                      lineHeight: 1,
                                      marginBottom: "0.25rem",
                                    }}
                                  >
                                    বাকি
                                  </p>
                                  <p
                                    className="text-white tabular-nums"
                                    style={{
                                      fontSize: "0.8125rem",
                                      fontWeight: 900,
                                      letterSpacing: "-0.01em",
                                    }}
                                  >
                                    {fmtAmt(report?.due ?? 0)}
                                  </p>
                                </div>
                                <div className="text-center py-2 px-1.5 rounded-lg bg-blue-600/60 border border-blue-400/30">
                                  <p
                                    style={{
                                      fontSize: "0.6rem",
                                      fontWeight: 700,
                                      letterSpacing: "0.06em",
                                      textTransform: "uppercase",
                                      color: "rgba(255,255,255,0.88)",
                                      lineHeight: 1,
                                      marginBottom: "0.25rem",
                                    }}
                                  >
                                    পরিশোধ
                                  </p>
                                  <p
                                    className="text-white tabular-nums"
                                    style={{
                                      fontSize: "0.8125rem",
                                      fontWeight: 900,
                                      letterSpacing: "-0.01em",
                                    }}
                                  >
                                    {fmtAmt(report?.paid ?? 0)}
                                  </p>
                                </div>
                              </div>

                              {/* RIGHT: Action buttons */}
                              <div className="flex flex-row sm:flex-col gap-1.5 flex-shrink-0 sm:w-auto">
                                {/* Invoice button */}
                                <Button
                                  size="sm"
                                  onClick={() => setInvoiceCustomerIdx(index)}
                                  className="gap-1 h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex-1 sm:flex-none"
                                >
                                  <Receipt className="h-3 w-3" />
                                  <span className="hidden sm:inline">
                                    ইনভয়েজ /
                                  </span>{" "}
                                  Invoice
                                </Button>
                                {/* Add Transaction */}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedCustomerIdx(String(index));
                                    setActiveTab("transactions");
                                  }}
                                  className="gap-1 h-8 text-xs text-primary border-primary/30 hover:bg-primary/10 flex-1 sm:flex-none"
                                >
                                  <PlusCircle className="h-3 w-3" />
                                  <span className="hidden sm:inline">
                                    লেনদেন যোগ
                                  </span>
                                </Button>
                                {/* Edit + Delete inline */}
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setEditCustomerIndex(index)}
                                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                                    aria-label="Edit customer"
                                  >
                                    <Edit2 className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => deleteCustomer(index)}
                                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                    aria-label="Delete customer"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* ── Toggle transactions button ── */}
                        <div className="border-t border-border/60 px-5 py-2 flex items-center justify-between bg-muted/20">
                          <span className="text-xs text-muted-foreground">
                            {custTxnsAll.length} লেনদেন / transactions
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleExpanded(index)}
                            className="h-6 text-[11px] text-primary hover:bg-primary/10 px-2 gap-1"
                          >
                            {isExpanded ? (
                              <>
                                লুকান <ChevronUp className="h-3 w-3" />
                              </>
                            ) : (
                              <>
                                লেনদেন দেখুন / View{" "}
                                <ChevronDown className="h-3 w-3" />
                              </>
                            )}
                          </Button>
                        </div>

                        {/* ── Collapsible transactions list ── */}
                        {isExpanded && (
                          <div className="px-4 pb-4 pt-2 bg-muted/10">
                            {custTxns.length === 0 ? (
                              <p className="text-xs text-muted-foreground text-center py-3">
                                কোনো লেনদেন নেই / No transactions yet
                              </p>
                            ) : (
                              <div className="space-y-1">
                                {custTxns.map(({ t, i }) => (
                                  <div
                                    key={i}
                                    className="flex items-center gap-2 py-1.5 px-3 rounded-lg hover:bg-muted/60 transition-colors group bg-card border border-border/40"
                                  >
                                    <span
                                      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold flex-shrink-0 ${typeBadgeVariant[t.type as TransactionType]}`}
                                    >
                                      {t.type}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground flex-shrink-0 font-mono">
                                      {t.date}
                                    </span>
                                    <span className="flex-1 text-xs font-semibold tabular-nums text-right">
                                      {t.amount.toLocaleString()} ৳
                                    </span>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="h-5 w-5 p-0 text-muted-foreground/40 hover:text-foreground hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                          aria-label="Transaction options"
                                        >
                                          <MoreVertical className="h-3 w-3" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent
                                        align="end"
                                        className="w-36"
                                      >
                                        <DropdownMenuItem
                                          onClick={() => setEditTxnIndex(i)}
                                          className="gap-2 cursor-pointer text-xs"
                                        >
                                          <Edit2 className="h-3.5 w-3.5 text-primary" />
                                          সংশোধন / Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                          onClick={() => deleteTransaction(i)}
                                          className="gap-2 cursor-pointer text-xs text-destructive focus:text-destructive"
                                        >
                                          <Trash2 className="h-3.5 w-3.5" />
                                          মুছুন / Delete
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                ))}
                                {custTxnsAll.length > 5 && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => drillDown(customer.name)}
                                    className="w-full h-7 text-xs text-primary hover:bg-primary/10"
                                  >
                                    আরও {custTxnsAll.length - 5}টি দেখুন / View{" "}
                                    {custTxnsAll.length - 5} more →
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════════
              TAB 2 — TRANSACTIONS
          ═══════════════════════════════════════════════════════════ */}
          {activeTab === "transactions" && (
            <section aria-label="লেনদেন">
              {/* Add Transaction Form */}
              <Card className="shadow-sm mb-4">
                <CardHeader className="pb-3">
                  <CardTitle
                    className="flex items-center gap-2"
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 700,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    <PlusCircle
                      className="h-4 w-4"
                      style={{ color: "oklch(0.88 0.14 62)" }}
                    />
                    লেনদেন যোগ করুন / Add Transaction
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Customer selector */}
                  <select
                    value={selectedCustomerIdx}
                    onChange={(e) => setSelectedCustomerIdx(e.target.value)}
                    className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    aria-label="Select customer for transaction"
                  >
                    <option value="">
                      -- কাস্টমার নির্বাচন করুন / Select Customer --
                    </option>
                    {customers.map((c, i) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: customer indices are stable references
                      <option key={i} value={i}>
                        {c.name} ({c.phone})
                      </option>
                    ))}
                  </select>

                  <div className="grid gap-2 sm:grid-cols-2">
                    <Input
                      type="date"
                      value={txnDate}
                      onChange={(e) => setTxnDate(e.target.value)}
                      className="text-sm"
                    />
                    <Input
                      type="number"
                      placeholder="পরিমাণ / Amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") addTransaction(txnType);
                      }}
                      min="0"
                      step="any"
                    />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <Button
                      onClick={() => addTransaction("Income")}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white border-0 gap-1"
                      size="sm"
                    >
                      <TrendingUp className="h-3.5 w-3.5" />
                      আয় / Income
                    </Button>
                    <Button
                      onClick={() => addTransaction("Expense")}
                      className="bg-red-600 hover:bg-red-700 text-white border-0 gap-1"
                      size="sm"
                    >
                      <TrendingDown className="h-3.5 w-3.5" />
                      ব্যয় / Expense
                    </Button>
                    <Button
                      onClick={() => addTransaction("Due")}
                      className="bg-amber-500 hover:bg-amber-600 text-white border-0 gap-1"
                      size="sm"
                    >
                      <Clock className="h-3.5 w-3.5" />
                      বাকি / Due
                    </Button>
                    <Button
                      onClick={() => addTransaction("Paid")}
                      className="bg-blue-600 hover:bg-blue-700 text-white border-0 gap-1"
                      size="sm"
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      পরিশোধ / Paid
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllData}
                    className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30 gap-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    সব লেনদেন মুছুন / Clear All Transactions
                  </Button>
                </CardContent>
              </Card>

              {/* Transaction List */}
              <Card className="shadow-sm" id="transactionTable">
                <CardHeader className="pb-3">
                  <CardTitle
                    className="flex items-center gap-2"
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 700,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    <FileText
                      className="h-4 w-4"
                      style={{ color: "oklch(0.88 0.14 62)" }}
                    />
                    লেনদেন তালিকা / Transaction List
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      ref={searchInputRef}
                      placeholder="কাস্টমার নামে খুঁজুন / Search by customer name…"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="text-sm flex-1"
                    />
                    {search && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSearch("")}
                        className="text-muted-foreground hover:text-foreground px-2"
                      >
                        ✕
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={exportExcel}
                      size="sm"
                      className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white border-0 gap-1"
                    >
                      <FileSpreadsheet className="h-3.5 w-3.5" />
                      CSV রপ্তানি / Export CSV
                    </Button>
                    <Button
                      onClick={exportPDF}
                      size="sm"
                      className="flex-1 bg-red-700 hover:bg-red-800 text-white border-0 gap-1"
                    >
                      <Download className="h-3.5 w-3.5" />
                      PDF রপ্তানি / Export PDF
                    </Button>
                  </div>
                  <div className="overflow-x-auto rounded-md border border-border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr
                          className="border-b border-border"
                          style={{ background: "oklch(0 0 0 / 0.30)" }}
                        >
                          <th className="table-header-cell text-left whitespace-nowrap">
                            তারিখ / Date
                          </th>
                          <th className="table-header-cell text-left">
                            ধরন / Type
                          </th>
                          <th className="table-header-cell text-left">
                            কাস্টমার / Customer
                          </th>
                          <th className="table-header-cell text-left hidden md:table-cell">
                            ফোন / Phone
                          </th>
                          <th className="table-header-cell text-left hidden lg:table-cell">
                            ঠিকানা / Address
                          </th>
                          <th className="table-header-cell text-right">
                            পরিমাণ / Amount
                          </th>
                          <th className="table-header-cell text-center w-10">
                            অপশন
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTransactions.length === 0 ? (
                          <tr>
                            <td
                              colSpan={7}
                              className="px-3 py-8 text-center text-muted-foreground text-sm"
                            >
                              {search
                                ? `"${search}" এর কোনো লেনদেন পাওয়া যায়নি / No transactions match your search.`
                                : "কোনো লেনদেন নেই। উপরে প্রথম লেনদেন যোগ করুন। / No transactions yet."}
                            </td>
                          </tr>
                        ) : (
                          filteredTransactions.map(
                            ({ item, originalIndex }) => {
                              const cust = customers[item.customer];
                              if (!cust) return null;
                              return (
                                <tr
                                  key={originalIndex}
                                  className="border-b border-border/60 hover:bg-muted/40 transition-colors"
                                >
                                  <td
                                    className="px-3 py-2.5 whitespace-nowrap"
                                    style={{
                                      fontSize: "0.75rem",
                                      opacity: 0.78,
                                      fontFamily: "monospace",
                                      letterSpacing: "0.02em",
                                    }}
                                  >
                                    {item.date}
                                  </td>
                                  <td className="px-3 py-2.5">
                                    <span
                                      className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold ${typeBadgeVariant[item.type]}`}
                                      style={{
                                        fontSize: "0.7rem",
                                        letterSpacing: "0.04em",
                                      }}
                                    >
                                      {item.type}
                                    </span>
                                  </td>
                                  <td
                                    className="px-3 py-2.5 font-semibold"
                                    style={{ fontSize: "0.875rem" }}
                                  >
                                    {cust.name}
                                  </td>
                                  <td
                                    className="px-3 py-2.5 hidden md:table-cell"
                                    style={{
                                      opacity: 0.78,
                                      fontSize: "0.8125rem",
                                    }}
                                  >
                                    {cust.phone}
                                  </td>
                                  <td
                                    className="px-3 py-2.5 hidden lg:table-cell"
                                    style={{
                                      opacity: 0.78,
                                      fontSize: "0.8125rem",
                                    }}
                                  >
                                    {cust.address}
                                  </td>
                                  <td className="px-3 py-2.5 text-right amount-value">
                                    {item.amount.toLocaleString()} ৳
                                  </td>
                                  <td className="px-3 py-2 text-center">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                                          aria-label="Transaction options"
                                        >
                                          <MoreVertical className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent
                                        align="end"
                                        className="w-40"
                                      >
                                        <DropdownMenuItem
                                          onClick={() =>
                                            setEditTxnIndex(originalIndex)
                                          }
                                          className="gap-2 cursor-pointer"
                                        >
                                          <Edit2 className="h-3.5 w-3.5 text-primary" />
                                          সংশোধন / Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                          onClick={() =>
                                            deleteTransaction(originalIndex)
                                          }
                                          className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                                        >
                                          <Trash2 className="h-3.5 w-3.5" />
                                          মুছুন / Delete
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </td>
                                </tr>
                              );
                            },
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                  {filteredTransactions.length > 0 && (
                    <p className="text-xs text-muted-foreground text-right">
                      {filteredTransactions.length}টি লেনদেন
                      {search ? ` "${search}" এর জন্য` : " মোট"}
                      {" / "}
                      {filteredTransactions.length} transaction
                      {filteredTransactions.length !== 1 ? "s" : ""}
                      {search ? ` matching "${search}"` : " total"}
                    </p>
                  )}
                </CardContent>
              </Card>
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════════
              TAB 3 — REPORTS + CHARTS
          ═══════════════════════════════════════════════════════════ */}
          {activeTab === "reports" && (
            <section aria-label="রিপোর্ট">
              {/* Section title */}
              <div className="mb-6">
                <h2 className="section-header">কাস্টমার রিপোর্ট</h2>
                <p className="section-subheader">
                  Customer Reports &amp; Analytics
                </p>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
                <SummaryCard
                  label="আয় / Income"
                  value={totalIncome}
                  colorClass="text-white"
                  bgClass="bg-emerald-600/70 border-emerald-400/40"
                  icon={<TrendingUp className="h-4 w-4 text-white" />}
                />
                <SummaryCard
                  label="ব্যয় / Expense"
                  value={totalExpense}
                  colorClass="text-white"
                  bgClass="bg-red-600/70 border-red-400/40"
                  icon={<TrendingDown className="h-4 w-4 text-white" />}
                />
                <SummaryCard
                  label="বাকি / Due"
                  value={totalDue}
                  colorClass="text-white"
                  bgClass="bg-amber-500/70 border-amber-400/40"
                  icon={<Clock className="h-4 w-4 text-white" />}
                />
                <SummaryCard
                  label="পরিশোধ / Paid"
                  value={totalPaid}
                  colorClass="text-white"
                  bgClass="bg-blue-600/70 border-blue-400/40"
                  icon={<CheckCircle className="h-4 w-4 text-white" />}
                />
                <div
                  className={`col-span-2 sm:col-span-1 rounded-lg border p-3 text-center shadow-xs transition-colors ${
                    profit >= 0
                      ? "bg-emerald-600/70 border-emerald-400/40"
                      : "bg-red-600/70 border-red-400/40"
                  }`}
                >
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <BarChart3 className="h-4 w-4 text-white" />
                  </div>
                  <p
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.88)",
                    }}
                  >
                    লাভ / Profit
                  </p>
                  <p
                    className="text-white leading-tight tabular-nums"
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 900,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {profit.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Customer Report Table */}
              <Card className="shadow-sm mb-5">
                <CardHeader className="pb-3">
                  <CardTitle
                    className="flex items-center gap-2"
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 700,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    <FileText
                      className="h-4 w-4"
                      style={{ color: "oklch(0.88 0.14 62)" }}
                    />
                    কাস্টমার রিপোর্ট / Customer Report
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    রো ক্লিক করলে সেই কাস্টমারের লেনদেন দেখা যাবে / Click a row to
                    view that customer's transactions
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto rounded-md border border-border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr
                          className="border-b border-border"
                          style={{ background: "oklch(0 0 0 / 0.30)" }}
                        >
                          <th className="table-header-cell text-left">কাস্টমার</th>
                          <th className="table-header-cell text-left hidden md:table-cell">
                            ফোন
                          </th>
                          <th className="table-header-cell text-left hidden lg:table-cell">
                            ঠিকানা
                          </th>
                          <th className="table-header-cell text-right">আয়</th>
                          <th className="table-header-cell text-right">ব্যয়</th>
                          <th className="table-header-cell text-right">বাকি</th>
                          <th className="table-header-cell text-right">
                            পরিশোধ
                          </th>
                          <th className="table-header-cell text-right">লাভ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customerReport.length === 0 ? (
                          <tr>
                            <td
                              colSpan={8}
                              className="px-3 py-8 text-center text-muted-foreground text-sm"
                            >
                              কোনো কাস্টমার নেই। কাস্টমার ট্যাবে যোগ করুন। / No customers
                              yet. Add customers from the Customers tab.
                            </td>
                          </tr>
                        ) : (
                          customerReport.map((row) => (
                            <tr
                              key={row.customer.name}
                              onClick={() => drillDown(row.customer.name)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ")
                                  drillDown(row.customer.name);
                              }}
                              tabIndex={0}
                              className="border-b border-border/60 hover:bg-primary/5 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              <td
                                className="px-3 py-2.5 font-semibold"
                                style={{ fontSize: "0.875rem" }}
                              >
                                {row.customer.name}
                              </td>
                              <td
                                className="px-3 py-2.5 hidden md:table-cell"
                                style={{ opacity: 0.78, fontSize: "0.8125rem" }}
                              >
                                {row.customer.phone}
                              </td>
                              <td
                                className="px-3 py-2.5 hidden lg:table-cell"
                                style={{ opacity: 0.78, fontSize: "0.8125rem" }}
                              >
                                {row.customer.address}
                              </td>
                              <td className="px-3 py-2.5 text-right amount-value text-emerald-300">
                                {row.income.toLocaleString()}
                              </td>
                              <td className="px-3 py-2.5 text-right amount-value text-red-300">
                                {row.expense.toLocaleString()}
                              </td>
                              <td className="px-3 py-2.5 text-right amount-value text-amber-300">
                                {row.due.toLocaleString()}
                              </td>
                              <td className="px-3 py-2.5 text-right amount-value text-blue-300">
                                {row.paid.toLocaleString()}
                              </td>
                              <td
                                className={`px-3 py-2.5 text-right amount-value ${
                                  row.profit >= 0
                                    ? "text-emerald-300"
                                    : "text-red-300"
                                }`}
                              >
                                {row.profit.toLocaleString()}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Charts Section */}
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle
                    className="flex items-center gap-2"
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 700,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    <BarChart3
                      className="h-4 w-4"
                      style={{ color: "oklch(0.88 0.14 62)" }}
                    />
                    চার্ট ও বিশ্লেষণ / Charts &amp; Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Bar Chart */}
                  <div>
                    <h3
                      style={{
                        fontSize: "0.8125rem",
                        fontWeight: 700,
                        letterSpacing: "0.03em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.78)",
                        marginBottom: "0.75rem",
                      }}
                    >
                      সামগ্রিক বার চার্ট / Overview Bar Chart
                    </h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={barData}
                          margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
                        >
                          <XAxis
                            dataKey="name"
                            tick={{
                              fontSize: 10,
                              fill: "rgba(255,255,255,0.8)",
                            }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis
                            tick={{
                              fontSize: 11,
                              fill: "rgba(255,255,255,0.8)",
                            }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => Number(v).toLocaleString()}
                            width={60}
                          />
                          <Tooltip
                            formatter={(v) => [Number(v).toLocaleString(), ""]}
                            contentStyle={{
                              background: "rgba(15,20,40,0.92)",
                              border: "1px solid rgba(255,255,255,0.15)",
                              borderRadius: 8,
                              fontSize: 12,
                              color: "#fff",
                            }}
                          />
                          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                            {barData.map((entry, i) => (
                              <Cell
                                key={entry.name}
                                fill={BAR_COLORS[i % BAR_COLORS.length]}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Pie Chart */}
                  <div>
                    <h3
                      style={{
                        fontSize: "0.8125rem",
                        fontWeight: 700,
                        letterSpacing: "0.03em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.78)",
                        marginBottom: "0.25rem",
                      }}
                    >
                      কাস্টমার অনুযায়ী আয় বিতরণ / Customer-wise Income Distribution
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      পাই চার্টের স্লাইস ক্লিক করলে সেই কাস্টমারের লেনদেন ফিল্টার হবে /
                      Click a slice to filter transactions by customer
                    </p>
                    {pieData.length === 0 ? (
                      <div className="h-48 flex items-center justify-center text-muted-foreground text-sm rounded-lg border border-dashed border-border">
                        এখনো কোনো আয় ডেটা নেই / No income data yet to display
                      </div>
                    ) : (
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieData}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="45%"
                              outerRadius={100}
                              onClick={(entry) => drillDown(entry.name)}
                              style={{ cursor: "pointer" }}
                            >
                              {pieData.map((entry, i) => (
                                <Cell key={entry.name} fill={getPieColor(i)} />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(v, name) => {
                                const total = pieData.reduce(
                                  (a, b) => a + b.value,
                                  0,
                                );
                                const pct = ((Number(v) / total) * 100).toFixed(
                                  1,
                                );
                                return [
                                  `${Number(v).toLocaleString()} (${pct}%)`,
                                  name,
                                ];
                              }}
                              contentStyle={{
                                background: "rgba(15,20,40,0.92)",
                                border: "1px solid rgba(255,255,255,0.15)",
                                borderRadius: 8,
                                fontSize: 12,
                                color: "#fff",
                              }}
                            />
                            <Legend
                              wrapperStyle={{
                                fontSize: 12,
                                color: "rgba(255,255,255,0.9)",
                                paddingTop: 8,
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════════
              TAB 3b — CUSTOMER REPORT (প্রতি কাস্টমারের আলাদা রিপোর্ট)
          ═══════════════════════════════════════════════════════════ */}
          {activeTab === "customer-report" && (
            <CustomerReportPage
              customers={customers}
              transactions={transactions}
            />
          )}

          {/* ═══════════════════════════════════════════════════════════
              TAB 4b — DUE LEDGER (বাকির হিসাব)
          ═══════════════════════════════════════════════════════════ */}
          {activeTab === "due-ledger" && (
            <section aria-label="বাকির হিসাব">
              <div className="mb-6">
                <h2 className="section-header">বাকির হিসাব</h2>
                <p className="section-subheader">
                  Due Ledger — Customer-wise Outstanding Balance
                </p>
              </div>

              {/* Summary cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                <div className="rounded-lg border p-3 text-center shadow-xs bg-amber-500/70 border-amber-400/40">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <p
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.88)",
                    }}
                  >
                    মোট বাকি / Total Due
                  </p>
                  <p
                    className="text-white leading-tight tabular-nums"
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 900,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {totalDue.toLocaleString()} ৳
                  </p>
                </div>
                <div className="rounded-lg border p-3 text-center shadow-xs bg-blue-600/70 border-blue-400/40">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <p
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.88)",
                    }}
                  >
                    মোট পরিশোধ / Total Paid
                  </p>
                  <p
                    className="text-white leading-tight tabular-nums"
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 900,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {totalPaid.toLocaleString()} ৳
                  </p>
                </div>
                <div
                  className={`col-span-2 sm:col-span-1 rounded-lg border p-3 text-center shadow-xs ${(totalDue - totalPaid) > 0 ? "bg-red-600/70 border-red-400/40" : "bg-emerald-600/70 border-emerald-400/40"}`}
                >
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingDown className="h-4 w-4 text-white" />
                  </div>
                  <p
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.88)",
                    }}
                  >
                    নিট বাকি / Net Outstanding
                  </p>
                  <p
                    className="text-white leading-tight tabular-nums"
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 900,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {(totalDue - totalPaid).toLocaleString()} ৳
                  </p>
                </div>
              </div>

              {/* Due Ledger Table */}
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle
                    className="flex items-center gap-2"
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 700,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    <Clock
                      className="h-4 w-4"
                      style={{ color: "oklch(0.88 0.14 62)" }}
                    />
                    কাস্টমার অনুযায়ী বাকির হিসাব / Customer-wise Due Ledger
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    ক্রমিক নম্বর অনুযায়ী সাজানো / Sorted by serial number
                  </p>
                </CardHeader>
                <CardContent>
                  {customers.length === 0 ? (
                    <div className="py-12 text-center text-muted-foreground text-sm">
                      কোনো কাস্টমার নেই। কাস্টমার প্রোফাইল মেনুতে যোগ করুন। / No customers
                      yet.
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-md border border-border">
                      <table className="w-full text-sm">
                        <thead>
                          <tr
                            className="border-b border-border"
                            style={{ background: "oklch(0 0 0 / 0.30)" }}
                          >
                            <th className="table-header-cell text-center w-10">
                              #
                            </th>
                            <th className="table-header-cell text-left">
                              কাস্টমার / Customer
                            </th>
                            <th className="table-header-cell text-left hidden md:table-cell">
                              ফোন / Phone
                            </th>
                            <th className="table-header-cell text-right">
                              বাকি / Due ৳
                            </th>
                            <th className="table-header-cell text-right">
                              পরিশোধ / Paid ৳
                            </th>
                            <th className="table-header-cell text-right">
                              নিট / Net ৳
                            </th>
                            <th className="table-header-cell text-center w-20">
                              অবস্থা
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {customerReport.map((row, idx) => {
                            const net = row.due - row.paid;
                            const isPaid = net <= 0;
                            return (
                              <tr
                                // biome-ignore lint/suspicious/noArrayIndexKey: customer indices are stable references
                                key={`due-row-${idx}`}
                                data-ocid={`due_ledger.table.row.${idx + 1}`}
                                onClick={() => drillDown(row.customer.name)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ")
                                    drillDown(row.customer.name);
                                }}
                                tabIndex={0}
                                className="border-b border-border/60 hover:bg-primary/5 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              >
                                <td
                                  className="px-3 py-2.5 text-center"
                                  style={{
                                    fontSize: "0.8rem",
                                    opacity: 0.7,
                                    fontWeight: 700,
                                  }}
                                >
                                  {idx + 1}
                                </td>
                                <td
                                  className="px-3 py-2.5 font-semibold"
                                  style={{ fontSize: "0.875rem" }}
                                >
                                  {row.customer.name}
                                </td>
                                <td
                                  className="px-3 py-2.5 hidden md:table-cell"
                                  style={{
                                    opacity: 0.78,
                                    fontSize: "0.8125rem",
                                  }}
                                >
                                  {row.customer.phone}
                                </td>
                                <td className="px-3 py-2.5 text-right amount-value text-amber-300">
                                  {row.due.toLocaleString()}
                                </td>
                                <td className="px-3 py-2.5 text-right amount-value text-blue-300">
                                  {row.paid.toLocaleString()}
                                </td>
                                <td
                                  className={`px-3 py-2.5 text-right amount-value font-bold ${net > 0 ? "text-red-300" : "text-emerald-300"}`}
                                >
                                  {net > 0
                                    ? `${net.toLocaleString()}`
                                    : `${Math.abs(net).toLocaleString()}`}
                                </td>
                                <td className="px-3 py-2.5 text-center">
                                  <span
                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${isPaid ? "bg-emerald-900/50 text-emerald-300" : "bg-red-900/50 text-red-300"}`}
                                  >
                                    {isPaid ? "পরিশোধিত" : "বাকি আছে"}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        {customerReport.length > 0 && (
                          <tfoot>
                            <tr
                              className="border-t-2 border-border"
                              style={{ background: "oklch(0 0 0 / 0.20)" }}
                            >
                              <td
                                colSpan={3}
                                className="px-3 py-2.5 text-xs font-bold text-muted-foreground uppercase tracking-wide"
                              >
                                মোট / Total ({customers.length}জন)
                              </td>
                              <td className="px-3 py-2.5 text-right amount-value text-amber-300 font-bold">
                                {totalDue.toLocaleString()}
                              </td>
                              <td className="px-3 py-2.5 text-right amount-value text-blue-300 font-bold">
                                {totalPaid.toLocaleString()}
                              </td>
                              <td
                                className={`px-3 py-2.5 text-right amount-value font-bold ${(totalDue - totalPaid) > 0 ? "text-red-300" : "text-emerald-300"}`}
                              >
                                {(totalDue - totalPaid).toLocaleString()}
                              </td>
                              <td className="px-3 py-2.5 text-center">
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${(totalDue - totalPaid) <= 0 ? "bg-emerald-900/50 text-emerald-300" : "bg-red-900/50 text-red-300"}`}
                                >
                                  {totalDue - totalPaid <= 0
                                    ? "সব পরিশোধিত"
                                    : `${customerReport.filter((r) => r.due > r.paid).length}জন বাকি`}
                                </span>
                              </td>
                            </tr>
                          </tfoot>
                        )}
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════════
              TAB 5 — SETTINGS
          ═══════════════════════════════════════════════════════════ */}
          {activeTab === "settings" && (
            <SettingsPage
              darkMode={darkMode}
              onToggleDark={() => setDarkMode((d) => !d)}
              onLock={() => setIsUnlocked(false)}
              onChangePin={() => setChangePinOpen(true)}
              onExportCSV={exportCustomersCSV}
              onExportJSON={exportJSON}
              onImportCSV={() => csvImportRef.current?.click()}
              onImportJSON={() => jsonImportRef.current?.click()}
              onClearTransactions={clearAllData}
              customerCount={customers.length}
              transactionCount={transactions.length}
            />
          )}

          {/* ═══════════════════════════════════════════════════════════
              TAB 6 — HELP
          ═══════════════════════════════════════════════════════════ */}
          {activeTab === "help" && <HelpPage />}

          {/* ── Footer ── */}
          <footer className="mt-6 border-t border-border pt-4 text-center">
            <p className="text-xs text-muted-foreground">
              © {currentYear}. Built with{" "}
              <span className="text-red-500">♥</span> using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  window.location.hostname,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </footer>
        </main>
      </div>
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="md:hidden"
      />
    </div>
  );
}

// ─── Summary Card Sub-component ───────────────────────────────────────────────

interface SummaryCardProps {
  label: string;
  value: number;
  colorClass: string;
  bgClass: string;
  icon: React.ReactNode;
}

function SummaryCard({
  label,
  value,
  colorClass,
  bgClass,
  icon,
}: SummaryCardProps) {
  return (
    <div
      className={`rounded-lg border p-3 text-center shadow-xs transition-colors ${bgClass}`}
    >
      <div className="flex items-center justify-center gap-1 mb-1">{icon}</div>
      <p
        style={{
          fontSize: "0.68rem",
          fontWeight: 700,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.88)",
        }}
      >
        {label}
      </p>
      <p
        className={`leading-tight tabular-nums ${colorClass}`}
        style={{
          fontSize: "1.25rem",
          fontWeight: 900,
          letterSpacing: "-0.02em",
        }}
      >
        {value.toLocaleString()}
      </p>
    </div>
  );
}
