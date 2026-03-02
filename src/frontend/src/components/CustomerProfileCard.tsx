import { Button } from "@/components/ui/button";
import { Edit2, MapPin, Phone, Trash2 } from "lucide-react";

interface CustomerStats {
  income: number;
  expense: number;
  due: number;
  paid: number;
}

interface Customer {
  name: string;
  phone: string;
  address: string;
}

interface CustomerProfileCardProps {
  customer: Customer;
  index: number;
  stats: CustomerStats;
  onViewTransactions: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const AVATAR_COLORS = [
  "bg-violet-500",
  "bg-emerald-500",
  "bg-blue-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-indigo-500",
  "bg-teal-500",
];

export default function CustomerProfileCard({
  customer,
  index,
  stats,
  onViewTransactions,
  onEdit,
  onDelete,
}: CustomerProfileCardProps) {
  const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const initial = customer.name.charAt(0).toUpperCase();
  const netBalance = stats.income - stats.expense;
  const isPositive = netBalance >= 0;

  return (
    <div className="bg-card border border-border rounded-xl shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden group">
      {/* Card Header with gradient accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-primary/60 to-primary/20" />

      <div className="p-4">
        {/* Top row: Avatar + Name + Action buttons */}
        <div className="flex items-start gap-3 mb-3">
          {/* Avatar */}
          <div
            className={`${avatarColor} flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md`}
          >
            {initial}
          </div>

          {/* Name + Balance */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-foreground text-sm leading-tight truncate">
              {customer.name}
            </h3>
            <span
              className={`inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                isPositive
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                  : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
              }`}
            >
              {isPositive ? "+" : ""}
              {netBalance.toLocaleString()}
            </span>
          </div>

          {/* Edit + Delete */}
          <div className="flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="ghost"
              onClick={onEdit}
              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
              aria-label="Edit customer"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onDelete}
              className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              aria-label="Delete customer"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Phone className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{customer.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{customer.address}</span>
          </div>
        </div>

        {/* Mini Stats */}
        <div className="grid grid-cols-4 gap-1 mb-3">
          <div className="text-center">
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium leading-none mb-0.5">
              আয়
            </p>
            <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 tabular-nums leading-tight">
              {stats.income >= 1000
                ? `${(stats.income / 1000).toFixed(1)}k`
                : stats.income.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-red-600 dark:text-red-400 font-medium leading-none mb-0.5">
              ব্যয়
            </p>
            <p className="text-[11px] font-bold text-red-600 dark:text-red-400 tabular-nums leading-tight">
              {stats.expense >= 1000
                ? `${(stats.expense / 1000).toFixed(1)}k`
                : stats.expense.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium leading-none mb-0.5">
              বাকি
            </p>
            <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 tabular-nums leading-tight">
              {stats.due >= 1000
                ? `${(stats.due / 1000).toFixed(1)}k`
                : stats.due.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium leading-none mb-0.5">
              পরিশোধ
            </p>
            <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400 tabular-nums leading-tight">
              {stats.paid >= 1000
                ? `${(stats.paid / 1000).toFixed(1)}k`
                : stats.paid.toLocaleString()}
            </p>
          </div>
        </div>

        {/* View Transactions Button */}
        <Button
          size="sm"
          onClick={onViewTransactions}
          className="w-full h-8 text-xs gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary border-0 font-medium"
          variant="ghost"
        >
          লেনদেন দেখুন / View Transactions
        </Button>
      </div>
    </div>
  );
}
