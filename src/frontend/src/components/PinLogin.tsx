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

    if (setupStep === "enter") {
      setFirstPin(currentPin);
      setSetupStep("confirm");
      setError("");
      resetDigits();
      return;
    }

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
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[idx] = digit;
    setDigits(next);
    setError("");

    if (digit && idx < 3) {
      inputRefs.current[idx + 1]?.focus();
    }

    if (digit && idx === 3) {
      const pin = [...next].join("");
      if (pin.length === 4) {
        setTimeout(() => {
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
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
      }}
      aria-label="PIN lock screen"
    >
      {/* Soft navy overlay — matches the image's sky-blue tone */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(160deg, oklch(0.18 0.06 240 / 0.55) 0%, oklch(0.12 0.04 250 / 0.70) 100%)",
        }}
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-sm mx-4"
      >
        {/* ── PIN Card — navy glass matching the image's color palette ── */}
        <div
          className="rounded-2xl p-8 flex flex-col items-center gap-6"
          style={{
            background: "oklch(0.13 0.05 235 / 0.88)",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            border: "1px solid oklch(0.82 0.14 62 / 0.35)",
            boxShadow:
              "0 32px 80px oklch(0 0 0 / 0.60), 0 0 0 1px oklch(0.82 0.14 62 / 0.10) inset, 0 0 60px oklch(0.45 0.08 240 / 0.15)",
          }}
        >
          {/* ── Brand block ── */}
          <div className="flex flex-col items-center gap-3 w-full">
            {/* Logo ring — gold border matching the image's gold accent */}
            <div
              className="rounded-full flex items-center justify-center"
              style={{
                width: "5.5rem",
                height: "5.5rem",
                background:
                  "linear-gradient(135deg, oklch(0.82 0.14 62 / 0.20), oklch(0.72 0.12 68 / 0.12))",
                border: "2px solid oklch(0.82 0.14 62 / 0.50)",
                boxShadow: "0 0 24px oklch(0.82 0.14 62 / 0.25)",
              }}
            >
              <img
                src="/assets/uploads/logo-1.jpg"
                alt="Logo"
                className="w-16 h-16 rounded-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  (
                    e.target as HTMLImageElement
                  ).nextElementSibling?.removeAttribute("style");
                }}
              />
              <span className="text-3xl select-none hidden">💰</span>
            </div>

            {/* App title — Playfair Display serif, like the logo image typography */}
            <div className="text-center space-y-1">
              {/* Decorative gold line above title */}
              <div
                className="mx-auto mb-2"
                style={{
                  width: "3rem",
                  height: "2px",
                  background:
                    "linear-gradient(90deg, transparent, oklch(0.82 0.14 62), transparent)",
                  borderRadius: "2px",
                }}
              />
              <h1
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "1.45rem",
                  fontWeight: 800,
                  letterSpacing: "-0.01em",
                  lineHeight: 1.15,
                  color: "white",
                  textShadow:
                    "0 2px 10px oklch(0 0 0 / 0.55), 0 0 30px oklch(0 0 0 / 0.25)",
                }}
              >
                Atrai Online
              </h1>
              <h1
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "1.45rem",
                  fontWeight: 800,
                  letterSpacing: "-0.01em",
                  lineHeight: 1.15,
                  color: "white",
                  textShadow:
                    "0 2px 10px oklch(0 0 0 / 0.55), 0 0 30px oklch(0 0 0 / 0.25)",
                }}
              >
                Bhumisheba &amp; MA Computer
              </h1>
              {/* Gold accent subtitle */}
              <p
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "oklch(0.88 0.14 62)",
                  textShadow: "0 0 16px oklch(0.82 0.14 62 / 0.45)",
                  marginTop: "0.375rem",
                }}
              >
                ভূমি সেবা ও কম্পিউটার
              </p>
              <p
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "0.67rem",
                  fontWeight: 500,
                  letterSpacing: "0.05em",
                  color: "oklch(1 0 0 / 0.50)",
                  marginTop: "0.125rem",
                }}
              >
                স্মার্ট হিসাব ব্যবস্থাপনা
              </p>
              {/* Decorative gold line below title */}
              <div
                className="mx-auto mt-2"
                style={{
                  width: "3rem",
                  height: "2px",
                  background:
                    "linear-gradient(90deg, transparent, oklch(0.82 0.14 62), transparent)",
                  borderRadius: "2px",
                }}
              />
            </div>
          </div>

          {/* Divider */}
          <div
            className="w-full h-px"
            style={{
              background:
                "linear-gradient(to right, transparent, oklch(1 0 0 / 0.15), transparent)",
            }}
          />

          {/* PIN title section */}
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
                <ShieldCheck
                  className="h-4 w-4"
                  style={{ color: "oklch(0.88 0.14 62)" }}
                />
                <h2
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    letterSpacing: "0.01em",
                    color: "white",
                  }}
                >
                  {title}
                </h2>
              </div>
              <p
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "0.82rem",
                  color: "oklch(1 0 0 / 0.68)",
                  maxWidth: "240px",
                  lineHeight: 1.4,
                }}
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
                className="w-14 h-14 text-center text-2xl font-black rounded-xl border-2 transition-all duration-200 outline-none"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 900,
                  letterSpacing: "0.02em",
                  background: digit
                    ? "oklch(0.82 0.14 62 / 0.12)"
                    : "oklch(1 0 0 / 0.06)",
                  borderColor: digit
                    ? "oklch(0.82 0.14 62 / 0.80)"
                    : "oklch(1 0 0 / 0.30)",
                  color: digit ? "oklch(0.88 0.14 62)" : "white",
                  boxShadow: digit
                    ? "0 0 14px oklch(0.82 0.14 62 / 0.22)"
                    : "none",
                }}
                aria-label={`Digit ${idx + 1}`}
                autoComplete="off"
                data-ocid={`pin.input.${idx + 1}`}
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
                className="text-xs text-center font-medium -mt-2"
                style={{ color: "oklch(0.70 0.20 22)" }}
                role="alert"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Submit button — gold gradient matching the logo image */}
          <Button
            onClick={handleSubmit}
            disabled={currentPin.length < 4}
            className="w-full font-bold"
            style={{
              background:
                currentPin.length < 4
                  ? "oklch(0.82 0.14 62 / 0.35)"
                  : "linear-gradient(135deg, oklch(0.80 0.16 62), oklch(0.72 0.18 54))",
              color: "oklch(0.12 0.04 240)",
              border: "none",
              fontFamily: "'Outfit', sans-serif",
              fontSize: "0.95rem",
              fontWeight: 700,
              letterSpacing: "0.03em",
              boxShadow:
                currentPin.length < 4
                  ? "none"
                  : "0 4px 20px oklch(0.82 0.14 62 / 0.35)",
              opacity: currentPin.length < 4 ? 0.5 : 1,
              cursor: currentPin.length < 4 ? "not-allowed" : "pointer",
            }}
            data-ocid="pin.submit_button"
          >
            {mode === "unlock"
              ? "Unlock / আনলক"
              : setupStep === "enter"
                ? "Next / পরবর্তী"
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
                    <p
                      className="text-xs font-medium max-w-[250px]"
                      style={{ color: "oklch(0.80 0.15 70)" }}
                    >
                      ⚠️ This will erase ALL your data including customers &amp;
                      transactions. Are you sure?
                    </p>
                    <div className="flex gap-2 justify-center">
                      <button
                        type="button"
                        onClick={() => setForgotWarning(false)}
                        className="text-xs underline transition-colors"
                        style={{ color: "oklch(1 0 0 / 0.60)" }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleForgotPin}
                        className="text-xs font-semibold underline transition-colors flex items-center gap-1"
                        style={{ color: "oklch(0.68 0.20 22)" }}
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
                    className="text-xs underline-offset-2 hover:underline transition-colors"
                    style={{ color: "oklch(1 0 0 / 0.55)" }}
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
