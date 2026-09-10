"use client";

import React, { useMemo, useState } from "react";
import {
  Search,
  Trash2,
  RefreshCw,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Ban,
  Clock,
  MessageSquare,
  BookOpen,
  User,
  Flag,
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

export interface ModerationReport {
  id: number;
  contentType: "story" | "comment" | "user_profile";
  contentTitle: string;
  targetId: string | number;
  reportedBy: {
    name: string;
    email: string;
  };
  reason: "hate_speech" | "plagiarism" | "nsfw" | "spam" | "harassment";
  details: string;
  severity: "high" | "medium" | "low";
  status: "pending" | "resolved" | "dismissed";
  reportedAt: string;
}

const INITIAL_REPORTS: ModerationReport[] = [
  {
    id: 201,
    contentType: "story",
    contentTitle: "Neon Horizon: Syndicate Protocols (Chapter 4)",
    targetId: 102,
    reportedBy: { name: "Marcus Shaw", email: "m.shaw@proread.com" },
    reason: "plagiarism",
    details: "Multiple paragraphs match word-for-word with an external copyrighted publication.",
    severity: "high",
    status: "pending",
    reportedAt: "2026-03-05 14:22",
  },
  {
    id: 202,
    contentType: "comment",
    contentTitle: "Comment on 'The Whispering Shadows of Elysium'",
    targetId: 5041,
    reportedBy: { name: "Aria Sterling", email: "aria@proread.com" },
    reason: "harassment",
    details: "Hostile user targeting the author with repeated personal attacks and derogatory insults.",
    severity: "high",
    status: "pending",
    reportedAt: "2026-03-05 11:05",
  },
  {
    id: 203,
    contentType: "story",
    contentTitle: "The Clockmaker's Secret Cipher",
    targetId: 105,
    reportedBy: { name: "Clara Benson", email: "clara.b@proread.com" },
    reason: "nsfw",
    details: "Unmarked graphic explicit content not adhering to age-restriction policies.",
    severity: "medium",
    status: "pending",
    reportedAt: "2026-03-04 18:40",
  },
  {
    id: 204,
    contentType: "user_profile",
    contentTitle: "User profile: crypto_bot_99",
    targetId: 882,
    reportedBy: { name: "Julian Barnes", email: "julian@proread.com" },
    reason: "spam",
    details: "Automated profile mass-promoting suspicious third-party links across bios and chapter reviews.",
    severity: "low",
    status: "pending",
    reportedAt: "2026-03-03 09:15",
  },
  {
    id: 205,
    contentType: "comment",
    contentTitle: "Comment on 'Quantum Drift: Beyond Event Horizon'",
    targetId: 5099,
    reportedBy: { name: "Elena Rostova", email: "elena@proread.com" },
    reason: "hate_speech",
    details: "Inappropriate discriminatory language posted in the public discussion forum.",
    severity: "high",
    status: "resolved",
    reportedAt: "2026-03-02 20:30",
  },
  {
    id: 206,
    contentType: "story",
    contentTitle: "Forbidden Shadows of Valoria",
    targetId: 114,
    reportedBy: { name: "Kaelen Thorne", email: "kaelen@proread.com" },
    reason: "spam",
    details: "Duplicated chapter submissions stuffed with advertising tags.",
    severity: "low",
    status: "dismissed",
    reportedAt: "2026-03-01 16:10",
  },
  {
    id: 207,
    contentType: "comment",
    contentTitle: "Comment on 'Echoes of the Ancient Library'",
    targetId: 5120,
    reportedBy: { name: "Julian Barnes", email: "julian@proread.com" },
    reason: "spam",
    details: "Repeated copy-pasted link spam across reader comment threads.",
    severity: "low",
    status: "resolved",
    reportedAt: "2026-02-28 13:45",
  },
];

export default function ContentModerationComponent() {
  const [reports, setReports] = useState<ModerationReport[]>(INITIAL_REPORTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [reasonFilter, setReasonFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedReports, setSelectedReports] = useState<number[]>([]);

  // Filtering
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesSearch =
        report.contentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.reportedBy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.reportedBy.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesReason = reasonFilter === "all" || report.reason === reasonFilter;
      const matchesSeverity = severityFilter === "all" || report.severity === severityFilter;
      const matchesStatus = statusFilter === "all" || report.status === statusFilter;

      return matchesSearch && matchesReason && matchesSeverity && matchesStatus;
    });
  }, [reports, searchQuery, reasonFilter, severityFilter, statusFilter]);

  // Pagination calculation
  const totalItems = filteredReports.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedReports = filteredReports.slice(startIndex, startIndex + pageSize);

  // Selection handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedReports(paginatedReports.map((r) => r.id));
    } else {
      setSelectedReports([]);
    }
  };

  const handleSelectRow = (id: number) => {
    setSelectedReports((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Actions
  const handleResolve = (id: number) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "resolved" } : r))
    );
  };

  const handleDismiss = (id: number) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "dismissed" } : r))
    );
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to remove this report?")) {
      setReports((prev) => prev.filter((r) => r.id !== id));
      setSelectedReports((prev) => prev.filter((item) => item !== id));
    }
  };

  // Table column definitions
  const columns = useMemo<ColumnDef<ModerationReport>[]>(
    () => [
      {
        id: "content",
        header: "Reported Item",
        headerClassName: "text-neutral-800 font-semibold",
        cellClassName: "max-w-xs",
        cell: (report) => (
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 p-1.5 rounded-[5px] bg-neutral-100 border border-neutral-300 text-neutral-800 shrink-0">
              {report.contentType === "story" && <BookOpen className="w-3.5 h-3.5" />}
              {report.contentType === "comment" && <MessageSquare className="w-3.5 h-3.5" />}
              {report.contentType === "user_profile" && <User className="w-3.5 h-3.5" />}
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-neutral-950 truncate" title={report.contentTitle}>
                {report.contentTitle}
              </div>
              <div className="text-xs text-neutral-600 truncate mt-0.5" title={report.details}>
                {report.details}
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "reason",
        header: "Violation Reason",
        headerClassName: "text-neutral-800 font-semibold",
        cell: (report) => {
          const labels: Record<string, string> = {
            hate_speech: "Hate Speech",
            plagiarism: "Plagiarism",
            nsfw: "NSFW Content",
            spam: "Spam",
            harassment: "Harassment",
          };
          return (
            <span className="inline-flex items-center gap-1 rounded-[5px] border border-neutral-300 bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-800">
              <Flag className="w-3 h-3 text-neutral-600" />
              {labels[report.reason] || report.reason}
            </span>
          );
        },
      },
      {
        id: "severity",
        header: "Severity",
        headerClassName: "text-neutral-800 font-semibold",
        cell: (report) => {
          if (report.severity === "high") {
            return (
              <span className="inline-flex items-center gap-1 rounded-[5px] border border-red-300 bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-800">
                <AlertTriangle className="w-3 h-3 text-red-600" />
                High
              </span>
            );
          }
          if (report.severity === "medium") {
            return (
              <span className="inline-flex items-center gap-1 rounded-[5px] border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800">
                <AlertTriangle className="w-3 h-3 text-amber-600" />
                Medium
              </span>
            );
          }
          return (
            <span className="inline-flex items-center gap-1 rounded-[5px] border border-neutral-300 bg-neutral-100 px-2 py-0.5 text-xs font-semibold text-neutral-700">
              Low
            </span>
          );
        },
      },
      {
        id: "reportedBy",
        header: "Reported By",
        headerClassName: "text-neutral-800 font-semibold",
        cell: (report) => (
          <div>
            <div className="text-xs font-semibold text-neutral-900">{report.reportedBy.name}</div>
            <div className="text-[11px] text-neutral-600 truncate max-w-[150px]">
              {report.reportedBy.email}
            </div>
          </div>
        ),
      },
      {
        id: "status",
        header: "Status",
        headerClassName: "text-neutral-800 font-semibold",
        cell: (report) => {
          if (report.status === "pending") {
            return (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                Pending
              </span>
            );
          }
          if (report.status === "resolved") {
            return (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                Resolved
              </span>
            );
          }
          return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-neutral-700">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-500" />
              Dismissed
            </span>
          );
        },
      },
      {
        id: "reportedAt",
        header: "Date",
        headerClassName: "text-neutral-800 font-semibold",
        cellClassName: "text-xs text-neutral-700 font-mono font-medium",
        cell: (report) => report.reportedAt,
      },
      {
        id: "actions",
        header: "Actions",
        headerClassName: "text-right text-neutral-800 font-semibold",
        cellClassName: "text-right",
        cell: (report) => (
          <div className="flex items-center justify-end gap-1">
            {/* Take Action / Mark Resolved */}
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => handleResolve(report.id)}
              className="text-neutral-600 hover:text-emerald-700 hover:bg-emerald-50"
              title="Resolve & Take Action"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </Button>

            {/* Dismiss report */}
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => handleDismiss(report.id)}
              className="text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100"
              title="Dismiss Report"
            >
              <Ban className="w-4 h-4 text-neutral-600" />
            </Button>

            {/* Delete Record */}
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => handleDelete(report.id)}
              className="text-neutral-600 hover:text-red-600 hover:bg-red-50"
              title="Delete Record"
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
              Content Moderation
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full border border-neutral-300 bg-neutral-100 text-neutral-900 font-mono font-semibold">
              {totalItems} total
            </span>
          </div>
          <p className="text-sm text-neutral-700 mt-1 font-normal">
            Review user reports, moderate flagged stories or comments, and enforce community standards.
          </p>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setReasonFilter("all");
              setSeverityFilter("all");
              setStatusFilter("all");
            }}
            className="border-neutral-400 bg-white text-neutral-900 hover:bg-neutral-100 hover:text-neutral-950 shadow-xs cursor-pointer font-medium"
          >
            <RefreshCw className="w-3.5 h-3.5 text-neutral-700" />
            Reset
          </Button>

          {selectedReports.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (confirm(`Delete ${selectedReports.length} selected moderation records?`)) {
                  setReports((prev) => prev.filter((r) => !selectedReports.includes(r.id)));
                  setSelectedReports([]);
                }
              }}
              className="bg-red-600 text-white hover:bg-red-700 shadow-xs cursor-pointer font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Selected ({selectedReports.length})
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
            placeholder="Search reports, titles, reasons..."
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
          {/* Reason Filter */}
          <Select
            value={reasonFilter}
            onValueChange={(val) => {
              if (val !== null) {
                setReasonFilter(val);
                setCurrentPage(1);
              }
            }}
          >
            <SelectTrigger className="h-9 min-w-[130px] rounded-[5px] border-neutral-350 bg-white px-3 text-xs text-neutral-900 font-medium shadow-2xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border border-neutral-300 shadow-md text-xs text-neutral-900">
              <SelectItem value="all">All Reasons</SelectItem>
              <SelectItem value="plagiarism">Plagiarism</SelectItem>
              <SelectItem value="harassment">Harassment</SelectItem>
              <SelectItem value="hate_speech">Hate Speech</SelectItem>
              <SelectItem value="nsfw">NSFW Content</SelectItem>
              <SelectItem value="spam">Spam</SelectItem>
            </SelectContent>
          </Select>

          {/* Severity Filter */}
          <Select
            value={severityFilter}
            onValueChange={(val) => {
              if (val !== null) {
                setSeverityFilter(val);
                setCurrentPage(1);
              }
            }}
          >
            <SelectTrigger className="h-9 min-w-[130px] rounded-[5px] border-neutral-350 bg-white px-3 text-xs text-neutral-900 font-medium shadow-2xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border border-neutral-300 shadow-md text-xs text-neutral-900">
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
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
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="dismissed">Dismissed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reusable Table Component */}
      <ReusableTable<ModerationReport>
        columns={columns}
        data={paginatedReports}
        rowKey={(report) => report.id}
        selectedRowKeys={selectedReports}
        onSelectRow={(id) => handleSelectRow(Number(id))}
        onSelectAll={handleSelectAll}
        isAllSelected={
          paginatedReports.length > 0 &&
          paginatedReports.every((r) => selectedReports.includes(r.id))
        }
        emptyMessage="No moderation reports found"
        emptySubMessage="Try clearing search filters or check back later."
        emptyIcon={<ShieldAlert className="w-8 h-8 text-neutral-400" />}
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
    </div>
  );
}
