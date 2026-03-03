import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Download,
  FileSpreadsheet,
  FileText,
  MapPin,
  Phone,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";

interface Customer {
  name: string;
  phone: string;
  address: string;
}

type TransactionType = "Income" | "Expense" | "Due" | "Paid";

interface Transaction {
  date: string;
  type: TransactionType;
  customer: number;
  amount: number;
}

interface CustomerReportPageProps {
  customers: Customer[];
  transactions: Transaction[];
}

const AVATAR_COLORS = [
  { bg: "bg-violet-500", hex: "#8b5cf6" },
  { bg: "bg-emerald-500", hex: "#10b981" },
  { bg: "bg-blue-500", hex: "#3b82f6" },
  { bg: "bg-amber-500", hex: "#f59e0b" },
  { bg: "bg-rose-500", hex: "#f43f5e" },
  { bg: "bg-cyan-500", hex: "#06b6d4" },
  { bg: "bg-indigo-500", hex: "#6366f1" },
  { bg: "bg-teal-500", hex: "#14b8a6" },
];

const typeBadgeVariant: Record<TransactionType, string> = {
  Income: "bg-emerald-900/50 text-emerald-300",
  Expense: "bg-red-900/50 text-red-300",
  Due: "bg-amber-900/50 text-amber-300",
  Paid: "bg-blue-900/50 text-blue-300",
};

function fmtAmt(n: number) {
  if (n >= 100000) return `${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toLocaleString();
}

export default function CustomerReportPage({
  customers,
  transactions,
}: CustomerReportPageProps) {
  const [expandedCustomers, setExpandedCustomers] = useState<Set<number>>(
    new Set(),
  );
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const toggleExpanded = (index: number) => {
    setExpandedCustomers((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const expandAll = () => {
    setExpandedCustomers(new Set(customers.map((_, i) => i)));
  };

  const collapseAll = () => {
    setExpandedCustomers(new Set());
  };

  // Build per-customer report data
  const customerReports = customers.map((c, i) => {
    let income = 0;
    let expense = 0;
    let due = 0;
    let paid = 0;

    const custTxns = transactions.filter((t) => {
      if (t.customer !== i) return false;
      if (dateFrom && t.date < dateFrom) return false;
      if (dateTo && t.date > dateTo) return false;
      return true;
    });

    for (const t of custTxns) {
      if (t.type === "Income") income += t.amount;
      if (t.type === "Expense") expense += t.amount;
      if (t.type === "Due") due += t.amount;
      if (t.type === "Paid") {
        paid += t.amount;
        income += t.amount;
      }
    }

    return {
      customer: c,
      index: i,
      income,
      expense,
      due,
      paid,
      profit: income - expense,
      netBalance: income - expense,
      txns: custTxns,
    };
  });

  // Print PDF for all customers
  const printAllReports = () => {
    const dateRange =
      dateFrom || dateTo
        ? `<p style="margin:0 0 8px;color:#555;font-size:11px;">তারিখ: ${dateFrom || "শুরু"} থেকে ${dateTo || "আজ"} পর্যন্ত</p>`
        : "";

    const sections = customerReports
      .map((row, idx) => {
        if (row.txns.length === 0) return "";
        const txnRows = row.txns
          .map(
            (t) =>
              `<tr><td>${t.date}</td><td>${t.type}</td><td style="text-align:right">${t.amount.toLocaleString()} ৳</td></tr>`,
          )
          .join("");
        return `
        <div class="customer-section" style="page-break-inside:avoid;margin-bottom:28px;border:1px solid #ddd;border-radius:8px;overflow:hidden;">
          <div class="customer-header" style="background:#1a3a6b;color:#fff;padding:10px 14px;display:flex;justify-content:space-between;align-items:center;">
            <div>
              <span style="font-size:11px;opacity:0.7;">কাস্টমার #${idx + 1}</span>
              <h3 style="margin:2px 0 0;font-size:16px;font-weight:700;">${row.customer.name}</h3>
              ${row.customer.phone ? `<span style="font-size:11px;opacity:0.8;">📞 ${row.customer.phone}</span>` : ""}
              ${row.customer.address ? `<span style="font-size:11px;opacity:0.8;margin-left:8px;">📍 ${row.customer.address}</span>` : ""}
            </div>
            <div style="text-align:right;">
              <div style="font-size:11px;opacity:0.8;">নিট ব্যালেন্স / Net</div>
              <div style="font-size:18px;font-weight:900;color:${row.netBalance >= 0 ? "#6ee7b7" : "#fca5a5"};">${row.netBalance >= 0 ? "+" : ""}${row.netBalance.toLocaleString()} ৳</div>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:0;border-bottom:1px solid #ddd;">
            <div style="padding:8px;text-align:center;border-right:1px solid #eee;background:#f0fdf4;">
              <div style="font-size:9px;font-weight:700;color:#166534;text-transform:uppercase;">আয়</div>
              <div style="font-size:14px;font-weight:800;color:#15803d;">${row.income.toLocaleString()} ৳</div>
            </div>
            <div style="padding:8px;text-align:center;border-right:1px solid #eee;background:#fef2f2;">
              <div style="font-size:9px;font-weight:700;color:#991b1b;text-transform:uppercase;">ব্যয়</div>
              <div style="font-size:14px;font-weight:800;color:#dc2626;">${row.expense.toLocaleString()} ৳</div>
            </div>
            <div style="padding:8px;text-align:center;border-right:1px solid #eee;background:#fffbeb;">
              <div style="font-size:9px;font-weight:700;color:#92400e;text-transform:uppercase;">বাকি</div>
              <div style="font-size:14px;font-weight:800;color:#d97706;">${row.due.toLocaleString()} ৳</div>
            </div>
            <div style="padding:8px;text-align:center;background:#eff6ff;">
              <div style="font-size:9px;font-weight:700;color:#1e3a8a;text-transform:uppercase;">পরিশোধ</div>
              <div style="font-size:14px;font-weight:800;color:#2563eb;">${row.paid.toLocaleString()} ৳</div>
            </div>
          </div>
          <table style="width:100%;border-collapse:collapse;font-size:11px;">
            <thead>
              <tr style="background:#f8fafc;">
                <th style="padding:6px 10px;text-align:left;border-bottom:1px solid #e2e8f0;font-size:10px;color:#64748b;">তারিখ</th>
                <th style="padding:6px 10px;text-align:left;border-bottom:1px solid #e2e8f0;font-size:10px;color:#64748b;">ধরন</th>
                <th style="padding:6px 10px;text-align:right;border-bottom:1px solid #e2e8f0;font-size:10px;color:#64748b;">পরিমাণ</th>
              </tr>
            </thead>
            <tbody>${txnRows}</tbody>
          </table>
        </div>`;
      })
      .filter(Boolean)
      .join("");

    const html = `<!DOCTYPE html><html lang="bn"><head><meta charset="UTF-8">
    <title>কাস্টমার রিপোর্ট - Atrai Online Bhumisheba</title>
    <style>
      * { box-sizing: border-box; }
      body { font-family: 'Hind Siliguri', Arial, sans-serif; font-size:12px; color:#1e293b; margin:0; padding:20px; }
      h1 { font-size:22px; font-weight:900; color:#1a3a6b; margin:0 0 4px; }
      .header { border-bottom:2px solid #1a3a6b; padding-bottom:12px; margin-bottom:16px; }
      table td { padding:5px 10px; border-bottom:1px solid #f1f5f9; }
      table tr:last-child td { border-bottom:none; }
      @media print { body { padding:10px; } .customer-section { page-break-inside:avoid; } }
    </style>
    </head><body>
    <div class="header">
      <h1>Atrai Online Bhumisheba And MA Computer</h1>
      <p style="margin:0;font-size:12px;color:#475569;">কাস্টমার সম্পূর্ণ রিপোর্ট / Customer Full Report</p>
      <p style="margin:4px 0 0;font-size:11px;color:#64748b;">তৈরি: ${new Date().toLocaleDateString("bn-BD")} — মোট কাস্টমার: ${customers.length}জন</p>
      ${dateRange}
    </div>
    ${sections || "<p>কোনো লেনদেন পাওয়া যায়নি।</p>"}
    </body></html>`;

    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
      win.focus();
      setTimeout(() => win.print(), 400);
    }
  };

  // Export CSV
  const exportCSV = () => {
    const rows = [
      [
        "#",
        "কাস্টমার",
        "ফোন",
        "ঠিকানা",
        "আয়",
        "ব্যয়",
        "বাকি",
        "পরিশোধ",
        "লাভ",
        "নিট ব্যালেন্স",
      ],
    ];
    for (const row of customerReports) {
      rows.push([
        String(row.index + 1),
        row.customer.name,
        row.customer.phone,
        row.customer.address,
        String(row.income),
        String(row.expense),
        String(row.due),
        String(row.paid),
        String(row.profit),
        String(row.netBalance),
      ]);
    }
    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([`\uFEFF${csv}`], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `customer_report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (customers.length === 0) {
    return (
      <section aria-label="কাস্টমার রিপোর্ট" data-ocid="customer_report.section">
        <div className="mb-6">
          <h2 className="section-header">কাস্টমার রিপোর্ট</h2>
          <p className="section-subheader">Customer Individual Reports</p>
        </div>
        <div
          className="flex flex-col items-center justify-center py-20 gap-4 text-center"
          data-ocid="customer_report.empty_state"
        >
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="font-semibold text-white">কোনো কাস্টমার নেই</p>
          <p className="text-sm text-white/70">
            প্রথমে কাস্টমার প্রোফাইলে কাস্টমার যোগ করুন।
          </p>
        </div>
      </section>
    );
  }

  return (
    <section aria-label="কাস্টমার রিপোর্ট" data-ocid="customer_report.section">
      {/* Header */}
      <div className="flex items-start justify-between mb-5 flex-col sm:flex-row gap-3">
        <div>
          <h2 className="section-header">কাস্টমার রিপোর্ট</h2>
          <p className="section-subheader">
            Customer Individual Reports — {customers.length}জন /{" "}
            {customers.length} customers
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={expandAll}
            className="gap-1.5 text-xs"
            data-ocid="customer_report.expand_all_button"
          >
            <ChevronDown className="h-3.5 w-3.5" />
            সব খুলুন
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={collapseAll}
            className="gap-1.5 text-xs"
            data-ocid="customer_report.collapse_all_button"
          >
            <ChevronUp className="h-3.5 w-3.5" />
            সব বন্ধ করুন
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={exportCSV}
            className="gap-1.5 text-xs"
            data-ocid="customer_report.export_csv_button"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" />
            CSV
          </Button>
          <Button
            size="sm"
            onClick={printAllReports}
            className="gap-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white border-0"
            data-ocid="customer_report.print_button"
          >
            <Download className="h-3.5 w-3.5" />
            PDF / প্রিন্ট
          </Button>
        </div>
      </div>

      {/* Date Filter */}
      <Card className="shadow-sm mb-5">
        <CardContent className="py-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <span className="text-sm font-semibold text-white whitespace-nowrap">
              তারিখ ফিল্টার:
            </span>
            <div className="flex items-center gap-2 flex-1 flex-wrap">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="border border-input rounded-md px-3 py-1.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                data-ocid="customer_report.date_from_input"
                aria-label="তারিখ থেকে"
              />
              <span className="text-white/60 text-sm">থেকে</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="border border-input rounded-md px-3 py-1.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                data-ocid="customer_report.date_to_input"
                aria-label="তারিখ পর্যন্ত"
              />
              {(dateFrom || dateTo) && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setDateFrom("");
                    setDateTo("");
                  }}
                  className="text-xs text-white/60 hover:text-white h-7 px-2"
                  data-ocid="customer_report.clear_date_button"
                >
                  ✕ ক্লিয়ার
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Customer Report Cards */}
      <div className="flex flex-col gap-4" data-ocid="customer_report.list">
        {customerReports.map((row, idx) => {
          const avatarConfig = AVATAR_COLORS[idx % AVATAR_COLORS.length];
          const initial = row.customer.name.charAt(0).toUpperCase();
          const isExpanded = expandedCustomers.has(row.index);
          const isPositive = row.netBalance >= 0;
          const net = row.due - row.paid;

          return (
            <Card
              key={`report-${row.index}`}
              className="shadow-sm overflow-hidden"
              data-ocid={`customer_report.item.${idx + 1}`}
            >
              {/* Colored left accent */}
              <div className="flex">
                <div
                  className="w-1 flex-shrink-0"
                  style={{ background: avatarConfig.hex }}
                />
                <div className="flex-1">
                  {/* Customer Header */}
                  <CardHeader className="pb-2 pt-4 px-4">
                    <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
                      {/* Left: Avatar + Info */}
                      <div className="flex items-center gap-3">
                        <div
                          className={`${avatarConfig.bg} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm flex-shrink-0`}
                        >
                          {initial}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-white/50 font-mono">
                              #{idx + 1}
                            </span>
                            <h3
                              className="font-black text-white text-base leading-tight"
                              style={{
                                letterSpacing: "-0.01em",
                                textShadow: "0 1px 3px rgba(0,0,0,0.4)",
                              }}
                            >
                              {row.customer.name}
                            </h3>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${isPositive ? "bg-emerald-900/50 text-emerald-300" : "bg-red-900/50 text-red-300"}`}
                            >
                              {isPositive ? "+" : ""}
                              {fmtAmt(row.netBalance)} ৳
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-x-3 mt-1">
                            {row.customer.phone && (
                              <span className="flex items-center gap-1 text-xs text-white/60">
                                <Phone className="h-3 w-3" />
                                {row.customer.phone}
                              </span>
                            )}
                            {row.customer.address && (
                              <span className="flex items-center gap-1 text-xs text-white/60">
                                <MapPin className="h-3 w-3" />
                                {row.customer.address}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Summary stats */}
                      <div className="grid grid-cols-4 gap-1.5 sm:w-auto w-full">
                        <div className="text-center py-2 px-2 rounded-lg bg-emerald-600/60 border border-emerald-400/30">
                          <TrendingUp className="h-3 w-3 text-white mx-auto mb-0.5" />
                          <p className="text-[9px] font-bold text-white/80 uppercase tracking-wider">
                            আয়
                          </p>
                          <p className="text-white font-black text-xs tabular-nums">
                            {fmtAmt(row.income)}
                          </p>
                        </div>
                        <div className="text-center py-2 px-2 rounded-lg bg-red-600/60 border border-red-400/30">
                          <TrendingDown className="h-3 w-3 text-white mx-auto mb-0.5" />
                          <p className="text-[9px] font-bold text-white/80 uppercase tracking-wider">
                            ব্যয়
                          </p>
                          <p className="text-white font-black text-xs tabular-nums">
                            {fmtAmt(row.expense)}
                          </p>
                        </div>
                        <div className="text-center py-2 px-2 rounded-lg bg-amber-500/60 border border-amber-400/30">
                          <Clock className="h-3 w-3 text-white mx-auto mb-0.5" />
                          <p className="text-[9px] font-bold text-white/80 uppercase tracking-wider">
                            বাকি
                          </p>
                          <p
                            className={`font-black text-xs tabular-nums ${net > 0 ? "text-amber-200" : "text-white"}`}
                          >
                            {fmtAmt(row.due)}
                          </p>
                        </div>
                        <div className="text-center py-2 px-2 rounded-lg bg-blue-600/60 border border-blue-400/30">
                          <CheckCircle className="h-3 w-3 text-white mx-auto mb-0.5" />
                          <p className="text-[9px] font-bold text-white/80 uppercase tracking-wider">
                            পরিশোধ
                          </p>
                          <p className="text-white font-black text-xs tabular-nums">
                            {fmtAmt(row.paid)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Toggle row */}
                  <div className="border-t border-border/60 px-4 py-2 flex items-center justify-between bg-black/10">
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-white/60">
                        {row.txns.length} লেনদেন / transactions
                      </span>
                      {net > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-red-900/50 text-red-300 text-[10px] font-bold">
                          বাকি আছে: {net.toLocaleString()} ৳
                        </span>
                      )}
                      {net <= 0 && row.txns.length > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-900/50 text-emerald-300 text-[10px] font-bold">
                          পরিশোধিত
                        </span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleExpanded(row.index)}
                      className="h-6 text-[11px] text-primary hover:bg-primary/10 px-2 gap-1"
                      data-ocid={`customer_report.item.${idx + 1}.toggle_button`}
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="h-3 w-3" /> লুকান
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-3 w-3" /> লেনদেন দেখুন
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Transactions table (expanded) */}
                  {isExpanded && (
                    <CardContent className="pt-3 pb-4 px-4">
                      {row.txns.length === 0 ? (
                        <p className="text-xs text-white/50 text-center py-4">
                          এই সময়ের মধ্যে কোনো লেনদেন নেই / No transactions in
                          this period
                        </p>
                      ) : (
                        <>
                          <div className="overflow-x-auto rounded-lg border border-border/60">
                            <table className="w-full text-sm">
                              <thead>
                                <tr
                                  className="border-b border-border"
                                  style={{ background: "oklch(0 0 0 / 0.30)" }}
                                >
                                  <th className="table-header-cell text-left whitespace-nowrap">
                                    #
                                  </th>
                                  <th className="table-header-cell text-left whitespace-nowrap">
                                    তারিখ
                                  </th>
                                  <th className="table-header-cell text-left">
                                    ধরন
                                  </th>
                                  <th className="table-header-cell text-right">
                                    পরিমাণ ৳
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {row.txns.map((t, txnIdx) => (
                                  <tr
                                    key={`${row.customer.name}-${t.date}-${t.amount}-${txnIdx}`}
                                    className="border-b border-border/40 hover:bg-white/5 transition-colors"
                                  >
                                    <td className="px-3 py-2 text-xs text-white/40 font-mono">
                                      {txnIdx + 1}
                                    </td>
                                    <td className="px-3 py-2 text-xs text-white/70 font-mono whitespace-nowrap">
                                      {t.date}
                                    </td>
                                    <td className="px-3 py-2">
                                      <span
                                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${typeBadgeVariant[t.type]}`}
                                      >
                                        {t.type}
                                      </span>
                                    </td>
                                    <td className="px-3 py-2 text-right font-black text-sm tabular-nums text-white">
                                      {t.amount.toLocaleString()} ৳
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                              {/* Footer summary */}
                              <tfoot>
                                <tr
                                  className="border-t-2 border-border"
                                  style={{ background: "oklch(0 0 0 / 0.20)" }}
                                >
                                  <td
                                    colSpan={3}
                                    className="px-3 py-2 text-xs font-bold text-white/70 uppercase tracking-wide"
                                  >
                                    মোট / Total ({row.txns.length}টি)
                                  </td>
                                  <td className="px-3 py-2 text-right font-black text-base tabular-nums text-white">
                                    {row.txns
                                      .reduce((sum, t) => sum + t.amount, 0)
                                      .toLocaleString()}{" "}
                                    ৳
                                  </td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>

                          {/* Individual customer summary box */}
                          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded-lg bg-black/20 border border-border/40">
                            <div>
                              <p className="text-[9px] font-bold text-white/50 uppercase tracking-wider mb-0.5">
                                মোট আয়
                              </p>
                              <p className="text-emerald-300 font-black text-sm tabular-nums">
                                {row.income.toLocaleString()} ৳
                              </p>
                            </div>
                            <div>
                              <p className="text-[9px] font-bold text-white/50 uppercase tracking-wider mb-0.5">
                                মোট ব্যয়
                              </p>
                              <p className="text-red-300 font-black text-sm tabular-nums">
                                {row.expense.toLocaleString()} ৳
                              </p>
                            </div>
                            <div>
                              <p className="text-[9px] font-bold text-white/50 uppercase tracking-wider mb-0.5">
                                নিট বাকি
                              </p>
                              <p
                                className={`font-black text-sm tabular-nums ${net > 0 ? "text-amber-300" : "text-emerald-300"}`}
                              >
                                {net > 0
                                  ? `${net.toLocaleString()} ৳`
                                  : "পরিশোধিত"}
                              </p>
                            </div>
                            <div>
                              <p className="text-[9px] font-bold text-white/50 uppercase tracking-wider mb-0.5">
                                লাভ / Profit
                              </p>
                              <p
                                className={`font-black text-sm tabular-nums ${row.profit >= 0 ? "text-emerald-300" : "text-red-300"}`}
                              >
                                {row.profit >= 0 ? "+" : ""}
                                {row.profit.toLocaleString()} ৳
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Grand total row */}
      {customerReports.length > 0 && (
        <Card className="shadow-sm mt-4">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="flex items-center gap-2 text-sm font-bold">
              <FileText
                className="h-4 w-4"
                style={{ color: "oklch(0.88 0.14 62)" }}
              />
              সর্বমোট সারসংক্ষেপ / Grand Total Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-lg p-3 text-center bg-emerald-600/60 border border-emerald-400/30">
                <p className="text-[10px] font-bold text-white/80 uppercase tracking-wider mb-1">
                  মোট আয়
                </p>
                <p className="text-white font-black text-lg tabular-nums">
                  {customerReports
                    .reduce((s, r) => s + r.income, 0)
                    .toLocaleString()}{" "}
                  ৳
                </p>
              </div>
              <div className="rounded-lg p-3 text-center bg-red-600/60 border border-red-400/30">
                <p className="text-[10px] font-bold text-white/80 uppercase tracking-wider mb-1">
                  মোট ব্যয়
                </p>
                <p className="text-white font-black text-lg tabular-nums">
                  {customerReports
                    .reduce((s, r) => s + r.expense, 0)
                    .toLocaleString()}{" "}
                  ৳
                </p>
              </div>
              <div className="rounded-lg p-3 text-center bg-amber-500/60 border border-amber-400/30">
                <p className="text-[10px] font-bold text-white/80 uppercase tracking-wider mb-1">
                  মোট বাকি (নিট)
                </p>
                <p className="text-white font-black text-lg tabular-nums">
                  {customerReports
                    .reduce((s, r) => s + Math.max(0, r.due - r.paid), 0)
                    .toLocaleString()}{" "}
                  ৳
                </p>
              </div>
              <div className="rounded-lg p-3 text-center bg-blue-600/60 border border-blue-400/30">
                <p className="text-[10px] font-bold text-white/80 uppercase tracking-wider mb-1">
                  সর্বমোট লাভ
                </p>
                <p className="text-white font-black text-lg tabular-nums">
                  {customerReports
                    .reduce((s, r) => s + r.profit, 0)
                    .toLocaleString()}{" "}
                  ৳
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
