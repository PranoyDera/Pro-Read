"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Camera,
  Sparkles,
  User,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  Loader2,
  UploadCloud,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/app/Components/ui/Button";
import axiosInstance from "@/app/api/api";
import { API_ENDPOINTS } from "@/app/Constants/Common";

type EditProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  userData: {
    id: number;
    name: string;
    email: string;
    phoneNumber?: string;
    gender?: string;
    profilePic?: string | null;
    coverPic?: string | null;
    bio?: string;
    birthDate?: string;
    role?: string;
    tagline?: string;
  };
  onProfileUpdated: (updatedUser: any) => void;
};

export default function EditProfileModal({
  isOpen,
  onClose,
  userData,
  onProfileUpdated,
}: EditProfileModalProps) {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    gender: "",
    profilePic: "",
    bio: "",
    birthDate: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Cleanup camera stream on unmount or modal close
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setErrorMessage(null);
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 640 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      setIsCameraOpen(false);
      setErrorMessage(
        "Could not access camera. Please allow camera permissions in your browser or choose a file from device."
      );
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      setFormData((prev) => ({ ...prev, profilePic: dataUrl }));
    }
    stopCamera();
  };

  useEffect(() => {
    if (isOpen && userData) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        phoneNumber: userData.phoneNumber || "",
        gender: userData.gender || "unspecified",
        profilePic: userData.profilePic || "",
        bio: userData.bio || "",
        birthDate: userData.birthDate ? userData.birthDate.split("T")[0] : "",
      });
      setErrorMessage(null);
      setSuccessMessage(null);
      stopCamera();
    } else {
      stopCamera();
    }
  }, [isOpen, userData]);

  if (!mounted || !isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file (PNG, JPG, WebP, etc.)");
      return;
    }
    // Limit file size to 5MB
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Image size must be less than 5MB");
      return;
    }

    setErrorMessage(null);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setFormData((prev) => ({ ...prev, profilePic: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemovePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFormData((prev) => ({ ...prev, profilePic: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!formData.name.trim()) {
      setErrorMessage("Name is required");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload: Record<string, any> = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber.trim() || null,
        gender: formData.gender || null,
        profilePic: formData.profilePic || null,
        bio: formData.bio.trim() || null,
        birthDate: formData.birthDate || null,
      };

      const response = await axiosInstance.put(API_ENDPOINTS.user.update, payload);
      setSuccessMessage(response.data?.message || "Profile updated successfully!");
      
      if (response.data && response.data.user) {
        onProfileUpdated(response.data.user);
      } else {
        onProfileUpdated({
          ...userData,
          ...payload,
        });
      }

      setTimeout(() => {
        onClose();
      }, 900);
    } catch (err: any) {
      console.error("Profile update error:", err);
      const serverMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to update profile. Please try again.";
      setErrorMessage(serverMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* BACKDROP */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

          {/* MODAL CARD */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative flex flex-col w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-[5px] border border-white/10 bg-[#0d111c] text-white shadow-[0_20px_60px_rgba(0,0,0,0.85)] z-10 my-auto"
          >
            {/* AMBIENT GLOW EFFECTS */}
            <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-indigo-600/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-purple-600/20 blur-3xl" />
            <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-indigo-500/10 blur-[100px]" />

            {/* HEADER (Sticky top) */}
            <div className="relative shrink-0 border-b border-white/10 px-7 py-5 flex items-center justify-between bg-[#0d111c]/90 backdrop-blur-md z-20">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.25)]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h2
                    style={{ fontFamily: '"Noto Serif", sans-serif' }}
                    className="text-2xl font-bold tracking-tight text-[#E1E2E7]"
                  >
                    Edit Profile
                  </h2>
                  <p
                    style={{ fontFamily: "Manrope, sans-serif" }}
                    className="text-xs text-[#9aa0b4] mt-0.5"
                  >
                    Personalize your author and reader persona
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 hover:bg-white/10 hover:text-white transition disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* FORM WRAPPER */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
              {/* SCROLLABLE FORM BODY */}
              <div className="relative flex-1 overflow-y-auto px-7 py-6 space-y-6 custom-scrollbar">
                {/* STATUS NOTIFICATIONS */}
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-300"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                    <span>{errorMessage}</span>
                  </motion.div>
                )}

                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-300"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                    <span>{successMessage}</span>
                  </motion.div>
                )}

                {/* AVATAR UPLOAD SECTION */}
                <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4 sm:p-5">
                  {/* LIVE CAMERA CAPTURE VIEW */}
                  {isCameraOpen ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative w-full max-w-sm aspect-square overflow-hidden rounded-xl border border-indigo-500/40 bg-black shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="h-full w-full object-cover scale-x-[-1]"
                        />
                        <div className="absolute inset-0 border-2 border-dashed border-white/25 pointer-events-none m-6 rounded-full" />
                      </div>

                      <div className="flex items-center gap-3">
                        <Button
                          type="button"
                          onClick={capturePhoto}
                          className="h-10 rounded-[5px] bg-gradient-to-r from-indigo-600 to-purple-600 px-5 text-xs font-semibold uppercase tracking-wider text-white shadow-lg hover:opacity-90 flex items-center gap-2 cursor-pointer"
                        >
                          <Camera className="h-4 w-4" />
                          Snap Photo
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={stopCamera}
                          className="h-10 rounded-[5px] border border-white/10 px-4 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:bg-white/10 hover:text-white cursor-pointer"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      {/* AVATAR PREVIEW */}
                      <div className="relative group shrink-0">
                        <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 opacity-60 blur-xs transition group-hover:opacity-100" />
                        {formData.profilePic ? (
                          <img
                            src={formData.profilePic}
                            alt="Avatar Preview"
                            className="relative h-20 w-20 rounded-full border-2 border-[#121826] object-cover bg-black shadow-md"
                            onError={() => {
                              setFormData((prev) => ({ ...prev, profilePic: "" }));
                            }}
                          />
                        ) : (
                          <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#121826] bg-gradient-to-br from-indigo-600 to-purple-800 text-2xl font-bold uppercase text-white shadow-md">
                            {formData.name?.trim() ? formData.name.trim().charAt(0) : "U"}
                          </div>
                        )}
                      </div>

                      {/* TWO OPTIONS: 1) DRAG & DROP / DEVICE 2) CLICK PICTURE */}
                      <div className="w-full space-y-2.5">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          id="profile-pic-upload"
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* OPTION 1: DRAG & DROP / CHOOSE FROM DEVICE */}
                          <div
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onClick={() => fileInputRef.current?.click()}
                            className={`group relative flex flex-col items-center justify-center rounded-xl border border-dashed p-4 text-center cursor-pointer transition-all duration-200 ${
                              isDragging
                                ? "border-indigo-400 bg-indigo-500/15 shadow-[0_0_20px_rgba(99,102,241,0.25)]"
                                : "border-white/15 bg-white/[0.02] hover:border-indigo-500/50 hover:bg-white/[0.05]"
                            }`}
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 group-hover:scale-110 transition">
                              <UploadCloud className="h-5 w-5" />
                            </div>
                            <p
                              style={{ fontFamily: "Manrope, sans-serif" }}
                              className="text-xs font-semibold text-slate-200 group-hover:text-white mt-2.5 transition"
                            >
                              Drag & drop image here
                            </p>
                            <p
                              style={{ fontFamily: "Manrope, sans-serif" }}
                              className="text-[11px] text-slate-400 mt-0.5"
                            >
                              or click to browse from device
                            </p>
                          </div>

                          {/* OPTION 2: CLICK PICTURE WITH CAMERA */}
                          <div
                            onClick={startCamera}
                            className="group relative flex flex-col items-center justify-center rounded-xl border border-dashed border-indigo-500/30 bg-indigo-500/[0.04] p-4 text-center cursor-pointer transition-all duration-200 hover:border-indigo-400 hover:bg-indigo-500/10 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 group-hover:scale-110 transition">
                              <Camera className="h-5 w-5" />
                            </div>
                            <p
                              style={{ fontFamily: "Manrope, sans-serif" }}
                              className="text-xs font-semibold text-indigo-200 group-hover:text-white mt-2.5 transition"
                            >
                              Click picture
                            </p>
                            <p
                              style={{ fontFamily: "Manrope, sans-serif" }}
                              className="text-[11px] text-indigo-300/70 mt-0.5"
                            >
                              Use your device camera
                            </p>
                          </div>
                        </div>

                        {formData.profilePic && (
                          <div className="flex items-center justify-between pt-1 px-1">
                            <span
                              style={{ fontFamily: "Manrope, sans-serif" }}
                              className="text-[11px] text-emerald-400 flex items-center gap-1"
                            >
                              <CheckCircle2 className="h-3 w-3" /> Image selected
                            </span>
                            <button
                              type="button"
                              onClick={handleRemovePhoto}
                              className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 transition cursor-pointer"
                            >
                              <Trash2 className="h-3 w-3" /> Remove picture
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* TWO COLUMN GRID FOR BASIC INFO */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* NAME */}
                  <div className="space-y-1.5">
                    <label
                      style={{ fontFamily: "Manrope, sans-serif" }}
                      className="text-xs font-medium text-[#C7C4D7] flex items-center gap-1.5"
                    >
                      <User className="h-3.5 w-3.5 text-indigo-400" />
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:bg-white/[0.08] focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  {/* EMAIL */}
                  <div className="space-y-1.5">
                    <label
                      style={{ fontFamily: "Manrope, sans-serif" }}
                      className="text-xs font-medium text-[#C7C4D7] flex items-center gap-1.5"
                    >
                      <Mail className="h-3.5 w-3.5 text-indigo-400" />
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:bg-white/[0.08] focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  {/* PHONE NUMBER */}
                  <div className="space-y-1.5">
                    <label
                      style={{ fontFamily: "Manrope, sans-serif" }}
                      className="text-xs font-medium text-[#C7C4D7] flex items-center gap-1.5"
                    >
                      <Phone className="h-3.5 w-3.5 text-indigo-400" />
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="+1 234 567 8900"
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:bg-white/[0.08] focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  {/* GENDER */}
                  <div className="space-y-1.5">
                    <label
                      style={{ fontFamily: "Manrope, sans-serif" }}
                      className="text-xs font-medium text-[#C7C4D7]"
                    >
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-white/10 bg-[#121826] px-3 py-2 text-sm text-slate-200 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="unspecified">Prefer not to say</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Non-binary / Other</option>
                    </select>
                  </div>

                  {/* BIRTH DATE */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label
                      style={{ fontFamily: "Manrope, sans-serif" }}
                      className="text-xs font-medium text-[#C7C4D7] flex items-center gap-1.5"
                    >
                      <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                      Birth Date
                    </label>
                    <input
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-white/10 bg-[#121826] px-3 py-2 text-sm text-slate-200 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 [color-scheme:dark]"
                    />
                  </div>
                </div>

                {/* BIO */}
                <div className="space-y-1.5">
                  <label
                    style={{ fontFamily: "Manrope, sans-serif" }}
                    className="text-xs font-medium text-[#C7C4D7] flex items-center gap-1.5"
                  >
                    <BookOpen className="h-3.5 w-3.5 text-indigo-400" />
                    Bio & Reader Philosophy
                  </label>
                  <textarea
                    name="bio"
                    rows={3}
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Share your literary taste, favorite genres, or background..."
                    className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:bg-white/[0.08] focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* STICKY FOOTER ACTIONS */}
              <div className="relative shrink-0 border-t border-white/10 px-7 py-4 flex items-center justify-end gap-3 bg-[#0d111c]/90 backdrop-blur-md z-20">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="h-10 rounded-[5px] px-5 text-xs tracking-wider uppercase text-slate-400 hover:bg-white/5 hover:text-white border border-white/5 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-10 rounded-[5px] bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 px-6 text-xs font-semibold tracking-wider uppercase text-white shadow-[0_0_20px_rgba(99,102,241,0.35)] hover:opacity-95 transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
