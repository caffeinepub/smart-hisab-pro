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
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface ChangePinModalProps {
  open: boolean;
  onClose: () => void;
}

function hashPin(pin: string): string {
  return btoa(`${pin.split("").reverse().join("")}hisab_salt`);
}

function PinField({
  label,
  value,
  onChange,
  inputRef,
  onEnter,
  autoFocus,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  inputRef?: React.Ref<HTMLInputElement>;
  onEnter?: () => void;
  autoFocus?: boolean;
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="relative">
        <Input
          ref={inputRef}
          type={show ? "text" : "password"}
          inputMode="numeric"
          maxLength={4}
          value={value}
          onChange={(e) =>
            onChange(e.target.value.replace(/\D/g, "").slice(0, 4))
          }
          onKeyDown={(e) => e.key === "Enter" && onEnter?.()}
          autoFocus={autoFocus}
          placeholder="••••"
          className="pr-10 text-center text-lg tracking-[0.5em] font-bold"
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label={show ? "Hide PIN" : "Show PIN"}
          tabIndex={-1}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

export default function ChangePinModal({ open, onClose }: ChangePinModalProps) {
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const newPinRef = useRef<HTMLInputElement>(null);
  const confirmPinRef = useRef<HTMLInputElement>(null);

  function handleClose() {
    setCurrentPin("");
    setNewPin("");
    setConfirmPin("");
    setError("");
    onClose();
  }

  function handleSave() {
    setError("");

    if (currentPin.length < 4) {
      setError("Current PIN must be 4 digits.");
      return;
    }

    const stored = localStorage.getItem("hisabPIN");
    if (!stored || stored !== hashPin(currentPin)) {
      setError("Current PIN is incorrect.");
      setCurrentPin("");
      return;
    }

    if (newPin.length < 4) {
      setError("New PIN must be 4 digits.");
      return;
    }

    if (newPin !== confirmPin) {
      setError("New PINs don't match.");
      setConfirmPin("");
      return;
    }

    if (newPin === currentPin) {
      setError("New PIN must be different from current PIN.");
      return;
    }

    localStorage.setItem("hisabPIN", hashPin(newPin));
    toast.success("PIN changed successfully!");
    handleClose();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Change PIN
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <PinField
            label="Current PIN"
            value={currentPin}
            onChange={setCurrentPin}
            onEnter={() => newPinRef.current?.focus()}
            autoFocus
          />
          <PinField
            label="New PIN"
            value={newPin}
            onChange={setNewPin}
            inputRef={newPinRef}
            onEnter={() => confirmPinRef.current?.focus()}
          />
          <PinField
            label="Confirm New PIN"
            value={confirmPin}
            onChange={setConfirmPin}
            inputRef={confirmPinRef}
            onEnter={handleSave}
          />

          <AnimatePresence>
            {error && (
              <motion.p
                key="error"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs text-destructive font-medium"
                role="alert"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              currentPin.length < 4 ||
              newPin.length < 4 ||
              confirmPin.length < 4
            }
          >
            Save PIN
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
