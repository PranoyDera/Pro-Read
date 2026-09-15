"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  Clock,
  Heart,
  MessageSquare,
  Eye,
  ShieldAlert,
  Star,
  Ban,
  CheckCircle2,
  Calendar,
  User,
  BookOpen,
  Loader2,
  AlertTriangle,
  AlertOctagon,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  AdminStory,
  StoryReport,
  getSingleStory,
  getStoryReports,
  featureStory,
} from "@/app/service/story-service";
import { toast } from "@/app/components/ui/toast";

interface StoryViewModalProps {
  storyId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onStoryUpdated?: () => void;
}

export function StoryViewModal({
  storyId,
  isOpen,
  onClose,
  onStoryUpdated,
}: StoryViewModalProps) {
  const [story, setStory] = useState<AdminStory | null>(null);
  const [reports, setReports] = useState<StoryReport[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFeaturing, setIsFeaturing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"details" | "reports">("details");

  useEffect(() => {
    if (!isOpen || !storyId) {
      setStory(null);
      setReports([]);
      return;
    }

    let isMounted = true;
    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        const [storyData, reportsData] = await Promise.all([
          getSingleStory(storyId),
          getStoryReports(storyId).catch(() => []),
        ]);
        if (isMounted) {
          setStory(storyData);
          setReports(reportsData);
          if (storyData?.reports && storyData.reports > 0) {
            // If there are reports, keep details tab default but tab is visible
          }
        }
      } catch (err: any) {
        toast.add({
          title: "Failed to load story details",
          description: err.message || "Could not retrieve story information.",
          type: "error",
          timeout: 4000,
        });
        onClose();
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchDetails();

    return () => {
      isMounted = false;
    };
  }, [isOpen, storyId, onClose]);

  if (!isOpen) return null;

  const handleToggleFeature = async () => {
    if (!story) return;
    setIsFeaturing(true);
    const newFeatured = !story.is_featured;
    try {
      await featureStory(story.id, newFeatured);
      setStory((prev) => (prev ? { ...prev, is_featured: newFeatured } : null));
      toast.add({
        title: newFeatured ? "Story Featured" : "Story Unfeatured",
        description: `"${story.title}" is now ${newFeatured ? "featured" : "unfeatured"}.`,
        type: "success",
        timeout: 3000,
      });
      onStoryUpdated?.();
    } catch (err: any) {
      toast.add({
        title: "Action failed",
        description: err.message || "Failed to update featured state.",
        type: "error",
        timeout: 4000,
      });
    } finally {
      setIsFeaturing(false);
    }
  };

  const getReasonBadge = (reason: string) => {
    const r = reason.toLowerCase();
    if (r.includes("inappropriate") || r.includes("explicit")) {
      return "bg-amber-500/10 text-amber-700 border-amber-300";
    }
    if (r.includes("hate") || r.includes("harass")) {
      return "bg-rose-500/10 text-rose-700 border-rose-300";
    }
    if (r.includes("violence") || r.includes("harm")) {
      return "bg-red-500/10 text-red-700 border-red-300";
    }
    if (r.includes("spam")) {
      return "bg-orange-500/10 text-orange-700 border-orange-300";
    }
    if (r.includes("plagiarism") || r.includes("copyright")) {
      return "bg-purple-500/10 text-purple-700 border-purple-300";
    }
    return "bg-neutral-100 text-neutral-700 border-neutral-300";
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white border border-neutral-300 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-950 flex items-center gap-2">
                Story Details
                {story?.is_blocked && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-800 font-semibold border border-neutral-300">
                    Blocked
                  </span>
                )}
                {story?.is_featured && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold border border-amber-300 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Featured
                  </span>
                )}
              </h3>
              <p className="text-xs text-neutral-500">
                {story ? `ID: #${story.id}` : "Loading details..."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex items-center border-b border-neutral-200 px-6 gap-2 bg-white">
          <button
            type="button"
            onClick={() => setActiveTab("details")}
            className={`py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === "details"
                ? "border-neutral-950 text-neutral-950"
                : "border-transparent text-neutral-500 hover:text-neutral-800"
            }`}
          >
            Overview & Content
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("reports")}
            className={`py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === "reports"
                ? "border-neutral-950 text-neutral-950"
                : "border-transparent text-neutral-500 hover:text-neutral-800"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>Reports</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                reports.length > 0
                  ? "bg-amber-100 text-amber-800 border border-amber-300"
                  : "bg-neutral-100 text-neutral-600"
              }`}
            >
              {reports.length}
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-neutral-500 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-neutral-700" />
              <span className="text-xs">Fetching story details from server...</span>
            </div>
          ) : !story ? (
            <div className="text-center py-12 text-neutral-500 text-xs">
              No story data found.
            </div>
          ) : activeTab === "details" ? (
            <>
              {/* Cover Pic & Key Meta */}
              <div className="flex flex-col sm:flex-row gap-5">
                {story.cover_pic && (
                  <div className="w-full sm:w-44 h-48 rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100 shrink-0">
                    <img
                      src={story.cover_pic}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="inline-block rounded border border-neutral-300 bg-neutral-100 px-2 py-0.5 text-xs text-neutral-800 font-semibold mb-1.5">
                      {story.genre || "General"}
                    </span>
                    <h2 className="text-lg font-bold text-neutral-950 leading-snug">
                      {story.title}
                    </h2>
                    <div className="flex items-center gap-2 text-xs text-neutral-600 mt-2">
                      <User className="w-3.5 h-3.5 text-neutral-400" />
                      <span className="font-semibold text-neutral-900">{story.author_name || "Unknown"}</span>
                      <span>({story.author_email || "No email"})</span>
                    </div>
                  </div>

                  {/* Metrics Badges */}
                  <div className="grid grid-cols-4 gap-2 pt-2 border-t border-neutral-100">
                    <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-2 text-center">
                      <div className="flex items-center justify-center gap-1 text-[11px] text-neutral-500">
                        <Eye className="w-3 h-3" /> Reads
                      </div>
                      <div className="text-sm font-bold text-neutral-950 font-mono mt-0.5">
                        {story.reads_count || 0}
                      </div>
                    </div>
                    <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-2 text-center">
                      <div className="flex items-center justify-center gap-1 text-[11px] text-neutral-500">
                        <Heart className="w-3 h-3 text-rose-500" /> Likes
                      </div>
                      <div className="text-sm font-bold text-neutral-950 font-mono mt-0.5">
                        {story.likes_count || 0}
                      </div>
                    </div>
                    <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-2 text-center">
                      <div className="flex items-center justify-center gap-1 text-[11px] text-neutral-500">
                        <MessageSquare className="w-3 h-3 text-blue-500" /> Comments
                      </div>
                      <div className="text-sm font-bold text-neutral-950 font-mono mt-0.5">
                        {story.comments_count || 0}
                      </div>
                    </div>
                    <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-2 text-center">
                      <div className="flex items-center justify-center gap-1 text-[11px] text-neutral-500">
                        <ShieldAlert className="w-3 h-3 text-amber-500" /> Reports
                      </div>
                      <div className="text-sm font-bold text-neutral-950 font-mono mt-0.5">
                        {story.reports || 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Story Description / Content */}
              <div className="space-y-1.5 pt-2 border-t border-neutral-200">
                <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                  Story Description / Synopsis
                </label>
                <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-xs text-neutral-800 leading-relaxed max-h-72 overflow-y-auto font-sans [&_h1]:text-base [&_h1]:font-bold [&_h1]:mb-2 [&_h2]:text-sm [&_h2]:font-bold [&_h2]:mb-1.5 [&_h3]:text-xs [&_h3]:font-bold [&_h3]:mb-1 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-2 [&_li]:mb-0.5 [&_strong]:font-semibold [&_em]:italic [&_span]:!bg-transparent">
                  {story.description ? (
                    /<[a-z][\s\S]*>/i.test(story.description) ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: story.description,
                        }}
                      />
                    ) : (
                      <div className="whitespace-pre-wrap">{story.description}</div>
                    )
                  ) : (
                    <span className="text-neutral-400 italic">No description provided for this story.</span>
                  )}
                </div>
              </div>

              {/* Additional Meta Info */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs text-neutral-600 border-t border-neutral-200">
                <div>
                  <span className="font-semibold text-neutral-900 block">Read Time:</span>
                  <span>{story.read_time || "1 min read"}</span>
                </div>
                <div>
                  <span className="font-semibold text-neutral-900 block">Status:</span>
                  <span className="capitalize">{story.status || "published"}</span>
                </div>
                <div>
                  <span className="font-semibold text-neutral-900 block">Created At:</span>
                  <span>
                    {story.created_at
                      ? new Date(story.created_at).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </>
          ) : (
            /* Reports Tab */
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                    Community Reports ({reports.length})
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    Flagged submissions by readers regarding community guidelines
                  </p>
                </div>
              </div>

              {reports.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-neutral-500 gap-2 border border-dashed border-neutral-300 rounded-lg">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  <span className="text-xs font-semibold text-neutral-800">
                    No reports submitted
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    This story currently has zero community flags.
                  </span>
                </div>
              ) : (
                <div className="space-y-3">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className="border border-neutral-200 rounded-lg p-3.5 bg-neutral-50/70 space-y-2 hover:border-neutral-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded font-semibold border ${getReasonBadge(
                            report.reason
                          )}`}
                        >
                          {report.reason.replace(/_/g, " ").toUpperCase()}
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {report.created_at
                              ? new Date(report.created_at).toLocaleString()
                              : "N/A"}
                          </span>
                        </div>
                      </div>

                      {report.details ? (
                        <p className="text-xs text-neutral-800 bg-white p-2.5 rounded border border-neutral-200">
                          {report.details}
                        </p>
                      ) : (
                        <p className="text-[11px] text-neutral-400 italic">
                          No extra details provided by reporter.
                        </p>
                      )}

                      <div className="flex items-center gap-2 text-[11px] text-neutral-500 pt-1 border-t border-neutral-200/60">
                        <User className="w-3 h-3 text-neutral-400" />
                        <span>Reporter: {report.user_name || "Anonymous Reader"}</span>
                        {report.user_email && <span>({report.user_email})</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-neutral-200 bg-neutral-50">
          <div>
            {story && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleFeature}
                disabled={isFeaturing}
                className={`text-xs font-semibold cursor-pointer ${
                  story.is_featured
                    ? "border-amber-400 bg-amber-50 text-amber-900 hover:bg-amber-100"
                    : "border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-100"
                }`}
              >
                {isFeaturing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Star
                    className={`w-3.5 h-3.5 ${
                      story.is_featured ? "fill-amber-500 text-amber-500" : "text-neutral-500"
                    }`}
                  />
                )}
                <span>{story.is_featured ? "Featured on Home" : "Feature Story"}</span>
              </Button>
            )}
          </div>
          <Button
            variant="default"
            size="sm"
            onClick={onClose}
            className="bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-semibold px-4 cursor-pointer"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
