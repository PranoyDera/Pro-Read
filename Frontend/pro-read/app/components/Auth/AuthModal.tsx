"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { login, signup } from "@/app/Service/AuthService";
import { setAuthToken } from "@/app/api/api";
import { Button } from "../ui/Button";
import FormField, { PasswordField } from "./FormField";
import AppDropdown from "../ui/AppDropdown";

export type AuthMode = "login" | "signup";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  mode?: AuthMode;
  setMode?: React.Dispatch<React.SetStateAction<AuthMode>>;
  setActionModalOpen?: (val:boolean) => void;
  actionModalOpen?: boolean;
};

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  mode = "login",
  setMode,
}: AuthModalProps) {
  const [country, setCountry] = useState("+91");
  const [gender, setGender] = useState("");
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"error" | "success" | "">("");

  const countryOptions = [
    { label: "🇮🇳 +91", onClick: () => setCountry("+91") },
    { label: "🇺🇸 +1", onClick: () => setCountry("+1") },
    { label: "🇬🇧 +44", onClick: () => setCountry("+44") },
  ];

  const genderOptions = [
    { label: "Male", onClick: () => setGender("Male") },
    { label: "Female", onClick: () => setGender("Female") },
    { label: "Other", onClick: () => setGender("Other") },
    { label: "Prefer not to say", onClick: () => setGender("N/A") },
  ];

  const handleMode = () => {
    if (!setMode) return;

    setStatusMessage("");
    setStatusType("");
    setMode(mode === "login" ? "signup" : "login");
  };

  const handleLoginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setLoginForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSignupChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setSignupForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const clearStatus = () => {
    setStatusMessage("");
    setStatusType("");
  };

  const getErrorMessage = (error: unknown) => {
    if (error instanceof Error && error.message.trim()) {
      return error.message;
    }

    return "Something went wrong. Please try again.";
  };

  const handleSubmit = async () => {
    clearStatus();

    if (mode === "login") {
      if (!loginForm.email.trim() || !loginForm.password.trim()) {
        setStatusType("error");
        setStatusMessage("Enter both email and password to continue.");
        return;
      }
    } else {
      if (
        !signupForm.name.trim() ||
        !signupForm.email.trim() ||
        !signupForm.password.trim() ||
        !signupForm.phoneNumber.trim() ||
        !gender.trim()
      ) {
        setStatusType("error");
        setStatusMessage("Complete all signup fields to create your account.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (mode === "login") {
        const response = await login(loginForm);

        if (response.token) {
          setAuthToken(response.token);
        }

        setStatusType("success");
        setStatusMessage(response.message || "Signed in successfully.");
        onSuccess?.();
        onClose();
        return;
      }

      const response = await signup({
        ...signupForm,
        phoneNumber: `${country}${signupForm.phoneNumber.trim()}`,
        gender,
      });

      if (response.token) {
        setAuthToken(response.token);
        setStatusType("success");
        setStatusMessage(response.message || "Account created successfully.");
        onSuccess?.();
        onClose();
        return;
      }

      setStatusType("success");
      setStatusMessage(response.message || "Account created. Please log in.");

      if (setMode) {
        setMode("login");
      }

      setLoginForm({
        email: signupForm.email,
        password: "",
      });
    } catch (error) {
      setStatusType("error");
      setStatusMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* BACKDROP */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* MODAL */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ duration: 0.3 }}
            className="relative h-[90vh] w-full max-w-5xl rounded-2xl overflow-hidden bg-[#0B1020] shadow-2xl flex flex-col md:flex-row"
          >
            {/* LEFT PANEL */}
            <div className="hidden md:flex md:w-1/2 relative bg-[#0d1224]">
              <img
                src={
                  mode === "login"
                    ? "https://lh3.googleusercontent.com/aida-public/AB6AXuC3FPH_SCVptOFkVytiT_9oPmZnor2Y2wd2ofJC1vZaU9PqiUxBZidl_K46zCFgPgl9KTETn84rb6f2jgMuXVv-DUP1SfDtH_mY7eq1MbMkmw8yV7y3_H-PG8w2CykqylCPCt0jIRoyWsiGjsZB5IEM-TTZBQGgItSs7zzMSMmuhJXaOgH6AVJyaepwCRbNInZPki_kai28oBchEeHpSMn6N42GtCBg1qJ1I0XsLzTZ4ZOXYzaIegsBVoVySvdgxX355WLfKuof90zj"
                    : "https://lh3.googleusercontent.com/aida-public/AB6AXuCB9SUYg25DD2Vq9IEeuh99n3ixDc7DPuITM_rUKJTllg2FifeYtXf18VsC1IDVxNlRc57YqtEG_dS3S8KDUp7cRw2kPCCX_1I3T8zw-UtTrAMz2iDYO0qceBrm94AUZfAjPcL3qEJFsyCYrWi6QgrUL4mE17NKTS0log3NFst_5tDRW9pTNz0KapYQUecD-tGaKUIp4LvyQ9YyvRqPCfjK2EOcXgkwDvVUm7nlYsStsyIZZB-sqgAwtSvSB4iigvGWf3N2rxbtg-er"
                } // replace with your image
                alt="library"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="relative z-10 p-8 flex flex-col justify-end text-white">
                {mode === "login" ? (
                  <p className="text-sm opacity-70 italic">
                    &quot;A sanctuary for the scholarly mind, where every word
                    finds its place in the quiet of the night.&quot;
                  </p>
                ) : (
                  <p className="text-sm opacity-70 italic">
                    &quot;Where the stars meet the written word.&quot;
                  </p>
                )}
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="w-full md:w-1/2 p-6 md:p-10 text-white  overflow-y-auto hide-scrollbar">
              {/* CLOSE */}
              <Button
                onClick={onClose}
                className="cursor-pointer absolute top-4 right-4 text-white/60 hover:text-white bg-inherit"
              >
                <X size={20} />
              </Button>

              {/* HEADER */}
              <div className="mb-8">
                <p 
                style={{ fontFamily: "Manrope, sans-serif" }}
                className="text-xs tracking-[1.2px] text-[#C1C1FF] mb-2">
                  ✦ THE DIGITAL CURATOR
                </p>
                <h2 
                style={{ fontFamily: '"Noto Sans", sans-serif' }}
                className="text-2xl md:text-3xl font-semibold">
                  {mode === "login" ? "Welcome Back" : "Create Account"}
                </h2>
                <p 
                style={{ fontFamily: "Manrope, sans-serif" }}
                className="text-xs font- text-white/60 mt-1">
                  {mode === "login"
                    ? "Access your personal scholarly collection"
                    : "Begin your archival journey"}
                </p>
              </div>

              {/* FORM */}
              <div className="space-y-5">
                {mode === "signup" && (
                  <div>
                    <FormField
                      label="FULL NAME"
                      name="name"
                      placeholder="Ava Scholar"
                      value={signupForm.name}
                      onChange={handleSignupChange}
                      disabled={isSubmitting}
                      autoComplete="name"
                    />
                  </div>
                )}

                <div>
                  <FormField
                    label="EMAIL OR USERNAME"
                    name="email"
                    placeholder="scholar@archive.edu"
                    value={mode === "login" ? loginForm.email : signupForm.email}
                    onChange={mode === "login" ? handleLoginChange : handleSignupChange}
                    disabled={isSubmitting}
                    autoComplete="email"
                  />
                </div>

                <div>
                  <div className="relative">
                    <PasswordField
                      value={mode === "login" ? loginForm.password : signupForm.password}
                      onChange={mode === "login" ? handleLoginChange : handleSignupChange}
                      disabled={isSubmitting}
                      autoComplete={mode === "login" ? "current-password" : "new-password"}
                    />
                  </div>
                  {mode === "login" && (
                    <div className="flex justify-end mt-2.5">
                      <button
                        type="button"
                        style={{ fontFamily: "Manrope, sans-serif" }}
                        className="text-xs text-white/60 hover:text-purple-300 transition-colors duration-200 font-medium cursor-pointer focus:outline-none"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}
                </div>

                {/* SIGNUP ONLY FIELDS */}
                {mode === "signup" && (
                  <>
                    {/* PHONE WITH COUNTRY */}
                    <div className="flex gap-1 items-center w-full justify-center">
                      <div className="flex-[0.2]">
                        <AppDropdown
                          label="CODE"
                          items={countryOptions}
                          selectedLabel={country}
                          className="w-full"
                        />
                      </div>

                      <div className="flex-[0.8]">
                        <FormField
                          label="PHONE"
                          name="phoneNumber"
                          placeholder="840257690"
                          value={signupForm.phoneNumber}
                          onChange={handleSignupChange}
                          disabled={isSubmitting}
                          autoComplete="tel-national"
                        />
                      </div>
                    </div>

                    {/* GENDER */}
                    <div>
                      <AppDropdown
                        label="GENDER"
                        items={genderOptions}
                        selectedLabel={gender}
                        placeholder="Select gender"
                      />
                    </div>
                  </>
                )}

                {statusMessage && (
                  <p
                    className={`text-sm ${
                      statusType === "error" ? "text-rose-300" : "text-emerald-300"
                    }`}
                  >
                    {statusMessage}
                  </p>
                )}

                {/* BUTTON */}
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 py-5 rounded-[5px] text-sm font-medium hover:opacity-90 transition disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting
                    ? mode === "login"
                      ? "Signing in..."
                      : "Creating account..."
                    : mode === "login"
                      ? "Sign in to Archive"
                      : "Create Account"}
                </Button>

                {/* DIVIDER */}
                <div className="flex items-center gap-3 text-xs text-white/40">
                  <div className="flex-1 h-px bg-white/10" />
                  OR CONTINUE WITH
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                {/* SOCIAL */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="group relative flex-1 flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-[5px] bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-white/20 text-sm font-medium text-white/90 hover:text-white transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 backdrop-blur-md"
                  >
                    <Image
                      src="/icons/google.svg"
                      alt="Google"
                      width={16}
                      height={16}
                      className="transition-transform duration-200 group-hover:scale-110"
                    />
                    <span>Google</span>
                  </button>
                  <button
                    type="button"
                    className="group relative flex-1 flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-[5px] bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-white/20 text-sm font-medium text-white/90 hover:text-white transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 backdrop-blur-md"
                  >
                    <Image
                      src="/icons/apple-icon.svg"
                      alt="Apple"
                      width={16}
                      height={16}
                      className="transition-transform duration-200 group-hover:scale-110"
                    />
                    <span>Apple</span>
                  </button>
                </div>

                {/* FOOTER */}
                <p className="text-xs text-center text-white/50 mt-4">
                  {mode === "login"
                    ? "Don't have an archive yet?"
                    : "Already have an account?"}{" "}
                  <button
                    type="button"
                    onClick={handleMode}
                    className="text-purple-400 cursor-pointer"
                  >
                    {mode === "login" ? "Sign up" : "Login"}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
