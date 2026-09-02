"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  UserCheck,
  UserPlus,
  BookOpen,
  Star,
  Eye,
  Heart,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  Clock,
  Share2,
  Bookmark,
  TrendingUp,
  Award,
  Layers,
  Feather,
  Globe,
  Flame,
  X,
  BookMarked,
  ChevronDown,
  Loader2
} from "lucide-react";
import { Button } from "@/app/Components/ui/Button";
import { cn } from "@/lib/utils";
import { AuthorCards } from "./AuthorCards";
import { HeroSection } from "./HeroSection";
import { StoryCard } from "./StoryCard";
import { getAuthors } from "@/app/Service/UserService";

// --- Types ---

export type Story = {
  id: string;
  title: string;
  subtitle: string;
  excerpt: string;
  coverImage: string;
  genre: string;
  readingTime: string;
  rating: number;
  likes: number;
  views: number;
  publishedDate: string;
  isPopular?: boolean;
  isEditorChoice?: boolean;
  contentSample: string[];
};

export type Author = {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bannerImage: string;
  role: string;
  bio: string;
  location: string;
  joinedDate: string;
  verified: boolean;
  featured?: boolean;
  stats: {
    totalStories: number;
    followersCount: number;
    totalReads: string;
    avgRating: number;
  };
  genres: string[];
  achievements: string[];
  stories: Story[];
};

const ALL_GENRES = ["All", "High Fantasy", "Cyberpunk", "Dark Academia", "Sci-Fi", "Mystery", "Thriller", "Romance", "Historical"];

// --- Component Definition ---

export default function AuthorsComponent() {
  const router = useRouter();
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [selectedStoryPreview, setSelectedStoryPreview] = useState<Story | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedGenreFilter, setSelectedGenreFilter] = useState<string>("All");
  const [followedAuthors, setFollowedAuthors] = useState<Record<string, boolean>>({});
  const [bookmarkedStories, setBookmarkedStories] = useState<Record<string, boolean>>({});

  // Fetch real authors from backend API via getAuthors service
  useEffect(() => {
    const loadAuthors = async () => {
      try {
        setIsLoading(true);
        const data = await getAuthors();

        if (data && data.authors && data.authors.length > 0) {
          const mappedAuthors: Author[] = data.authors.map((dbAuthor, idx) => {
            const formattedStories: Story[] = (dbAuthor.stories || []).map((s) => {
              const plainDesc = (s.description || "").replace(/<[^>]*>/g, " ").trim();
              const paragraphs = plainDesc.split("\n\n").filter(Boolean);
              return {
                id: String(s.id),
                title: s.title || "Untitled Story",
                subtitle: s.genre ? `${s.genre} Chronicle` : "Featured Saga",
                excerpt: plainDesc.slice(0, 180) + (plainDesc.length > 180 ? "..." : ""),
                coverImage: s.cover_pic || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
                genre: s.genre || "General",
                readingTime: s.read_time || "~3 min read",
                rating: 4.8 + ((s.id % 3) * 0.1),
                likes: Number(s.likes_count) || 0,
                views: Number(s.reads_count) || 0,
                publishedDate: s.created_at
                  ? new Date(s.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                  : "Recently",
                isPopular: (Number(s.reads_count) || 0) > 10,
                isEditorChoice: idx === 0,
                contentSample: paragraphs.length > 0 ? paragraphs.slice(0, 3) : [plainDesc]
              };
            });

            // Extract unique genres from stories
            const authorGenres = Array.from(new Set(formattedStories.map((s) => s.genre).filter(Boolean)));
            if (authorGenres.length === 0) authorGenres.push("Fiction", "Literature");

            const formattedReads = Number(dbAuthor.total_reads_count) >= 1000
              ? `${(Number(dbAuthor.total_reads_count) / 1000).toFixed(1)}K`
              : `${Number(dbAuthor.total_reads_count) || 0}`;

            const joinYear = dbAuthor.created_at
              ? new Date(dbAuthor.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
              : "Jan 2026";

            return {
              id: String(dbAuthor.id),
              name: dbAuthor.name,
              handle: `@${(dbAuthor.name || "author").toLowerCase().replace(/\s+/g, "_")}`,
              avatar: dbAuthor.profile_pic || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(dbAuthor.name)}`,
              bannerImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
              role: dbAuthor.reason || "Master Author & Creator",
              bio: dbAuthor.bio || "Crafting stories, sharing wisdom, and building worlds across prose and verse.",
              location: "Verified Author",
              joinedDate: `Member since ${joinYear}`,
              verified: Boolean(dbAuthor.is_verified) || true,
              featured: idx === 0,
              stats: {
                totalStories: Number(dbAuthor.total_stories_count) || formattedStories.length,
                followersCount: 1200 + (idx * 340),
                totalReads: formattedReads,
                avgRating: 4.85
              },
              genres: authorGenres,
              achievements: ["Grand Storyteller", "Prolific Author", "Community Champion"],
              stories: formattedStories
            };
          });

          setAuthors(mappedAuthors);
        } else {
          setAuthors([]);
        }
      } catch (err) {
        console.error("Failed to load authors from API:", err);
        setAuthors([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthors();
  }, []);

  // Filtered authors based on search and genre filter
  const filteredAuthors = useMemo(() => {
    return authors.filter((author) => {
      const matchesSearch =
        author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        author.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        author.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        author.genres.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase())) ||
        author.stories.some((s) => s.title.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesGenre =
        selectedGenreFilter === "All" ||
        author.genres.includes(selectedGenreFilter) ||
        author.stories.some((s) => s.genre === selectedGenreFilter);

      return matchesSearch && matchesGenre;
    });
  }, [authors, searchQuery, selectedGenreFilter]);

  const toggleFollow = (authorId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFollowedAuthors((prev) => ({
      ...prev,
      [authorId]: !prev[authorId]
    }));
  };

  const toggleBookmark = (storyId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarkedStories((prev) => ({
      ...prev,
      [storyId]: !prev[storyId]
    }));
  };

  // Featured author highlight
  const featuredAuthor = authors.find((a) => a.featured) || authors[0] || null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#090f1d] flex flex-col items-center justify-center p-6 text-[#E1E2E7] space-y-4">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center animate-pulse text-indigo-400">
            <BookMarked className="w-7 h-7" />
          </div>
          <Loader2 className="w-6 h-6 text-indigo-400 animate-spin absolute -bottom-2 -right-2" />
        </div>
        <p className="text-sm font-medium text-slate-400 animate-pulse tracking-wide">
          Loading Pro-Read Authors...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090f1d] text-[#E1E2E7] p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Dynamic View switching: Author Directory vs Author Detail View */}
      <AnimatePresence mode="wait">
        {!selectedAuthor ? (
          /* =========================================================================
             SECTION 1: AUTHORS DIRECTORY GRID VIEW
             ========================================================================= */
          <motion.div
            key="directory-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-8"
          >
            {/* Header Hero Section */}
            {featuredAuthor && (
              <HeroSection
                totalAuthors={authors.length}
                featuredAuthor={featuredAuthor}
                onSelectAuthor={setSelectedAuthor}
              />
            )}

            {/* Search & Genre Filter Toolbar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#0b1223]/80 p-4 rounded-xl border border-white/10 shadow-lg">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search authors by name, handle, genre, or story titles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900/90 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Genre Filter Dropdown */}
              <div className="relative flex items-center min-w-[160px]">
                <Filter className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none z-10" />
                <select
                  value={selectedGenreFilter}
                  onChange={(e) => setSelectedGenreFilter(e.target.value)}
                  className="w-full appearance-none bg-slate-900/90 border border-white/10 rounded-lg pl-9 pr-8 py-2.5 text-sm text-slate-200 cursor-pointer focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                >
                  {ALL_GENRES.map((genre) => (
                    <option key={genre} value={genre} className="bg-slate-900 text-slate-200">
                      {genre === "All" ? "All Genres" : genre}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 pointer-events-none text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Author Directory Cards Grid */}
            <div>
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-indigo-400" />
                  Authors Directory ({filteredAuthors.length})
                </h3>
                {selectedGenreFilter !== "All" && (
                  <span className="text-xs text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
                    Filtered by: {selectedGenreFilter}
                  </span>
                )}
              </div>

              <AuthorCards
                authors={filteredAuthors}
                followedAuthors={followedAuthors}
                onSelectAuthor={setSelectedAuthor}
                onToggleFollow={toggleFollow}
                searchQuery={searchQuery}
                selectedGenreFilter={selectedGenreFilter}
                onResetFilters={() => {
                  setSearchQuery("");
                  setSelectedGenreFilter("All");
                }}
              />
            </div>
          </motion.div>
        ) : (
          /* =========================================================================
             SECTION 2: AUTHOR DETAIL & STORIES VIEW (TRIGGERED ON CLICK)
             ========================================================================= */
          <motion.div
            key="detail-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-8"
          >
            {/* Top Navigation Bar */}
            <div className="flex items-center justify-between bg-[#0b1223]/80 p-3 rounded-xl border border-white/10">
              <Button
                variant="ghost"
                onClick={() => setSelectedAuthor(null)}
                className="cursor-pointer text-slate-300 hover:text-white hover:bg-white/10 text-xs sm:text-sm flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4 text-indigo-400" />
                Back to Authors Directory
              </Button>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Authors</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-white font-semibold">{selectedAuthor.name}</span>
              </div>
            </div>

            {/* Author Profile Header Hero Banner */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0b1223] shadow-2xl">
              {/* Banner Background Image with Gradient Overlay */}
              <div className="relative h-48 sm:h-64 w-full overflow-hidden">
                <img
                  src={selectedAuthor.bannerImage}
                  alt={selectedAuthor.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1223] via-[#0b1223]/60 to-transparent" />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-black/60 backdrop-blur-md border-white/15 text-white hover:bg-white/20 text-xs"
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(window.location.href);
                        alert(`Copied link to ${selectedAuthor.name}'s profile!`);
                      }
                    }}
                  >
                    <Share2 className="w-3.5 h-3.5 mr-1.5" />
                    Share Profile
                  </Button>
                </div>
              </div>

              {/* Profile Details Content */}
              <div className="px-6 sm:px-8 pb-8 pt-0 -mt-16 sm:-mt-20 relative z-10">
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pb-6 border-b border-white/10">
                  <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
                    <img
                      src={selectedAuthor.avatar}
                      alt={selectedAuthor.name}
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover ring-4 ring-[#0b1223] shadow-2xl"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white">
                          {selectedAuthor.name}
                        </h1>
                        {selectedAuthor.verified && (
                          <span className="inline-flex items-center gap-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs px-2.5 py-0.5 rounded-full font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                            Verified Author
                          </span>
                        )}
                      </div>
                      <p className="text-indigo-300 text-sm font-medium">{selectedAuthor.handle} • {selectedAuthor.role}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                        <span>{selectedAuthor.location}</span>
                        <span>•</span>
                        <span>{selectedAuthor.joinedDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button
                      onClick={(e) => toggleFollow(selectedAuthor.id, e)}
                      className={cn(
                        "flex-1 sm:flex-none h-10 px-5 text-sm font-semibold rounded-xl transition-all shadow-md",
                        followedAuthors[selectedAuthor.id]
                          ? "bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700"
                          : "bg-indigo-600 hover:bg-indigo-500 text-white"
                      )}
                    >
                      {followedAuthors[selectedAuthor.id] ? (
                        <>
                          <UserCheck className="w-4 h-4 mr-2 text-emerald-400" />
                          Following
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 mr-2" />
                          Follow Author
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Bio & Stats Bar */}
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                  <div className="lg:col-span-2 space-y-3">
                    <h4 className="text-xs uppercase font-bold text-indigo-300 tracking-wider">About the Author</h4>
                    <p className="text-slate-200 text-sm sm:text-base leading-relaxed bg-white/[0.02] p-4 rounded-xl border border-white/5">
                      {selectedAuthor.bio}
                    </p>

                    {/* Achievements */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {selectedAuthor.achievements.map((ach) => (
                        <div
                          key={ach}
                          className="flex items-center gap-1.5 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-lg"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>{ach}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Author Stats Summary Box */}
                  <div className="grid grid-cols-2 gap-3 bg-slate-900/80 p-4 rounded-xl border border-white/10">
                    <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                      <p className="text-xs text-slate-400">Total Stories</p>
                      <p className="text-xl font-bold text-white mt-1 flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-indigo-400" />
                        {selectedAuthor.stats.totalStories}
                      </p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                      <p className="text-xs text-slate-400">Followers</p>
                      <p className="text-xl font-bold text-white mt-1 flex items-center gap-1.5">
                        <UserCheck className="w-4 h-4 text-emerald-400" />
                        {(selectedAuthor.stats.followersCount / 1000).toFixed(1)}k
                      </p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                      <p className="text-xs text-slate-400">Total Readers</p>
                      <p className="text-xl font-bold text-white mt-1 flex items-center gap-1.5">
                        <Eye className="w-4 h-4 text-cyan-400" />
                        {selectedAuthor.stats.totalReads}
                      </p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                      <p className="text-xs text-slate-400">Rating</p>
                      <p className="text-xl font-bold text-white mt-1 flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
                        {selectedAuthor.stats.avgRating}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* STORIES WRITTEN BY AUTHOR SECTION */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white font-serif flex items-center gap-2">
                    <BookMarked className="w-6 h-6 text-indigo-400" />
                    Stories written by {selectedAuthor.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Browse published works, chapters, and sagas created by this author.
                  </p>
                </div>
                <div className="text-xs text-slate-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                  Showing <strong className="text-white">{selectedAuthor.stories.length}</strong> published titles
                </div>
              </div>

              {/* Stories Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {selectedAuthor.stories.map((story) => (
                  <StoryCard
                    key={story.id}
                    story={story}
                    isBookmarked={!!bookmarkedStories[story.id]}
                    onToggleBookmark={toggleBookmark}
                    onSelectPreview={setSelectedStoryPreview}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
         MODAL / DRAWER: STORY PREVIEW MODAL
         ========================================================================= */}
      <AnimatePresence>
        {selectedStoryPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#0b1223] border border-white/15 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col justify-between"
            >
              {/* Modal Header */}
              <div className="relative p-6 border-b border-white/10 bg-slate-900/60">
                <button
                  onClick={() => setSelectedStoryPreview(null)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-white/5 hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
                <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">
                  {selectedStoryPreview.genre} Preview
                </span>
                <h2 className="text-2xl font-bold font-serif text-white mt-1">
                  {selectedStoryPreview.title}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  By {selectedAuthor?.name || "Author"} • {selectedStoryPreview.readingTime}
                </p>
              </div>

              {/* Modal Content / Sample Passage */}
              <div className="p-6 space-y-4 text-slate-200 text-sm leading-relaxed font-serif">
                <div className="p-4 bg-indigo-500/10 border-l-4 border-indigo-500 rounded-r-lg text-indigo-200 text-xs italic">
                  &quot;{selectedStoryPreview.excerpt}&quot;
                </div>

                <h4 className="text-xs uppercase font-sans font-bold text-slate-400 tracking-wider pt-2">
                  Chapter Excerpt:
                </h4>

                {selectedStoryPreview.contentSample.map((paragraph, idx) => (
                  <p key={idx} className="indent-4 text-slate-300">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Modal Footer */}
              <div className="p-5 border-t border-white/10 bg-slate-900/80 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-amber-300">
                    <Star className="w-4 h-4 fill-amber-300" />
                    {selectedStoryPreview.rating}
                  </span>
                  <span className="flex items-center gap-1 text-rose-400">
                    <Heart className="w-4 h-4" />
                    {selectedStoryPreview.likes} likes
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedStoryPreview(null)}
                    className="text-xs border-white/15 bg-white/5 text-slate-300 hover:bg-white/10"
                  >
                    Close Preview
                  </Button>
                  <Button
                    onClick={() => {
                      if (selectedStoryPreview) {
                        const storyId = selectedStoryPreview.id;
                        setSelectedStoryPreview(null);
                        router.push(`/readStory/${storyId}`);
                      }
                    }}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 cursor-pointer"
                  >
                    Start Full Reading
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
