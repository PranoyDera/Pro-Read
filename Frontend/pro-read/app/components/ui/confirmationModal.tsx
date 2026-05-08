"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Archive, Trash2, X } from "lucide-react";
import { createPortal } from "react-dom";
import { ReactNode } from "react";

import { Button } from "@/app/components/ui/button";
import { cn } from "@/lib/utils";

type ModalVariant = "primary" | "danger" | "warning";

type ActionModalProps = {
  isOpen: boolean;
  onClose: () => void;

  title: string;
  description: string;

  confirmText?: string;
  cancelText?: string;

  onConfirm?: () => void;

  loading?: boolean;

  icon?: ReactNode;

  variant?: ModalVariant;

  hideCancel?: boolean;
};

const variantStyles: Record<
  ModalVariant,
  {
    button: string;
    glow: string;
    icon: ReactNode;
  }
> = {
  primary: {
    button:
      "bg-gradient-to-r from-indigo-500 to-indigo-400 hover:opacity-90",
    glow: "from-indigo-500/20",
    icon: <Archive className="size-5" />,
  },

  danger: {
    button:
      "bg-gradient-to-r from-rose-500 to-red-400 hover:opacity-90",
    glow: "from-rose-500/20",
    icon: <Trash2 className="size-5" />,
  },

  warning: {
    button:
      "bg-gradient-to-r from-amber-500 to-yellow-400 hover:opacity-90",
    glow: "from-amber-500/20",
    icon: <AlertTriangle className="size-5" />,
  },
};

export default function ActionModal({
  isOpen,
  onClose,

  title,
  description,

  confirmText = "Confirm",
  cancelText = "Cancel",

  onConfirm,

  loading = false,

  icon,
  variant = "primary",

  hideCancel = false,
}: ActionModalProps) {
  if (!isOpen) return null;

  const selectedVariant = variantStyles[variant];

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* MODAL */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className={cn(
              "relative w-full max-w-md overflow-hidden rounded-md",
              "border border-white/10",
              "bg-[#191C1F]",
              "shadow-[0_10px_50px_rgba(0,0,0,0.55)]"
            )}
          >
            {/* GLOW */}
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-br to-transparent opacity-80",
                selectedVariant.glow
              )}
            />

            {/* CONTENT */}
            <div className="relative z-10 p-8">
              {/* CLOSE BUTTON */}
              <button
                onClick={onClose}
                className="absolute right-5 top-5 text-white/40 transition hover:text-white"
              >
                <X className="size-4" />
              </button>

              {/* ICON */}
              {/* <div className="mb-6 flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white">
                {icon || selectedVariant.icon}
              </div> */}

              {/* TITLE */}
              <h2
                style={{ fontFamily: '"Noto Sans", sans-serif' }}
                className="text-3xl font-semibold tracking-tight text-white"
              >
                {title}
              </h2>

              {/* DESCRIPTION */}
              <p
                style={{ fontFamily: "Manrope, sans-serif" }}
                className="mt-5 text-[15px] leading-7 text-white/65"
              >
                {description}
              </p>

              {/* ACTIONS */}
              <div className="mt-10 space-y-3">
                <Button
                  onClick={onConfirm}
                  disabled={loading}
                  className={cn(
                    "h-12 w-full rounded-md text-sm font-semibold tracking-[0.18em] uppercase text-white",
                    selectedVariant.button
                  )}
                >
                  {loading ? "Please wait..." : confirmText}
                </Button>

                {!hideCancel && (
                  <Button
                    onClick={onClose}
                    variant="ghost"
                    className="h-12 w-full rounded-md border border-white/10 bg-white/[0.02] text-sm tracking-[0.18em] uppercase text-white/70 hover:bg-white/5 hover:text-white"
                  >
                    {cancelText}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}