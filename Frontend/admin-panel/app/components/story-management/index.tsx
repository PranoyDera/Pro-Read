"use client";

import React, { useMemo, useState } from "react";
import { Search, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { StoryTable } from "./story-table";
import { StoryViewModal } from "./story-view-modal";
import {
  AdminStory,
  getPublishedStories,
  blockStory as apiBlockStory,
  deleteStory as apiDeleteStory,
} from "@/app/service/story-service";
import { toast } from "@/app/components/ui/toast";

export interface StoryItem {
  id: number;
  title: string;
  author: {
    name: string;
    email: string;
    avatar?: string;
  };
  genre: string;
  readTime: string;
  status: "published" | "draft";
  isBlocked: boolean;
  isFeatured?: boolean;
  likesCount: number;
  readsCount: number;
  commentsCount: number;
  reportsCount: number;
  createdAt: string;
}

const mapAdminStoryToStoryItem = (s: AdminStory): StoryItem => ({
  id: s.id,
  title: s.title,
  author: {
    name: s.author_name || "Unknown Author",
    email: s.author_email || "N/A",
    avatar: s.author_profile_pic || undefined,
  },
  genre: s.genre || "General",
  readTime: s.read_time || "1 min read",
  status: s.status || "published",
  isBlocked: Boolean(s.is_blocked),
  isFeatured: Boolean(s.is_featured),
  likesCount: Number(s.likes_count || 0),
  readsCount: Number(s.reads_count || 0),
  commentsCount: Number(s.comments_count || 0),
  reportsCount: Number(s.reports || 0),
  createdAt: s.created_at ? new Date(s.created_at).toISOString().split("T")[0] : "N/A",
});

export default function StoryManagementComponent() {
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedStories, setSelectedStories] = useState<number[]>([]);
  const [viewingStoryId, setViewingStoryId] = useState<number | null>(null);

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setCurrentPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch stories from Backend API using server-side pagination
  const fetchStories = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getPublishedStories({
        page: currentPage,
        limit: pageSize,
        search: debouncedSearch.trim() || undefined,
        genre: genreFilter !== "all" ? genreFilter : undefined,
      });

      const mapped = (res.stories || []).map(mapAdminStoryToStoryItem);
      setStories(mapped);

      if (res.pagination) {
        setTotalItems(res.pagination.total);
        setTotalPages(Math.max(1, res.pagination.totalPages));
      } else {
        setTotalItems(mapped.length);
        setTotalPages(Math.max(1, Math.ceil(mapped.length / pageSize)));
      }
    } catch (error: any) {
      toast.add({
        title: "Failed to load stories",
        description: error.message || "Could not retrieve published stories.",
        type: "error",
        timeout: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, debouncedSearch, genreFilter]);

  React.useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  // Available unique genres
  const genres = useMemo(() => {
    const list = [
      "Fantasy",
      "Cyberpunk",
      "Sci-Fi",
      "Mystery",
      "Thriller",
      "Romance",
      "Historical",
      "Horror",
      "Adventure",
      "Drama",
      "Fiction",
      "Non-Fiction"
    ];
    // Also include any other genres found in loaded stories
    stories.forEach((s) => {
      if (s.genre && !list.includes(s.genre)) {
        list.push(s.genre);
      }
    });
    return list;
  }, [stories]);

  // Status filtering (if client-side status filter applied)
  const displayedStories = useMemo(() => {
    if (statusFilter === "all") return stories;
    return stories.filter((story) => {
      if (statusFilter === "blocked") return story.isBlocked;
      if (statusFilter === "active") return !story.isBlocked && story.status === "published";
      if (statusFilter === "draft") return story.status === "draft";
      return true;
    });
  }, [stories, statusFilter]);

  // Selection handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedStories(displayedStories.map((s) => s.id));
    } else {
      setSelectedStories([]);
    }
  };

  const handleSelectRow = (id: number) => {
    setSelectedStories((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Actions
  const handleToggleBlock = async (id: number) => {
    const targetStory = stories.find((s) => s.id === id);
    if (!targetStory) return;

    const newBlockedState = !targetStory.isBlocked;

    try {
      await apiBlockStory(id, newBlockedState);
      setStories((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isBlocked: newBlockedState } : s))
      );
      toast.add({
        title: newBlockedState ? "Story Blocked" : "Story Unblocked",
        description: `Story "${targetStory.title}" was ${newBlockedState ? "blocked" : "unblocked"} successfully.`,
        type: "success",
        timeout: 3000,
      });
    } catch (error: any) {
      toast.add({
        title: "Action Failed",
        description: error.message || "Failed to update story block status.",
        type: "error",
        timeout: 4000,
      });
    }
  };

  const handleDelete = async (id: number) => {
    const targetStory = stories.find((s) => s.id === id);
    if (!confirm(`Are you sure you want to delete "${targetStory?.title || "this story"}"?`)) {
      return;
    }

    try {
      await apiDeleteStory(id);
      setStories((prev) => prev.filter((s) => s.id !== id));
      setSelectedStories((prev) => prev.filter((item) => item !== id));
      toast.add({
        title: "Story Deleted",
        description: "Story was removed successfully.",
        type: "success",
        timeout: 3000,
      });
    } catch (error: any) {
      toast.add({
        title: "Delete Failed",
        description: error.message || "Failed to delete story.",
        type: "error",
        timeout: 4000,
      });
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-3.5rem)] bg-white p-6 font-sans text-neutral-900">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-neutral-300">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-950">Story Management</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full border border-neutral-300 bg-neutral-100 text-neutral-900 font-mono font-semibold">
              {totalItems} total
            </span>
          </div>
          <p className="text-sm text-neutral-700 mt-1 font-normal">
            Monitor, moderate, and manage user-created published stories and drafts.
          </p>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchInput("");
              setDebouncedSearch("");
              setGenreFilter("all");
              setStatusFilter("all");
              setCurrentPage(1);
            }}
            disabled={isLoading}
            className="border-neutral-400 bg-white text-neutral-900 hover:bg-neutral-100 hover:text-neutral-950 shadow-xs cursor-pointer font-medium"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-neutral-700 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          {selectedStories.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (confirm(`Delete ${selectedStories.length} selected stories?`)) {
                  setStories((prev) => prev.filter((s) => !selectedStories.includes(s.id)));
                  setSelectedStories([]);
                }
              }}
              className="bg-red-600 text-white hover:bg-red-700 shadow-xs cursor-pointer font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Selected ({selectedStories.length})
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
            placeholder="Search by story title, author, email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9 bg-white border-neutral-350 text-neutral-950 placeholder:text-neutral-500 shadow-2xs focus-visible:ring-2 focus-visible:ring-neutral-400/25 focus-visible:border-neutral-400"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {/* Genre Filter */}
          <Select
            value={genreFilter}
            onValueChange={(val) => {
              if (val !== null) {
                setGenreFilter(val);
                setCurrentPage(1);
              }
            }}
          >
            <SelectTrigger className="h-9 min-w-[130px] rounded-[5px] border-neutral-350 bg-white px-3 text-xs text-neutral-900 font-medium shadow-2xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border border-neutral-300 shadow-md text-xs text-neutral-900">
              <SelectItem value="all">All Genres</SelectItem>
              {genres.map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={(val) => {
              if (val !== null) {
                setStatusFilter(val);
                setCurrentPage(1);
              }
            }}
          >
            <SelectTrigger className="h-9 min-w-[130px] rounded-[5px] border-neutral-350 bg-white px-3 text-xs text-neutral-900 font-medium shadow-2xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border border-neutral-300 shadow-md text-xs text-neutral-900">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active / Published</SelectItem>
              <SelectItem value="draft">Drafts</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reusable Story Table Component */}
      <StoryTable
        paginatedStories={displayedStories}
        selectedStories={selectedStories}
        totalItems={totalItems}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        isLoading={isLoading}
        handleSelectAll={handleSelectAll}
        handleSelectRow={handleSelectRow}
        handleToggleBlock={handleToggleBlock}
        handleDelete={handleDelete}
        onViewStory={(id) => setViewingStoryId(id)}
        setPageSize={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
        setCurrentPage={setCurrentPage}
      />

      {/* Story View & Reports Modal */}
      <StoryViewModal
        storyId={viewingStoryId}
        isOpen={viewingStoryId !== null}
        onClose={() => setViewingStoryId(null)}
        onStoryUpdated={fetchStories}
      />
    </div>
  );
}
