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
import { Edit2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Customer {
  name: string;
  phone: string;
  address: string;
}

interface EditCustomerModalProps {
  open: boolean;
  customer: Customer | null;
  onClose: () => void;
  onSave: (name: string, phone: string, address: string) => void;
}

export default function EditCustomerModal({
  open,
  customer,
  onClose,
  onSave,
}: EditCustomerModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (customer) {
      setName(customer.name);
      setPhone(customer.phone);
      setAddress(customer.address);
    }
  }, [customer]);

  const handleSubmit = () => {
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedAddress = address.trim();

    if (!trimmedName || !trimmedPhone || !trimmedAddress) {
      toast.error("নাম, ফোন ও ঠিকানা পূরণ করুন / Fill in Name, Phone & Address");
      return;
    }

    onSave(trimmedName, trimmedPhone, trimmedAddress);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Edit2 className="h-4 w-4 text-primary" />
            কাস্টমার সম্পাদনা / Edit Customer
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="edit-name" className="text-sm">
              নাম / Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-name"
              placeholder="কাস্টমারের নাম / Customer Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-phone" className="text-sm">
              ফোন / Phone <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-phone"
              placeholder="ফোন নম্বর / Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-address" className="text-sm">
              ঠিকানা / Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-address"
              placeholder="ঠিকানা / Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            বাতিল / Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit} className="gap-1.5">
            <Edit2 className="h-3.5 w-3.5" />
            সেভ করুন / Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
