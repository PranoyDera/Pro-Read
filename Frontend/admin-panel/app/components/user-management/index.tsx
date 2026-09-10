"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  Search,
  Trash2,
  RefreshCw,
  UserCheck,
  UserX,
  Shield,
  ShieldAlert,
  Mail,
  BookOpen,
  Calendar,
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
import { getAuthors, AuthorData } from "@/app/service/user-service";

export interface UserItem {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role: "admin" | "author" | "reader" | "moderator";
  status: "active" | "suspended" | "pending";
  storiesCount: number;
  joinedDate: string;
  lastActive: string;
}

const mapAuthorToUserItem = (author: AuthorData): UserItem => {
  const joinedDate = author.created_at
    ? new Date(author.created_at).toLocaleDateString("en-CA") // YYYY-MM-DD format
    : "N/A";

  return {
    id: author.id,
    name: author.name || "Unknown",
    email: author.email,
    avatar: author.profile_pic || undefined,
    role: (author.role as UserItem["role"]) || "author",
    status: author.is_verified === false ? "pending" : "active",
    storiesCount: author.total_stories_count ?? (author.stories?.length || 0),
    joinedDate,
    lastActive: author.updated_at
      ? new Date(author.updated_at).toLocaleDateString()
      : "Recently",
  };
};

export default function UserManagement() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const authorsData = await getAuthors();
      const mapped = (authorsData || []).map(mapAuthorToUserItem);
      setUsers(mapped);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filtering
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === "all" || u.role === roleFilter;

      const matchesStatus = statusFilter === "all" || u.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  // Pagination calculation
  const totalItems = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + pageSize);

  // Selection handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUsers(paginatedUsers.map((u) => u.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectRow = (id: number) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Actions
  const handleToggleSuspend = (id: number) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          return {
            ...u,
            status: u.status === "suspended" ? "active" : "suspended",
          };
        }
        return u;
      })
    );
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setSelectedUsers((prev) => prev.filter((item) => item !== id));
    }
  };

  // Table column definitions
  const columns = useMemo<ColumnDef<UserItem>[]>(
    () => [
      {
        id: "user",
        header: "User",
        headerClassName: "text-neutral-800 font-semibold",
        cellClassName: "max-w-xs",
        cell: (user) => (
          <div className="flex items-center gap-3">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border border-neutral-200 shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 text-white flex items-center justify-center text-xs font-semibold shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <div className="font-semibold text-neutral-950 truncate">
                {user.name}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-neutral-600 mt-0.5 truncate">
                <Mail className="w-3 h-3 text-neutral-500 shrink-0" />
                <span>{user.email}</span>
                <span>•</span>
                <span className="font-mono text-neutral-500">#{user.id}</span>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "role",
        header: "Role",
        headerClassName: "text-neutral-800 font-semibold",
        cell: (user) => {
          if (user.role === "admin") {
            return (
              <span className="inline-flex items-center gap-1 rounded-[5px] border border-neutral-900 bg-neutral-950 px-2 py-0.5 text-xs font-medium text-white shadow-2xs">
                <Shield className="w-3 h-3" />
                Admin
              </span>
            );
          }
          if (user.role === "moderator") {
            return (
              <span className="inline-flex items-center gap-1 rounded-[5px] border border-blue-300 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-900">
                <ShieldAlert className="w-3 h-3 text-blue-700" />
                Moderator
              </span>
            );
          }
          if (user.role === "author") {
            return (
              <span className="inline-flex items-center gap-1 rounded-[5px] border border-neutral-300 bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-800">
                <BookOpen className="w-3 h-3 text-neutral-600" />
                Author
              </span>
            );
          }
          return (
            <span className="inline-block rounded-[5px] border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-xs font-medium text-neutral-700">
              Reader
            </span>
          );
        },
      },
      {
        id: "storiesCount",
        header: "Stories",
        headerClassName: "text-neutral-800 font-semibold",
        cell: (user) => (
          <span className="font-mono text-xs font-semibold text-neutral-900">
            {user.storiesCount} stories
          </span>
        ),
      },
      {
        id: "status",
        header: "Status",
        headerClassName: "text-neutral-800 font-semibold",
        cell: (user) => {
          if (user.status === "active") {
            return (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                Active
              </span>
            );
          }
          if (user.status === "suspended") {
            return (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-400 bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-neutral-800">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                Suspended
              </span>
            );
          }
          return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
              Pending
            </span>
          );
        },
      },
      {
        id: "joinedDate",
        header: "Joined",
        headerClassName: "text-neutral-800 font-semibold",
        cellClassName: "text-xs text-neutral-700 font-mono font-medium",
        cell: (user) => (
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
            <span>{user.joinedDate}</span>
          </div>
        ),
      },
      {
        id: "lastActive",
        header: "Last Active",
        headerClassName: "text-neutral-800 font-semibold",
        cellClassName: "text-xs text-neutral-600",
        cell: (user) => user.lastActive,
      },
      {
        id: "actions",
        header: "Actions",
        headerClassName: "text-right text-neutral-800 font-semibold",
        cellClassName: "text-right",
        cell: (user) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => handleToggleSuspend(user.id)}
              className="text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100"
              title={user.status === "suspended" ? "Unsuspend User" : "Suspend User"}
            >
              {user.status === "suspended" ? (
                <UserCheck className="w-4 h-4 text-emerald-600" />
              ) : (
                <UserX className="w-4 h-4 text-neutral-600" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => handleDelete(user.id)}
              className="text-neutral-600 hover:text-red-600 hover:bg-red-50"
              title="Delete User"
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
              User Management
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full border border-neutral-300 bg-neutral-100 text-neutral-900 font-mono font-semibold">
              {totalItems} total
            </span>
          </div>
          <p className="text-sm text-neutral-700 mt-1 font-normal">
            Manage user accounts, roles, access permissions, and author activity.
          </p>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setRoleFilter("all");
              setStatusFilter("all");
              fetchUsers();
            }}
            className="border-neutral-400 bg-white text-neutral-900 hover:bg-neutral-100 hover:text-neutral-950 shadow-xs cursor-pointer font-medium"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-neutral-700 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          {selectedUsers.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (confirm(`Delete ${selectedUsers.length} selected users?`)) {
                  setUsers((prev) => prev.filter((u) => !selectedUsers.includes(u.id)));
                  setSelectedUsers([]);
                }
              }}
              className="bg-red-600 text-white hover:bg-red-700 shadow-xs cursor-pointer font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Selected ({selectedUsers.length})
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
            placeholder="Search by name, email..."
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
          {/* Role Filter */}
          <Select
            value={roleFilter}
            onValueChange={(val) => {
              if (val !== null) {
                setRoleFilter(val);
                setCurrentPage(1);
              }
            }}
          >
            <SelectTrigger className="h-9 min-w-[130px] rounded-[5px] border-neutral-350 bg-white px-3 text-xs text-neutral-900 font-medium shadow-2xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border border-neutral-300 shadow-md text-xs text-neutral-900">
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="moderator">Moderator</SelectItem>
              <SelectItem value="author">Author</SelectItem>
              <SelectItem value="reader">Reader</SelectItem>
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
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reusable Table */}
      <ReusableTable<UserItem>
        columns={columns}
        data={paginatedUsers}
        rowKey={(user) => user.id}
        selectedRowKeys={selectedUsers}
        onSelectRow={(id) => handleSelectRow(Number(id))}
        onSelectAll={handleSelectAll}
        isAllSelected={
          paginatedUsers.length > 0 &&
          paginatedUsers.every((u) => selectedUsers.includes(u.id))
        }
        isLoading={isLoading}
        emptyMessage="No users found"
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
    </div>
  );
}
