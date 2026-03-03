import { Button } from "@/components/ui/button";
import { RefreshCw, ShieldCheck } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface PinLoginProps {
  mode: "setup" | "unlock";
  onUnlock: () => void;
}

const STORAGE_KEYS = [
  "hisabPIN",
  "hisabData_customers",
  "hisabData_transactions",
  "hisabDark",
] as const;

function hashPin(pin: string): string {
  return btoa(`${pin.split("").reverse().join("")}hisab_salt`);
}

function verifyPin(pin: string): boolean {
  const stored = localStorage.getItem("hisabPIN");
  if (!stored) return false;
  return stored === hashPin(pin);
}

export default function PinLogin({ mode, onUnlock }: PinLoginProps) {
  // Setup flow: "enter" → "confirm"
  const [setupStep, setSetupStep] = useState<"enter" | "confirm">("enter");
  const [firstPin, setFirstPin] = useState("");

  const [digits, setDigits] = useState<string[]>(["", "", "", ""]);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [forgotWarning, setForgotWarning] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([
    null,
    null,
    null,
    null,
  ]);

  // Focus first box on mount only
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const currentPin = digits.join("");

  function resetDigits() {
    setDigits(["", "", "", ""]);
    setTimeout(() => inputRefs.current[0]?.focus(), 10);
  }

  function triggerError(msg: string) {
    setError(msg);
    setShake(true);
    setTimeout(() => setShake(false), 500);
    resetDigits();
  }

  function handleSubmit() {
    if (currentPin.length < 4) return;

    if (mode === "unlock") {
      if (verifyPin(currentPin)) {
        onUnlock();
      } else {
        triggerError("Incorrect PIN. Try again.");
      }
      return;
    }

    // Setup mode
    if (setupStep === "enter") {
      setFirstPin(currentPin);
      setSetupStep("confirm");
      setError("");
      resetDigits();
      return;
    }

    // confirm step
    if (currentPin !== firstPin) {
      triggerError("PINs don't match. Start over.");
      setSetupStep("enter");
      setFirstPin("");
      return;
    }

    localStorage.setItem("hisabPIN", hashPin(currentPin));
    onUnlock();
  }

  function handleKeyDown(
    idx: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (digits[idx] !== "") {
        const next = [...digits];
        next[idx] = "";
        setDigits(next);
      } else if (idx > 0) {
        const next = [...digits];
        next[idx - 1] = "";
        setDigits(next);
        inputRefs.current[idx - 1]?.focus();
      }
    } else if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "ArrowLeft" && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    } else if (e.key === "ArrowRight" && idx < 3) {
      inputRefs.current[idx + 1]?.focus();
    }
  }

  function handleChange(idx: number, value: string) {
    // Accept only a single digit
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[idx] = digit;
    setDigits(next);
    setError("");

    if (digit && idx < 3) {
      inputRefs.current[idx + 1]?.focus();
    }

    // Auto-submit when all 4 filled
    if (digit && idx === 3) {
      const pin = [...next].join("");
      if (pin.length === 4) {
        setTimeout(() => {
          // Use pin directly from closure to avoid stale state
          submitPin(pin);
        }, 80);
      }
    }
  }

  function submitPin(pin: string) {
    if (mode === "unlock") {
      if (verifyPin(pin)) {
        onUnlock();
      } else {
        triggerError("Incorrect PIN. Try again.");
      }
      return;
    }

    if (setupStep === "enter") {
      setFirstPin(pin);
      setSetupStep("confirm");
      setError("");
      // Reset is handled after state update
      setDigits(["", "", "", ""]);
      setTimeout(() => inputRefs.current[0]?.focus(), 10);
      return;
    }

    if (pin !== firstPin) {
      setError("PINs don't match. Start over.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setSetupStep("enter");
      setFirstPin("");
      setDigits(["", "", "", ""]);
      setTimeout(() => inputRefs.current[0]?.focus(), 10);
      return;
    }

    localStorage.setItem("hisabPIN", hashPin(pin));
    onUnlock();
  }

  function handleForgotPin() {
    if (forgotWarning) {
      // Second click: erase everything
      for (const key of STORAGE_KEYS) {
        localStorage.removeItem(key);
      }
      window.location.reload();
    } else {
      setForgotWarning(true);
    }
  }

  const isDark = localStorage.getItem("hisabDark") === "true";

  const title =
    mode === "unlock"
      ? "Enter PIN"
      : setupStep === "enter"
        ? "Create PIN"
        : "Confirm PIN";

  const subtitle =
    mode === "unlock"
      ? "Enter your 4-digit PIN to access your data"
      : setupStep === "enter"
        ? "Choose a 4-digit PIN to protect your data"
        : "Re-enter your PIN to confirm";

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center${isDark ? " dark" : ""}`}
      style={{
        backgroundImage:
          "url('/assets/uploads/38dbe6b3-fd90-4c94-9ec9-2088d6be73a5-1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      aria-label="PIN lock screen"
    >
      {/* Subtle overlay for card readability */}
      <div
        className="absolute inset-0 bg-black/15 pointer-events-none"
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-sm mx-4"
      >
        {/* Card */}
        <div className="pin-card rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-6 backdrop-blur-md">
          {/* Brand */}
          <div className="flex flex-col items-center gap-3">
            <div
              className="pin-icon-ring w-18 h-18 rounded-full flex items-center justify-center"
              style={{ width: "5rem", height: "5rem" }}
            >
              <img
                src="/assets/uploads/logo-1.jpg"
                alt="Logo"
                className="w-14 h-14 rounded-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  (
                    e.target as HTMLImageElement
                  ).nextElementSibling?.removeAttribute("style");
                }}
              />
              <span className="text-3xl select-none hidden">💰</span>
            </div>
            <div className="text-center space-y-1.5">
              <h1
                className="pin-text-primary text-shadow-md"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "1.35rem",
                  fontWeight: 800,
                  letterSpacing: "-0.01em",
                  lineHeight: 1.2,
                }}
              >
                Atrai Online Bhumisheba
              </h1>
              <div
                className="pin-text-primary text-shadow-md"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "1.35rem",
                  fontWeight: 800,
                  letterSpacing: "-0.01em",
                  lineHeight: 1.2,
                }}
              >
                &amp; MA Computer
              </div>
              {/* Bengali subtitle */}
              <p
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  color: "oklch(0.88 0.14 62)",
                  textShadow: "0 0 12px oklch(0.82 0.15 62 / 0.40)",
                }}
              >
                স্মার্ট হিসাব ব্যবস্থাপনা
              </p>
              <p
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "0.65rem",
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "oklch(1 0 0 / 0.55)",
                }}
              >
                ভূমি সেবা ও কম্পিউটার
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px pin-divider" />

          {/* Title */}
          <AnimatePresence mode="wait">
            <motion.div
              key={title}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.22 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-2 mb-1.5">
                <ShieldCheck className="h-4 w-4 pin-icon-accent" />
                <h2
                  className="pin-text-primary font-bold"
                  style={{ fontSize: "1rem", letterSpacing: "-0.01em" }}
                >
                  {title}
                </h2>
              </div>
              <p
                className="pin-text-muted max-w-[240px]"
                style={{ fontSize: "0.8rem" }}
              >
                {subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* PIN digit boxes */}
          <motion.fieldset
            animate={shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : {}}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="flex gap-3 border-0 p-0 m-0"
            aria-label="PIN input"
          >
            {digits.map((digit, idx) => (
              <input
                // biome-ignore lint/suspicious/noArrayIndexKey: PIN box positions are fixed
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="password"
                inputMode="numeric"
                maxLength={2}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onFocus={(e) => e.target.select()}
                className={`pin-digit-box w-14 h-14 text-center text-2xl font-black rounded-xl border-2 transition-all duration-200 outline-none
                  ${digit ? "pin-digit-filled" : "pin-digit-empty"}
                `}
                style={{ letterSpacing: "0.02em" }}
                aria-label={`Digit ${idx + 1}`}
                autoComplete="off"
              />
            ))}
          </motion.fieldset>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.p
                key="error"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs text-red-500 text-center font-medium -mt-2"
                role="alert"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Submit button */}
          <Button
            onClick={handleSubmit}
            disabled={currentPin.length < 4}
            className="w-full pin-submit-btn font-semibold"
          >
            {mode === "unlock"
              ? "Unlock"
              : setupStep === "enter"
                ? "Next"
                : "Set PIN & Unlock"}
          </Button>

          {/* Forgot PIN */}
          {mode === "unlock" && (
            <div className="text-center">
              <AnimatePresence mode="wait">
                {forgotWarning ? (
                  <motion.div
                    key="warning"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-2"
                  >
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-medium max-w-[250px]">
                      ⚠️ This will erase ALL your data including customers &amp;
                      transactions. Are you sure?
                    </p>
                    <div className="flex gap-2 justify-center">
                      <button
                        type="button"
                        onClick={() => setForgotWarning(false)}
                        className="text-xs pin-text-muted hover:pin-text-primary underline transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleForgotPin}
                        className="text-xs text-red-500 hover:text-red-600 font-semibold underline transition-colors flex items-center gap-1"
                      >
                        <RefreshCw className="h-3 w-3" />
                        Erase &amp; Reset
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.button
                    key="forgot"
                    type="button"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={handleForgotPin}
                    className="text-xs pin-text-muted hover:pin-text-accent underline-offset-2 hover:underline transition-colors"
                  >
                    Forgot PIN?
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
