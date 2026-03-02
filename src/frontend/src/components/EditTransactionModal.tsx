import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type TransactionType = "Income" | "Expense" | "Due" | "Paid";

interface Customer {
  name: string;
  phone: string;
  address: string;
}

interface Transaction {
  date: string;
  type: TransactionType;
  customer: number;
  amount: number;
}

interface EditTransactionModalProps {
  open: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  originalIndex: number;
  customers: Customer[];
  onSave: (index: number, updated: Transaction) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function EditTransactionModal({
  open,
  onClose,
  transaction,
  originalIndex,
  customers,
  onSave,
}: EditTransactionModalProps) {
  const [customerIdx, setCustomerIdx] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [type, setType] = useState<TransactionType>("Income");
  const [amount, setAmount] = useState<string>("");

  // Populate form when transaction changes
  useEffect(() => {
    if (transaction) {
      setCustomerIdx(String(transaction.customer));
      setDate(transaction.date);
      setType(transaction.type);
      setAmount(String(transaction.amount));
    }
  }, [transaction]);

  const handleSave = () => {
    const parsedAmount = Number.parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) return;
    if (customerIdx === "") return;

    onSave(originalIndex, {
      date,
      type,
      customer: Number.parseInt(customerIdx),
      amount: parsedAmount,
    });
    onClose();
  };

  const typeOptions: {
    value: TransactionType;
    label: string;
    color: string;
  }[] = [
    { value: "Income", label: "আয় / Income", color: "text-emerald-600" },
    { value: "Expense", label: "ব্যয় / Expense", color: "text-red-600" },
    { value: "Due", label: "বাকি / Due", color: "text-amber-600" },
    { value: "Paid", label: "পরিশোধ / Paid", color: "text-blue-600" },
  ];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Save className="h-4 w-4 text-primary" />
            লেনদেন সংশোধন / Edit Transaction
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Customer */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">কাস্টমার / Customer</Label>
            <select
              value={customerIdx}
              onChange={(e) => setCustomerIdx(e.target.value)}
              className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Select customer"
            >
              <option value="">-- কাস্টমার নির্বাচন করুন / Select Customer --</option>
              {customers.map((c, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: stable customer indices
                <option key={i} value={i}>
                  {c.name} ({c.phone})
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">তারিখ / Date</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="text-sm"
            />
          </div>

          {/* Type */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">ধরন / Type</Label>
            <div className="grid grid-cols-2 gap-2">
              {typeOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setType(opt.value)}
                  className={`px-3 py-2 rounded-md border text-sm font-medium transition-colors ${
                    type === opt.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-input hover:bg-muted text-foreground"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">পরিমাণ / Amount (৳)</Label>
            <Input
              type="number"
              placeholder="পরিমাণ লিখুন / Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              min="0"
              step="any"
              className="text-sm"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="gap-1.5"
          >
            <X className="h-3.5 w-3.5" />
            বাতিল / Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!customerIdx || !amount || Number.parseFloat(amount) <= 0}
            className="gap-1.5"
          >
            <Save className="h-3.5 w-3.5" />
            সংরক্ষণ / Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
