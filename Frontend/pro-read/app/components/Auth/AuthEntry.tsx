"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { LogIn } from "lucide-react";

import AuthModal, { AuthMode } from "./AuthModal";
import { Button } from "../ui/Button";
import ActionModal from "../ui/ConfirmationModal";

type AuthEntryProps = {
  onSuccess?: () => void;
  actionModalOpen?: boolean;
  setActionModalOpen?: (val: boolean) => void;
};

export default function AuthEntry({
  onSuccess,
  actionModalOpen,
  setActionModalOpen,
}: AuthEntryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");
  const [isLocalActionModalOpen, setIsLocalActionModalOpen] = useState(false);
  const router = useRouter();

  const isActionModalOpen = actionModalOpen ?? isLocalActionModalOpen;

  const handleActionModalOpenChange = (nextValue: boolean) => {
    if (setActionModalOpen) {
      setActionModalOpen(nextValue);
      return;
    }

    setIsLocalActionModalOpen(nextValue);
  };

  const openWith = (nextMode: AuthMode) => {
    setMode(nextMode);
    setIsOpen(true);
  };

  const handleSuccess = () => {
    handleActionModalOpenChange(true);

    if (onSuccess) {
      onSuccess();
      return;
    }

    if (router.pathname === "/") {
      void router.push("/home");
    }
  };

  return (
    <>
      <div className="flex items-center justify-end gap-3">
        <Button
          onClick={() => openWith("login")}
          variant="outline"
          className="h-10 rounded-[5px] border-white/20 bg-slate-900/40 px-5 text-sm font-semibold text-white hover:bg-slate-800"
        >
          <LogIn className="size-4" />
          Login
        </Button>

        {/* <Button
          onClick={() => openWith("signup")}
          className="h-10 rounded-md bg-indigo-500 px-5 text-sm font-semibold text-white hover:bg-indigo-400"
        >
          <UserPlus className="size-4" />
          Signup
        </Button> */}
      </div>

      <AuthModal
        isOpen={isOpen}
        mode={mode}
        onClose={() => setIsOpen(false)}
        onSuccess={handleSuccess}
        setMode={setMode}
      />

      <ActionModal
        isOpen={isActionModalOpen}
        onClose={() => handleActionModalOpenChange(false)}
        title="User Logged In Successfully"
        description=""
        confirmText="Ok"
        variant="primary"
        hideCancel={true}
        onConfirm={()=>{handleActionModalOpenChange(false)}}
      />
    </>
  );
}
