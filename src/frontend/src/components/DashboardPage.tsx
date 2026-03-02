import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  CheckCircle,
  Clock,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
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

interface DashboardPageProps {
  customers: Customer[];
  transactions: Transaction[];
  darkMode: boolean;
  onDrillDown: (name: string) => void;
}

const BAR_COLORS = ["#22c55e", "#ef4444", "#eab308", "#3b82f6", "#6b7280"];

function getPieColor(idx: number) {
  return `hsl(${(idx * 47 + 200) % 360}, 65%, 55%)`;
}

function fmtAmt(n: number) {
  if (n >= 100000) return `${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toLocaleString();
}

export default function DashboardPage({
  customers,
  transactions,
  onDrillDown,
}: DashboardPageProps) {
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

  // Recent transactions (last 10)
  const recentTxns = [...transactions]
    .map((t, i) => ({ t, i }))
    .reverse()
    .slice(0, 10);

  const typeBadge: Record<TransactionType, string> = {
    Income:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
    Expense: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    Due: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    Paid: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  };

  return (
    <section aria-label="ড্যাশবোর্ড">
      <div className="mb-5">
        <h2 className="font-bold text-foreground text-xl leading-tight mb-0.5">
          ড্যাশবোর্ড
        </h2>
        <p className="text-xs text-muted-foreground">
          Dashboard — Overview & Analytics
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
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
          className={`rounded-lg border p-3 text-center shadow-xs transition-colors ${
            profit >= 0
              ? "bg-emerald-600/70 border-emerald-400/40"
              : "bg-red-600/70 border-red-400/40"
          }`}
        >
          <div className="flex items-center justify-center gap-1 mb-1">
            <BarChart3 className="h-4 w-4 text-white" />
          </div>
          <p className="text-xs text-white/80 font-medium">লাভ / Profit</p>
          <p className="font-bold text-lg leading-tight tabular-nums text-white">
            {fmtAmt(profit)}
          </p>
        </div>
        <div className="rounded-lg border p-3 text-center shadow-xs transition-colors bg-violet-600/70 border-violet-400/40">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Users className="h-4 w-4 text-white" />
          </div>
          <p className="text-xs text-white/80 font-medium">কাস্টমার / Customers</p>
          <p className="font-bold text-lg leading-tight tabular-nums text-white">
            {customers.length}
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Bar Chart */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4 text-primary" />
              সামগ্রিক বিশ্লেষণ / Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
                >
                  <XAxis
                    dataKey="name"
                    tick={{
                      fontSize: 9,
                      fill: "rgba(255,255,255,0.8)",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{
                      fontSize: 10,
                      fill: "rgba(255,255,255,0.8)",
                    }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => fmtAmt(Number(v))}
                    width={50}
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
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4 text-primary" />
              কাস্টমার আয় বিতরণ / Income Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length === 0 ? (
              <div className="h-56 flex items-center justify-center text-muted-foreground text-sm rounded-lg border border-dashed border-border">
                এখনো কোনো আয় ডেটা নেই / No income data yet
              </div>
            ) : (
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="45%"
                      outerRadius={85}
                      onClick={(entry) => onDrillDown(entry.name)}
                      style={{ cursor: "pointer" }}
                    >
                      {pieData.map((entry, i) => (
                        <Cell key={entry.name} fill={getPieColor(i)} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v, name) => {
                        const total = pieData.reduce((a, b) => a + b.value, 0);
                        const pct = ((Number(v) / total) * 100).toFixed(1);
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
                        fontSize: 11,
                        color: "rgba(255,255,255,0.9)",
                        paddingTop: 8,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-4 w-4 text-primary" />
            সাম্প্রতিক লেনদেন / Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentTxns.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              কোনো লেনদেন নেই / No transactions yet
            </p>
          ) : (
            <div className="overflow-x-auto rounded-md border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/60 border-b border-border">
                    <th className="px-3 py-2 text-left font-semibold text-muted-foreground whitespace-nowrap">
                      তারিখ / Date
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-muted-foreground">
                      ধরন / Type
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-muted-foreground">
                      কাস্টমার / Customer
                    </th>
                    <th className="px-3 py-2 text-right font-semibold text-muted-foreground">
                      পরিমাণ / Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentTxns.map(({ t, i }) => {
                    const cust = customers[t.customer];
                    if (!cust) return null;
                    return (
                      <tr
                        key={i}
                        className="border-b border-border/60 hover:bg-muted/40 transition-colors"
                      >
                        <td className="px-3 py-2 whitespace-nowrap text-muted-foreground font-mono text-xs">
                          {t.date}
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${typeBadge[t.type]}`}
                          >
                            {t.type}
                          </span>
                        </td>
                        <td className="px-3 py-2 font-medium">{cust.name}</td>
                        <td className="px-3 py-2 text-right font-semibold tabular-nums">
                          {t.amount.toLocaleString()} ৳
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

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
      <p className="text-xs text-white/80 font-medium">{label}</p>
      <p
        className={`font-bold text-lg leading-tight tabular-nums ${colorClass}`}
      >
        {value.toLocaleString()}
      </p>
    </div>
  );
}
