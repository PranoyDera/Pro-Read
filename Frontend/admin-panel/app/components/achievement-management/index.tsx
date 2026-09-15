"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  Trash2,
  Trophy,
  Award,
  Flame,
  Star,
  Zap,
  Users,
  Edit2,
  Plus,
  BookOpen,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { ReusableTable, ColumnDef } from "@/app/components/ui/reusable-table";
import AddAchievementModal from "./add-achivement-modal";
import {
  AchievementItem as ApiAchievementItem,
  getAchievements,
  deleteAchievement,
} from "@/app/service/achivement-service";
import { toast } from "@/app/components/ui/toast";
import { API_BASE_URL } from "@/app/consts/common";

export interface DisplayAchievementItem {
  id: number;
  title: string;
  description: string;
  rule: string;
  icon: string | null;
  category: "reading" | "writing" | "community" | "streak" | "special";
  tier: "bronze" | "silver" | "gold" | "platinum";
  xpPoints: number;
  createdAt: string;
}

// Helper to determine category, tier, and XP reward dynamically based on rule and title
const deriveAchievementMeta = (
  item: ApiAchievementItem
): {
  category: "reading" | "writing" | "community" | "streak" | "special";
  tier: "bronze" | "silver" | "gold" | "platinum";
  xpPoints: number;
} => {
  let category: "reading" | "writing" | "community" | "streak" | "special" = "reading";
  let tier: "bronze" | "silver" | "gold" | "platinum" = "bronze";
  let xpPoints = 100;

  try {
    const parsedRule =
      typeof item.rule === "string" ? JSON.parse(item.rule) : item.rule;

    if (parsedRule && typeof parsedRule === "object") {
      if (parsedRule.minBooksRead !== undefined) {
        category = "reading";
        const val = Number(parsedRule.minBooksRead);
        if (val >= 50) {
          tier = "gold";
          xpPoints = 500;
        } else if (val >= 20) {
          tier = "silver";
          xpPoints = 250;
        } else {
          tier = "bronze";
          xpPoints = 100;
        }
      } else if (parsedRule.minDayStreak !== undefined) {
        category = "streak";
        const val = Number(parsedRule.minDayStreak);
        if (val >= 30) {
          tier = "platinum";
          xpPoints = 750;
        } else if (val >= 14) {
          tier = "gold";
          xpPoints = 350;
        } else if (val >= 7) {
          tier = "silver";
          xpPoints = 150;
        } else {
          tier = "bronze";
          xpPoints = 50;
        }
      } else if (parsedRule.minHoursImmersed !== undefined) {
        category = "reading";
        const val = Number(parsedRule.minHoursImmersed);
        if (val >= 100) {
          tier = "platinum";
          xpPoints = 1000;
        } else if (val >= 25) {
          tier = "gold";
          xpPoints = 400;
        } else {
          tier = "silver";
          xpPoints = 200;
        }
      } else if (parsedRule.minReviews !== undefined) {
        category = "community";
        const val = Number(parsedRule.minReviews);
        if (val >= 50) {
          tier = "platinum";
          xpPoints = 800;
        } else if (val >= 20) {
          tier = "gold";
          xpPoints = 300;
        } else {
          tier = "silver";
          xpPoints = 120;
        }
      } else if (parsedRule.minGenres !== undefined) {
        category = "reading";
        const val = Number(parsedRule.minGenres);
        if (val >= 10) {
          tier = "gold";
          xpPoints = 500;
        } else {
          tier = "silver";
          xpPoints = 250;
        }
      }
    }
  } catch {
    // If not standard JSON rule, inspect title/description keywords
    const lower = (item.title + " " + item.description).toLowerCase();
    if (lower.includes("streak") || lower.includes("day")) {
      category = "streak";
      tier = "silver";
      xpPoints = 150;
    } else if (lower.includes("author") || lower.includes("write") || lower.includes("ink") || lower.includes("story")) {
      category = "writing";
      tier = "bronze";
      xpPoints = 100;
    } else if (lower.includes("comment") || lower.includes("community") || lower.includes("review")) {
      category = "community";
      tier = "silver";
      xpPoints = 120;
    } else if (lower.includes("master") || lower.includes("century") || lower.includes("supreme")) {
      category = "special";
      tier = "platinum";
      xpPoints = 1000;
    }
  }

  return { category, tier, xpPoints };
};

const mapApiAchievementToDisplay = (
  item: ApiAchievementItem
): DisplayAchievementItem => {
  const meta = deriveAchievementMeta(item);
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    rule: item.rule,
    icon: item.icon,
    category: meta.category,
    tier: meta.tier,
    xpPoints: meta.xpPoints,
    createdAt: item.created_at
      ? new Date(item.created_at).toLocaleDateString("en-CA")
      : "N/A",
  };
};

export default function AchievementManagement() {
  const [achievements, setAchievements] = useState<DisplayAchievementItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedAchievements, setSelectedAchievements] = useState<number[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // Debounce search query changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch achievements from API
  const fetchAchievements = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getAchievements({
        page: currentPage,
        limit: pageSize,
        search: searchQuery.trim() || undefined,
      });

      const mapped = (res.achievements || []).map(mapApiAchievementToDisplay);
      setAchievements(mapped);

      if (res.pagination) {
        setTotalItems(res.pagination.total);
        setTotalPages(Math.max(1, res.pagination.totalPages));
      } else {
        setTotalItems(mapped.length);
        setTotalPages(Math.max(1, Math.ceil(mapped.length / pageSize)));
      }
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to retrieve achievements.";
      toast.add({
        title: "Error fetching achievements",
        description: errorMsg,
        type: "error",
        timeout: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, searchQuery]);

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  // Selection handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedAchievements(achievements.map((item) => item.id));
    } else {
      setSelectedAchievements([]);
    }
  };

  const handleSelectRow = (id: number) => {
    setSelectedAchievements((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Delete single achievement
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this achievement?")) return;

    try {
      await deleteAchievement(id);
      toast.add({
        title: "Achievement deleted",
        description: "The achievement was deleted successfully.",
        type: "success",
        timeout: 3000,
      });
      setSelectedAchievements((prev) => prev.filter((item) => item !== id));
      fetchAchievements();
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to delete achievement";
      toast.add({
        title: "Delete failed",
        description: errorMsg,
        type: "error",
        timeout: 4000,
      });
    }
  };

  // Bulk delete achievements
  const handleBulkDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete ${selectedAchievements.length} selected achievements?`
      )
    ) {
      return;
    }

    setIsDeleting(true);
    let successCount = 0;
    let failCount = 0;

    for (const id of selectedAchievements) {
      try {
        await deleteAchievement(id);
        successCount++;
      } catch {
        failCount++;
      }
    }

    setIsDeleting(false);
    setSelectedAchievements([]);

    if (successCount > 0) {
      toast.add({
        title: "Deletion complete",
        description: `Successfully deleted ${successCount} achievement(s).${
          failCount > 0 ? ` ${failCount} failed.` : ""
        }`,
        type: failCount > 0 ? "warning" : "success",
        timeout: 4000,
      });
    } else if (failCount > 0) {
      toast.add({
        title: "Bulk delete failed",
        description: `Failed to delete selected achievements.`,
        type: "error",
        timeout: 4000,
      });
    }

    fetchAchievements();
  };

  // Table column definitions
  const columns = useMemo<ColumnDef<DisplayAchievementItem>[]>(
    () => [
      {
        id: "badge",
        header: "Achievement",
        headerClassName: "text-neutral-800 font-semibold",
        cellClassName: "max-w-xs",
        cell: (item) => {
          const iconUrl = item.icon
            ? item.icon.startsWith("http")
              ? item.icon
              : `${API_BASE_URL}${item.icon}`
            : null;

          return (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-neutral-100 border border-neutral-300 text-neutral-900 flex items-center justify-center shrink-0 shadow-2xs overflow-hidden">
                {iconUrl ? (
                  <img
                    src={iconUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : item.category === "reading" ? (
                  <BookOpen className="w-4 h-4 text-blue-600" />
                ) : item.category === "writing" ? (
                  <Edit2 className="w-4 h-4 text-emerald-600" />
                ) : item.category === "streak" ? (
                  <Flame className="w-4 h-4 text-orange-600" />
                ) : item.category === "community" ? (
                  <Users className="w-4 h-4 text-purple-600" />
                ) : (
                  <Star className="w-4 h-4 text-amber-600" />
                )}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-neutral-950 truncate">
                  {item.title}
                </div>
                <div className="text-xs text-neutral-600 truncate mt-0.5">
                  {item.description}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        id: "tier",
        header: "Tier",
        headerClassName: "text-neutral-800 font-semibold",
        cell: (item) => {
          if (item.tier === "platinum") {
            return (
              <span className="inline-flex items-center gap-1 rounded-[5px] border border-cyan-300 bg-cyan-50 px-2 py-0.5 text-xs font-semibold text-cyan-900">
                <Trophy className="w-3 h-3 text-cyan-700" />
                Platinum
              </span>
            );
          }
          if (item.tier === "gold") {
            return (
              <span className="inline-flex items-center gap-1 rounded-[5px] border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-900">
                <Award className="w-3 h-3 text-amber-700" />
                Gold
              </span>
            );
          }
          if (item.tier === "silver") {
            return (
              <span className="inline-flex items-center gap-1 rounded-[5px] border border-neutral-300 bg-neutral-100 px-2 py-0.5 text-xs font-semibold text-neutral-800">
                <Award className="w-3 h-3 text-neutral-600" />
                Silver
              </span>
            );
          }
          return (
            <span className="inline-flex items-center gap-1 rounded-[5px] border border-orange-300 bg-orange-50 px-2 py-0.5 text-xs font-semibold text-orange-900">
              <Award className="w-3 h-3 text-orange-700" />
              Bronze
            </span>
          );
        },
      },
      {
        id: "rule",
        header: "Condition / Rule",
        headerClassName: "text-neutral-800 font-semibold",
        cell: (item) => (
          <code className="inline-block max-w-[220px] truncate rounded bg-neutral-100 border border-neutral-250 px-2 py-0.5 text-[11px] font-mono text-neutral-800">
            {item.rule}
          </code>
        ),
      },
      {
        id: "xpPoints",
        header: "XP Reward",
        headerClassName: "text-neutral-800 font-semibold",
        cell: (item) => (
          <span className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-neutral-950">
            <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
            +{item.xpPoints} XP
          </span>
        ),
      },
      {
        id: "createdAt",
        header: "Created",
        headerClassName: "text-neutral-800 font-semibold",
        cellClassName: "text-xs text-neutral-700 font-mono font-medium",
        cell: (item) => item.createdAt,
      },
      {
        id: "actions",
        header: "Actions",
        headerClassName: "text-right text-neutral-800 font-semibold",
        cellClassName: "text-right",
        cell: (item) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => handleDelete(item.id)}
              className="text-neutral-600 hover:text-red-600 hover:bg-red-50 cursor-pointer"
              title="Delete Achievement"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="w-full min-h-[calc(100vh-3.5rem)] bg-white p-6 font-sans text-neutral-900">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-neutral-300">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-950">
              Achievement Management
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full border border-neutral-300 bg-neutral-100 text-neutral-900 font-mono font-semibold">
              {totalItems} total
            </span>
          </div>
          <p className="text-sm text-neutral-700 mt-1 font-normal">
            Configure reading milestones, XP rewards, badges, and gamification rules.
          </p>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchAchievements()}
            disabled={isLoading}
            className="border-neutral-300 text-neutral-700 hover:bg-neutral-100 font-medium rounded-[5px]! py-4 cursor-pointer"
            title="Refresh achievements"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="bg-neutral-950 text-white hover:bg-neutral-800 shadow-xs cursor-pointer font-medium rounded-[5px]! py-4"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Achievement
          </Button>

          {selectedAchievements.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              disabled={isDeleting}
              className="bg-red-600 text-white hover:bg-red-700 shadow-xs cursor-pointer font-medium rounded-[5px]! py-4"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Selected ({selectedAchievements.length})
            </Button>
          )}
        </div>
      </div>

      {/* Filter and search toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-4">
        {/* Search Input */}
        <div className="w-full sm:w-80 relative">
          <Search className="w-4 h-4 text-neutral-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            placeholder="Search by title, description..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9 bg-white border-neutral-350 text-neutral-950 placeholder:text-neutral-500 shadow-2xs focus-visible:ring-neutral-900 focus-visible:border-neutral-800"
          />
        </div>
      </div>

      {/* Reusable Table */}
      <ReusableTable<DisplayAchievementItem>
        columns={columns}
        data={achievements}
        rowKey={(item) => item.id}
        isLoading={isLoading}
        selectedRowKeys={selectedAchievements}
        onSelectRow={(id) => handleSelectRow(Number(id))}
        onSelectAll={handleSelectAll}
        isAllSelected={
          achievements.length > 0 &&
          achievements.every((item) => selectedAchievements.includes(item.id))
        }
        emptyMessage="No achievements found"
        emptySubMessage={
          searchQuery
            ? "Try changing your search term."
            : "Click 'Add Achievement' to create your first milestone badge."
        }
        pagination={{
          currentPage,
          totalPages,
          pageSize,
          totalItems,
          pageSizeOptions: [5, 10, 20, 50],
          onPageChange: (page) => setCurrentPage(page),
          onPageSizeChange: (size) => {
            setPageSize(size);
            setCurrentPage(1);
          },
        }}
      />

      {/* Add Achievement Modal */}
      <AddAchievementModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSuccess={(_newAchievement: ApiAchievementItem) => {
          toast.add({
            title: "Achievement created",
            description: `Achievement was created successfully.`,
            type: "success",
            timeout: 3000,
          });
          setCurrentPage(1);
          fetchAchievements();
        }}
      />
    </div>
  );
}

