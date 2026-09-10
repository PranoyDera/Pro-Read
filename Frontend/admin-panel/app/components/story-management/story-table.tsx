"use client";

import React, { useMemo } from "react";
import {
  Eye,
  Trash2,
  Ban,
  CheckCircle2,
  BookOpen,
  Clock,
  Heart,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { ReusableTable, ColumnDef } from "@/app/components/ui/reusable-table";
import { StoryItem } from "./index";

export interface StoryTableProps {
  paginatedStories: StoryItem[];
  selectedStories: number[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  isLoading?: boolean;
  handleSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectRow: (id: number) => void;
  handleToggleBlock: (id: number) => void;
  handleDelete: (id: number) => void;
  setPageSize: (size: number) => void;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export function StoryTable({
  paginatedStories,
  selectedStories,
  totalItems,
  currentPage,
  totalPages,
  pageSize,
  isLoading = false,
  handleSelectAll,
  handleSelectRow,
  handleToggleBlock,
  handleDelete,
  setPageSize,
  setCurrentPage,
}: StoryTableProps) {
  const columns = useMemo<ColumnDef<StoryItem>[]>(
    () => [
      {
        id: "title",
        header: "Story",
        headerClassName: "text-neutral-800 font-semibold",
        cellClassName: "max-w-xs",
        cell: (story) => (
          <div>
            <div className="font-semibold text-neutral-950 truncate">
              {story.title}
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-600 mt-0.5">
              <Clock className="w-3 h-3 text-neutral-500" />
              <span>{story.readTime}</span>
              <span>•</span>
              <span className="font-mono text-neutral-500">#{story.id}</span>
            </div>
          </div>
        ),
      },
      {
        id: "author",
        header: "Author",
        headerClassName: "text-neutral-800 font-semibold",
        cell: (story) => (
          <div>
            <div className="text-sm font-semibold text-neutral-900">
              {story.author.name}
            </div>
            <div className="text-xs text-neutral-600 truncate max-w-[180px]">
              {story.author.email}
            </div>
          </div>
        ),
      },
      {
        id: "genre",
        header: "Genre",
        headerClassName: "text-neutral-800 font-semibold",
        cell: (story) => (
          <span className="inline-block rounded border border-neutral-300 bg-neutral-100 px-2.5 py-1 text-xs text-neutral-800 font-medium">
            {story.genre}
          </span>
        ),
      },
      {
        id: "metrics",
        header: "Metrics",
        headerClassName: "text-neutral-800 font-semibold",
        cell: (story) => (
          <div className="flex items-center gap-3 text-xs text-neutral-700 font-mono font-medium">
            <span className="flex items-center gap-1" title="Reads">
              <Eye className="w-3.5 h-3.5 text-neutral-500" />
              {story.readsCount}
            </span>
            <span className="flex items-center gap-1" title="Likes">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              {story.likesCount}
            </span>
            <span className="flex items-center gap-1" title="Comments">
              <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
              {story.commentsCount}
            </span>
          </div>
        ),
      },
      {
        id: "status",
        header: "Status",
        headerClassName: "text-neutral-800 font-semibold",
        cell: (story) => {
          if (story.isBlocked) {
            return (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-400 bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-neutral-800">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                Blocked
              </span>
            );
          }
          if (story.status === "published") {
            return (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                Published
              </span>
            );
          }
          return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-neutral-700">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-500" />
              Draft
            </span>
          );
        },
      },
      {
        id: "createdAt",
        header: "Created",
        headerClassName: "text-neutral-800 font-semibold",
        cellClassName: "text-xs text-neutral-700 font-mono font-medium",
        cell: (story) => story.createdAt,
      },
      {
        id: "actions",
        header: "Actions",
        headerClassName: "text-right text-neutral-800 font-semibold",
        cellClassName: "text-right",
        cell: (story) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => handleToggleBlock(story.id)}
              className="text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100"
              title={story.isBlocked ? "Unblock Story" : "Block Story"}
            >
              {story.isBlocked ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <Ban className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => handleDelete(story.id)}
              className="text-neutral-600 hover:text-red-600 hover:bg-red-50"
              title="Delete Story"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ),
      },
    ],
    [handleToggleBlock, handleDelete]
  );

  return (
    <ReusableTable<StoryItem>
      columns={columns}
      data={paginatedStories}
      rowKey={(story) => story.id}
      selectedRowKeys={selectedStories}
      onSelectRow={(id) => handleSelectRow(Number(id))}
      onSelectAll={handleSelectAll}
      isAllSelected={
        paginatedStories.length > 0 &&
        paginatedStories.every((s) => selectedStories.includes(s.id))
      }
      isLoading={isLoading}
      emptyMessage="No stories found"
      emptySubMessage="Try clearing search filters or check back later."
      emptyIcon={<BookOpen className="w-8 h-8 text-neutral-400" />}
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
  );
}
