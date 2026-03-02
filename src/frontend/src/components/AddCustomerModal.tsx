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
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AddCustomerModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (name: string, phone: string, address: string) => void;
}

export default function AddCustomerModal({
  open,
  onClose,
  onAdd,
}: AddCustomerModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = () => {
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedAddress = address.trim();

    if (!trimmedName || !trimmedPhone || !trimmedAddress) {
      toast.error("নাম, ফোন ও ঠিকানা পূরণ করুন / Fill in Name, Phone & Address");
      return;
    }

    onAdd(trimmedName, trimmedPhone, trimmedAddress);
    setName("");
    setPhone("");
    setAddress("");
    onClose();
  };

  const handleClose = () => {
    setName("");
    setPhone("");
    setAddress("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <UserPlus className="h-4 w-4 text-primary" />
            কাস্টমার যোগ করুন / Add Customer
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="add-name" className="text-sm">
              নাম / Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="add-name"
              placeholder="কাস্টমারের নাম / Customer Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="add-phone" className="text-sm">
              ফোন / Phone <span className="text-destructive">*</span>
            </Label>
            <Input
              id="add-phone"
              placeholder="ফোন নম্বর / Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="add-address" className="text-sm">
              ঠিকানা / Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="add-address"
              placeholder="ঠিকানা / Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" size="sm" onClick={handleClose}>
            বাতিল / Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit} className="gap-1.5">
            <UserPlus className="h-3.5 w-3.5" />
            যোগ করুন / Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
