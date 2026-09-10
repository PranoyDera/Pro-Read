"use client";

import React, { useState, useRef } from "react";
import {
  Trophy,
  Upload,
  X,
  Plus,
  Loader2,
  AlertCircle,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { createAchievement, AchievementItem } from "@/app/service/achivement-service";

interface AddAchievementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (createdAchievement: AchievementItem) => void;
}

type RuleType =
  | "booksRead"
  | "dayStreak"
  | "hoursImmersed"
  | "reviewsCount"
  | "genresCount"
  | "custom";

export default function AddAchievementModal({
  open,
  onOpenChange,
  onSuccess,
}: AddAchievementModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ruleType, setRuleType] = useState<RuleType>("booksRead");
  const [ruleThreshold, setRuleThreshold] = useState<number | string>(5);
  const [customRuleJson, setCustomRuleJson] = useState(
    '{\n  "minBooksRead": 5\n}'
  );
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);

  // Submission / validation state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Reset form
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setRuleType("booksRead");
    setRuleThreshold(5);
    setCustomRuleJson('{\n  "minBooksRead": 5\n}');
    setIconFile(null);
    setIconPreview(null);
    setErrorMessage(null);
  };

  const handleClose = () => {
    if (isSubmitting) return;
    onOpenChange(false);
    resetForm();
  };

  // Image upload handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file (PNG, JPG, SVG, WebP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Image size must not exceed 5MB");
      return;
    }

    setIconFile(file);
    const objectUrl = URL.createObjectURL(file);
    setIconPreview(objectUrl);
    setErrorMessage(null);
  };

  const handleRemoveIcon = () => {
    setIconFile(null);
    if (iconPreview) {
      URL.revokeObjectURL(iconPreview);
      setIconPreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Build the rule string based on type
  const buildRuleString = (): string => {
    if (ruleType === "custom") {
      return customRuleJson.trim();
    }

    const num = Number(ruleThreshold) || 1;
    switch (ruleType) {
      case "booksRead":
        return JSON.stringify({ minBooksRead: num });
      case "dayStreak":
        return JSON.stringify({ minDayStreak: num });
      case "hoursImmersed":
        return JSON.stringify({ minHoursImmersed: num });
      case "reviewsCount":
        return JSON.stringify({ minReviews: num });
      case "genresCount":
        return JSON.stringify({ minGenres: num });
      default:
        return JSON.stringify({ minBooksRead: num });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    const trimmedTitle = title.trim();
    const trimmedDesc = description.trim();

    if (!trimmedTitle) {
      setErrorMessage("Title is required");
      return;
    }

    if (!trimmedDesc) {
      setErrorMessage("Description is required");
      return;
    }

    const ruleString = buildRuleString();
    if (!ruleString) {
      setErrorMessage("Please define an achievement rule");
      return;
    }

    if (ruleType === "custom") {
      try {
        JSON.parse(ruleString);
      } catch {
        setErrorMessage("Custom rule must be a valid JSON string");
        return;
      }
    }

    try {
      setIsSubmitting(true);

      // Prepare FormData payload
      const formData = new FormData();
      formData.append("title", trimmedTitle);
      formData.append("description", trimmedDesc);
      formData.append("rule", ruleString);

      if (iconFile) {
        formData.append("icon", iconFile);
      }

      const res = await createAchievement(formData);

      if (onSuccess && res.achievement) {
        onSuccess(res.achievement);
      }

      handleClose();
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to create achievement";
      setErrorMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !isSubmitting && onOpenChange(val)}>
      <DialogContent className="max-w-md w-full bg-white text-neutral-900 shadow-xl border border-neutral-200 p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-200">
          <DialogHeader className="border-b-0 pb-0">
            <div className="flex items-center gap-2 text-neutral-950">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center shadow-xs">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-neutral-950">
                  Add Achievement
                </DialogTitle>
                <DialogDescription className="text-xs text-neutral-500">
                  Create a new milestone badge and define unlock conditions.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {/* Error Banner */}
          {errorMessage && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-800 flex items-center justify-between">
              <span>
                Title <span className="text-red-500">*</span>
              </span>
              <span className="text-[10px] text-neutral-500 font-normal">
                e.g. Master Bibliophile
              </span>
            </label>
            <Input
              placeholder="Enter achievement title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
              className="bg-white border-neutral-300 text-neutral-900 placeholder:text-neutral-400 focus-visible:border-neutral-900 text-xs"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-800 flex items-center justify-between">
              <span>
                Description <span className="text-red-500">*</span>
              </span>
              <span className="text-[10px] text-neutral-500 font-normal">
                How user earns it
              </span>
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Read 50 stories across multiple genres..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              className="w-full rounded-[5px] border border-neutral-300 bg-white px-2.5 py-1.5 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none transition-[color,box-shadow,border-color] focus-visible:border-neutral-900 focus-visible:ring-2 focus-visible:ring-neutral-900/10 resize-none"
            />
          </div>

          {/* Rule Type & Threshold */}
          <div className="space-y-2 p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-neutral-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-neutral-700" />
                <span>Unlock Condition (Rule)</span>
              </label>
              <span className="text-[10px] font-mono text-neutral-500">
                Automated check
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <span className="text-[11px] text-neutral-600 font-medium">Metric</span>
                <Select
                  value={ruleType}
                  onValueChange={(val) => {
                    if (val) setRuleType(val as RuleType);
                  }}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="w-full bg-white border-neutral-300 text-xs text-neutral-900">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-neutral-200 text-xs">
                    <SelectItem value="booksRead">Books Read</SelectItem>
                    <SelectItem value="dayStreak">Day Streak</SelectItem>
                    <SelectItem value="hoursImmersed">Hours Immersed</SelectItem>
                    <SelectItem value="reviewsCount">Reviews Left</SelectItem>
                    <SelectItem value="genresCount">Genres Explored</SelectItem>
                    <SelectItem value="custom">Custom JSON</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {ruleType !== "custom" ? (
                <div className="space-y-1">
                  <span className="text-[11px] text-neutral-600 font-medium">Minimum Value</span>
                  <Input
                    type="number"
                    min="1"
                    value={ruleThreshold}
                    onChange={(e) => setRuleThreshold(e.target.value)}
                    disabled={isSubmitting}
                    className="bg-white border-neutral-300 text-xs text-neutral-900"
                  />
                </div>
              ) : (
                <div className="col-span-2 space-y-1 mt-1">
                  <span className="text-[11px] text-neutral-600 font-medium">
                    JSON Rule Configuration
                  </span>
                  <textarea
                    rows={3}
                    value={customRuleJson}
                    onChange={(e) => setCustomRuleJson(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full font-mono text-[11px] rounded-[5px] border border-neutral-300 bg-white p-2 text-neutral-900 placeholder:text-neutral-400 outline-none focus-visible:border-neutral-900 resize-none"
                  />
                </div>
              )}
            </div>

            <div className="text-[10px] text-neutral-500 pt-0.5">
              Backend rule evaluation:{" "}
              <code className="bg-neutral-200 px-1 py-0.5 rounded text-neutral-800 font-mono text-[10px]">
                {buildRuleString()}
              </code>
            </div>
          </div>

          {/* Badge Icon Upload */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-800 flex items-center justify-between">
              <span>Badge Icon (Optional)</span>
              <span className="text-[10px] text-neutral-500 font-normal">
                Max 5MB (PNG/SVG)
              </span>
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isSubmitting}
            />

            {iconPreview ? (
              <div className="flex items-center gap-3 p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg">
                <img
                  src={iconPreview}
                  alt="Badge Icon Preview"
                  className="w-12 h-12 rounded-lg object-cover border border-neutral-300 bg-white shrink-0 shadow-2xs"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-neutral-900 truncate">
                    {iconFile?.name}
                  </p>
                  <p className="text-[10px] text-neutral-500">
                    {iconFile ? `${(iconFile.size / 1024).toFixed(1)} KB` : ""}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={handleRemoveIcon}
                  disabled={isSubmitting}
                  className="text-neutral-500 hover:text-red-600 hover:bg-red-50"
                  title="Remove Image"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-dashed border-neutral-300 hover:border-neutral-500 bg-white hover:bg-neutral-50/50 rounded-lg text-xs font-medium text-neutral-700 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-neutral-500" />
                <span>Choose Badge Icon Image</span>
              </button>
            )}
          </div>

          {/* Footer Actions */}
          <DialogFooter className="mt-4 pt-3 border-t border-neutral-200">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClose}
              disabled={isSubmitting}
              className="border-neutral-300 text-neutral-700 hover:bg-neutral-100 font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="bg-neutral-950 text-white hover:bg-neutral-800 font-medium shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Achievement</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
