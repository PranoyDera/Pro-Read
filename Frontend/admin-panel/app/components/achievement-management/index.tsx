"use client";

import React, { useMemo, useState } from "react";
import {
  Search,
  Trash2,
  Trophy,
  Award,
  Flame,
  Star,
  Zap,
  Target,
  Users,
  Edit2,
  CheckCircle2,
  Plus,
  BookOpen,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { ReusableTable, ColumnDef } from "@/app/components/ui/reusable-table";
import AddAchievementModal from "./add-achivement-modal";
import { AchievementItem as ApiAchievementItem } from "@/app/service/achivement-service";

export interface AchievementItem {
  id: number;
  title: string;
  description: string;
  category: "reading" | "writing" | "community" | "streak" | "special";
  tier: "bronze" | "silver" | "gold" | "platinum";
  xpPoints: number;
  unlockedCount: number;
  status: "active" | "draft" | "archived";
  createdAt: string;
}

const INITIAL_ACHIEVEMENTS: AchievementItem[] = [
  {
    id: 1,
    title: "Page Turner I",
    description: "Read your first 5 complete stories",
    category: "reading",
    tier: "bronze",
    xpPoints: 50,
    unlockedCount: 3840,
    status: "active",
    createdAt: "2025-10-10",
  },
  {
    id: 2,
    title: "Bookworm Supreme",
    description: "Read 50 stories across 3 different genres",
    category: "reading",
    tier: "gold",
    xpPoints: 300,
    unlockedCount: 890,
    status: "active",
    createdAt: "2025-10-15",
  },
  {
    id: 3,
    title: "First Ink",
    description: "Publish your very first original story",
    category: "writing",
    tier: "bronze",
    xpPoints: 100,
    unlockedCount: 1420,
    status: "active",
    createdAt: "2025-10-20",
  },
  {
    id: 4,
    title: "Master Storyteller",
    description: "Receive over 1,000 likes on a single published story",
    category: "writing",
    tier: "platinum",
    xpPoints: 1000,
    unlockedCount: 65,
    status: "active",
    createdAt: "2025-11-01",
  },
  {
    id: 5,
    title: "7-Day Reading Streak",
    description: "Read at least 1 chapter every day for 7 days in a row",
    category: "streak",
    tier: "silver",
    xpPoints: 150,
    unlockedCount: 2310,
    status: "active",
    createdAt: "2025-11-05",
  },
  {
    id: 6,
    title: "Engaged Critic",
    description: "Leave 25 thoughtful comments on stories",
    category: "community",
    tier: "silver",
    xpPoints: 120,
    unlockedCount: 1150,
    status: "active",
    createdAt: "2025-11-12",
  },
  {
    id: 7,
    title: "Night Owl Reader",
    description: "Complete reading a story between 12:00 AM and 4:00 AM",
    category: "special",
    tier: "bronze",
    xpPoints: 75,
    unlockedCount: 1980,
    status: "active",
    createdAt: "2025-12-01",
  },
  {
    id: 8,
    title: "Century Club",
    description: "Publish 100 chapters across any number of stories",
    category: "writing",
    tier: "platinum",
    xpPoints: 1500,
    unlockedCount: 18,
    status: "draft",
    createdAt: "2026-01-10",
  },
  {
    id: 9,
    title: "Anniversary Pioneer",
    description: "Participate in the Pro-Read Year One Festival",
    category: "special",
    tier: "gold",
    xpPoints: 500,
    unlockedCount: 420,
    status: "archived",
    createdAt: "2025-09-01",
  },
];

export default function AchievementManagement() {
  const [achievements, setAchievements] = useState<AchievementItem[]>(INITIAL_ACHIEVEMENTS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedAchievements, setSelectedAchievements] = useState<number[]>([]);

  // Filtering
  const filteredAchievements = useMemo(() => {
    return achievements.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;

      const matchesTier = tierFilter === "all" || item.tier === tierFilter;

      return matchesSearch && matchesCategory && matchesTier;
    });
  }, [achievements, searchQuery, categoryFilter, tierFilter]);

  // Pagination calculation
  const totalItems = filteredAchievements.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedAchievements = filteredAchievements.slice(startIndex, startIndex + pageSize);

  // Selection handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedAchievements(paginatedAchievements.map((item) => item.id));
    } else {
      setSelectedAchievements([]);
    }
  };

  const handleSelectRow = (id: number) => {
    setSelectedAchievements((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Actions
  const handleToggleStatus = (id: number) => {
    setAchievements((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: item.status === "active" ? "archived" : "active",
          };
        }
        return item;
      })
    );
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this achievement?")) {
      setAchievements((prev) => prev.filter((item) => item.id !== id));
      setSelectedAchievements((prev) => prev.filter((item) => item !== id));
    }
  };

  // Table column definitions
  const columns = useMemo<ColumnDef<AchievementItem>[]>(
    () => [
      {
        id: "badge",
        header: "Achievement",
        headerClassName: "text-neutral-800 font-semibold",
        cellClassName: "max-w-xs",
        cell: (item) => (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 border border-neutral-300 text-neutral-900 flex items-center justify-center shrink-0 shadow-2xs">
              {item.category === "reading" && <BookOpen className="w-4 h-4 text-blue-600" />}
              {item.category === "writing" && <Edit2 className="w-4 h-4 text-emerald-600" />}
              {item.category === "streak" && <Flame className="w-4 h-4 text-orange-600" />}
              {item.category === "community" && <Users className="w-4 h-4 text-purple-600" />}
              {item.category === "special" && <Star className="w-4 h-4 text-amber-600" />}
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-neutral-950 truncate">{item.title}</div>
              <div className="text-xs text-neutral-600 truncate mt-0.5">{item.description}</div>
            </div>
          </div>
        ),
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
        id: "category",
        header: "Category",
        headerClassName: "text-neutral-800 font-semibold",
        cell: (item) => (
          <span className="inline-block rounded-[5px] border border-neutral-300 bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-800 uppercase tracking-wide">
            {item.category}
          </span>
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
        id: "unlockedCount",
        header: "Unlocked",
        headerClassName: "text-neutral-800 font-semibold",
        cell: (item) => (
          <span className="font-mono text-xs text-neutral-700 font-medium">
            {item.unlockedCount.toLocaleString()} users
          </span>
        ),
      },
      {
        id: "status",
        header: "Status",
        headerClassName: "text-neutral-800 font-semibold",
        cell: (item) => {
          if (item.status === "active") {
            return (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                Active
              </span>
            );
          }
          if (item.status === "draft") {
            return (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-neutral-700">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-500" />
                Draft
              </span>
            );
          }
          return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-400 bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-neutral-800">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
              Archived
            </span>
          );
        },
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
              onClick={() => handleToggleStatus(item.id)}
              className="text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100"
              title={item.status === "active" ? "Archive Achievement" : "Activate Achievement"}
            >
              {item.status === "active" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <Target className="w-4 h-4 text-neutral-600" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => handleDelete(item.id)}
              className="text-neutral-600 hover:text-red-600 hover:bg-red-50"
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
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="bg-neutral-950 text-white hover:bg-neutral-800 shadow-xs cursor-pointer font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Achievement
          </Button>

          {selectedAchievements.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (confirm(`Delete ${selectedAchievements.length} selected achievements?`)) {
                  setAchievements((prev) =>
                    prev.filter((item) => !selectedAchievements.includes(item.id))
                  );
                  setSelectedAchievements([]);
                }
              }}
              className="bg-red-600 text-white hover:bg-red-700 shadow-xs cursor-pointer font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Selected ({selectedAchievements.length})
            </Button>
          )}
        </div>
      </div>

      {/* Filter and search toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-4">
        {/* Search */}
        <div className="w-full sm:w-80 relative">
          <Search className="w-4 h-4 text-neutral-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            placeholder="Search by title, description..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 bg-white border-neutral-350 text-neutral-950 placeholder:text-neutral-500 shadow-2xs focus-visible:ring-neutral-900 focus-visible:border-neutral-800"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {/* Category Filter */}
          <Select
            value={categoryFilter}
            onValueChange={(val) => {
              if (val !== null) {
                setCategoryFilter(val);
                setCurrentPage(1);
              }
            }}
          >
            <SelectTrigger className="h-9 min-w-[130px] rounded-[5px] border-neutral-350 bg-white px-3 text-xs text-neutral-900 font-medium shadow-2xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border border-neutral-300 shadow-md text-xs text-neutral-900">
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="reading">Reading</SelectItem>
              <SelectItem value="writing">Writing</SelectItem>
              <SelectItem value="streak">Streak</SelectItem>
              <SelectItem value="community">Community</SelectItem>
              <SelectItem value="special">Special</SelectItem>
            </SelectContent>
          </Select>

          {/* Tier Filter */}
          <Select
            value={tierFilter}
            onValueChange={(val) => {
              if (val !== null) {
                setTierFilter(val);
                setCurrentPage(1);
              }
            }}
          >
            <SelectTrigger className="h-9 min-w-[130px] rounded-[5px] border-neutral-350 bg-white px-3 text-xs text-neutral-900 font-medium shadow-2xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border border-neutral-300 shadow-md text-xs text-neutral-900">
              <SelectItem value="all">All Tiers</SelectItem>
              <SelectItem value="bronze">Bronze</SelectItem>
              <SelectItem value="silver">Silver</SelectItem>
              <SelectItem value="gold">Gold</SelectItem>
              <SelectItem value="platinum">Platinum</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reusable Table */}
      <ReusableTable<AchievementItem>
        columns={columns}
        data={paginatedAchievements}
        rowKey={(item) => item.id}
        selectedRowKeys={selectedAchievements}
        onSelectRow={(id) => handleSelectRow(Number(id))}
        onSelectAll={handleSelectAll}
        isAllSelected={
          paginatedAchievements.length > 0 &&
          paginatedAchievements.every((item) => selectedAchievements.includes(item.id))
        }
        emptyMessage="No achievements found"
        emptySubMessage="Try clearing search filters or check back later."
        pagination={{
          currentPage,
          totalPages,
          pageSize,
          totalItems,
          pageSizeOptions: [5, 10, 20],
          onPageChange: (page) => setCurrentPage(page),
          onPageSizeChange: (size) => setPageSize(size),
        }}
      />

      <AddAchievementModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSuccess={(newAchievement: ApiAchievementItem) => {
          setAchievements((prev) => [
            {
              id: newAchievement.id,
              title: newAchievement.title,
              description: newAchievement.description,
              category: "reading",
              tier: "bronze",
              xpPoints: 100,
              unlockedCount: 0,
              status: "active",
              createdAt: newAchievement.created_at
                ? new Date(newAchievement.created_at).toLocaleDateString("en-CA")
                : new Date().toLocaleDateString("en-CA"),
            },
            ...prev,
          ]);
        }}
      />
    </div>
  );
}
