'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  X,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Flag,
  AlertOctagon,
  MessageSquareWarning,
  CopyX,
  Flame,
  HelpCircle,
  LucideIcon
} from 'lucide-react';
import { reportStory } from '@/app/Service/StoryService';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/Components/ui/Select';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  storyId?: string | number | null;
}

export interface ReportReasonOption {
  value: string;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
  badgeBg: string;
}

export const REPORT_REASONS: ReportReasonOption[] = [
  {
    value: 'inappropriate_content',
    label: 'Inappropriate Content',
    description: 'Explicit themes, nudity, or graphic sexual content',
    icon: AlertOctagon,
    color: 'text-amber-400',
    badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
  },
  {
    value: 'hate_speech',
    label: 'Hate Speech & Harassment',
    description: 'Targeted attacks, slurs, threats, or cyberbullying',
    icon: MessageSquareWarning,
    color: 'text-rose-400',
    badgeBg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
  },
  {
    value: 'plagiarism',
    label: 'Copyright / Plagiarism',
    description: 'Stolen or uncredited work published without permission',
    icon: CopyX,
    color: 'text-purple-400',
    badgeBg: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
  },
  {
    value: 'violence',
    label: 'Violence & Harm',
    description: 'Depictions of extreme violence, self-harm, or danger',
    icon: ShieldAlert,
    color: 'text-red-400',
    badgeBg: 'bg-red-500/10 border-red-500/30 text-red-400',
  },
  {
    value: 'spam',
    label: 'Spam or Misleading',
    description: 'Scams, malicious links, repetitive bots, or deceptive tags',
    icon: Flame,
    color: 'text-orange-400',
    badgeBg: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
  },
  {
    value: 'other',
    label: 'Other Issues',
    description: 'Any issue not listed above (please specify below)',
    icon: HelpCircle,
    color: 'text-cyan-400',
    badgeBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
  },
];

export default function ReportModal({ isOpen, onClose, storyId }: ReportModalProps) {
  const [reportReason, setReportReason] = useState<string>('inappropriate_content');
  const [reportDetails, setReportDetails] = useState<string>('');
  const [isSubmittingReport, setIsSubmittingReport] = useState<boolean>(false);
  const [reportFeedback, setReportFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    if (!isSubmittingReport) {
      onClose();
      setReportFeedback(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyId) {
      setReportFeedback({ type: 'error', text: 'Story ID is not available.' });
      return;
    }

    if (reportReason === 'other' && !reportDetails.trim()) {
      setReportFeedback({ type: 'error', text: 'Please specify the reason in the text area below.' });
      return;
    }

    try {
      setIsSubmittingReport(true);
      setReportFeedback(null);

      const res = await reportStory(storyId, {
        reason: reportReason,
        details: reportDetails.trim() || undefined,
      });

      setReportFeedback({
        type: 'success',
        text: res.message || 'Report submitted successfully. Our moderation team will review it.'
      });

      setTimeout(() => {
        handleClose();
        setReportReason('inappropriate_content');
        setReportDetails('');
      }, 2200);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to submit report. Please try again.';
      setReportFeedback({ type: 'error', text: msg });
    } finally {
      setIsSubmittingReport(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#0c1228] border border-purple-500/30 rounded-[8px] p-6 shadow-[8px] space-y-4 ring-1 ring-purple-500/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Report Story</h4>
              <p className="text-[11px] text-slate-400">Flag content that violates community guidelines</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feedback Notification Banner */}
        {reportFeedback && (
          <div className={`p-3 rounded-xl text-xs flex items-start gap-2 border ${
            reportFeedback.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
          }`}>
            {reportFeedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            )}
            <span>{reportFeedback.text}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Reason Select Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
              <span>Select Reason for Report <span className="text-rose-400">*</span></span>
            </label>
            <Select
              value={reportReason}
              onValueChange={(val) => {
                if (val) setReportReason(val);
              }}
              disabled={isSubmittingReport}
            >
              <SelectTrigger className="w-full h-auto bg-slate-900/90 hover:bg-slate-900 border border-white/10 hover:border-purple-500/40 rounded-[5px] px-3 py-5 text-xs text-slate-100 focus-visible:border-purple-500/80 focus-visible:ring-2 focus-visible:ring-purple-500/20 transition-all cursor-pointer shadow-inner group">
                <SelectValue placeholder="Select a reason...">
                  {(() => {
                    const selected = REPORT_REASONS.find((r) => r.value === reportReason);
                    if (!selected) return <span>Select a reason...</span>;
                    const Icon = selected.icon;
                    return (
                      <div className="flex items-center gap-2.5 py-0.5 text-left">
                        <div className={`p-1.5 rounded-lg border ${selected.badgeBg} shrink-0`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-slate-100 tracking-tight">{selected.label}</span>
                        </div>
                      </div>
                    );
                  })()}
                </SelectValue>
              </SelectTrigger>
              <SelectContent 
                side="bottom" 
                sideOffset={8} 
                align="start" 
                alignItemWithTrigger={false}
                className="dark bg-[#0b1022]/98 backdrop-blur-xl border border-purple-500/30 text-slate-100 shadow-[0_16px_40px_rgba(0,0,0,0.65)] rounded-xl z-[70] p-1.5 min-w-[320px] max-h-72 [--accent-foreground:theme(colors.white)]"
              >
                {REPORT_REASONS.map((r) => {
                  const Icon = r.icon;
                  const isSelected = reportReason === r.value;
                  return (
                    <SelectItem
                      key={r.value}
                      value={r.value}
                      className={`text-xs rounded-xl px-2.5 py-2.5 cursor-pointer transition-all duration-150 mb-1 last:mb-0 ${
                        isSelected 
                          ? '!bg-purple-600/30 border border-purple-400/50 shadow-sm' 
                          : 'border border-transparent hover:!bg-white/[0.08] focus:!bg-white/[0.12] focus:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3 w-full py-0.5 pr-2">
                        <div className={`p-1.5 rounded-lg border ${r.badgeBg} shrink-0`}>
                          <Icon className={`w-4 h-4 !${r.color}`} />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className={`font-semibold tracking-tight leading-snug ${isSelected ? '!text-white' : '!text-slate-200'}`}>
                            {r.label}
                          </span>
                          <span className={`text-[10.5px] font-normal leading-tight mt-0.5 ${isSelected ? '!text-purple-200' : '!text-slate-400'}`}>
                            {r.description}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Text Area (Required when other is chosen, optional otherwise) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
              <span>
                {reportReason === 'other' ? (
                  <>Details / Explanation <span className="text-rose-400">*</span></>
                ) : (
                  <>Additional Details <span className="text-[10px] text-slate-400 font-normal">(Optional)</span></>
                )}
              </span>
              {reportReason === 'other' && (
                <span className="text-[10px] text-purple-400 font-medium">Required for Other</span>
              )}
            </label>
            <textarea
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              disabled={isSubmittingReport}
              rows={reportReason === 'other' ? 4 : 3}
              placeholder={
                reportReason === 'other'
                  ? "Please describe the specific issue or concern with this story..."
                  : "Provide any extra context, timestamps, or excerpt quotes..."
              }
              className="w-full bg-slate-900/90 border border-white/10 rounded-[5px] p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/70 focus:ring-1 focus:ring-purple-500 resize-none transition-all"
            />
          </div>

          {/* Modal Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmittingReport}
              className="px-4 py-2 rounded-[5px] text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmittingReport || (reportReason === 'other' && !reportDetails.trim())}
              className="px-4 py-2 rounded-[5px]! bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-[5px] shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {isSubmittingReport ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Flag className="w-3.5 h-3.5" />
                  <span>Submit Report</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
