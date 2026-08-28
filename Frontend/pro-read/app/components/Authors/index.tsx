"use client";

import React, { useState, useMemo } from "react";
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
  ChevronDown
} from "lucide-react";
import { Button } from "@/app/Components/ui/Button";
import { cn } from "@/lib/utils";
import { AuthorCards } from "./AuthorCards";
import { HeroSection } from "./HeroSection";
import { StoryCard } from "./StoryCard";

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

// --- Mock Data ---

const MOCK_AUTHORS: Author[] = [
  {
    id: "author-1",
    name: "Elara Finch",
    handle: "@elara_finch",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    bannerImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    role: "Grandmaster Storyteller",
    bio: "Weaving cosmic mysteries, dark academic fantasy, and emotional sagas across starlit realms. Hugo & Nebula award-nominated novelist.",
    location: "Edinburgh, UK",
    joinedDate: "Member since Jan 2023",
    verified: true,
    featured: true,
    stats: {
      totalStories: 4,
      followersCount: 14200,
      totalReads: "485K",
      avgRating: 4.9,
    },
    genres: ["High Fantasy", "Dark Academia", "Mythos"],
    achievements: ["Featured Author of the Month", "Top Rated 2025", "100K+ Reads Club"],
    stories: [
      {
        id: "story-101",
        title: "Moonlit Oath",
        subtitle: "The Chronicles of the Silver Veil • Book I",
        excerpt: "When the eclipse turns the tides crimson, a solitary knight must swear an oath to the dark star that bound her ancestors.",
        coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
        genre: "High Fantasy",
        readingTime: "9 min read",
        rating: 4.9,
        likes: 2840,
        views: 45200,
        publishedDate: "Oct 12, 2025",
        isPopular: true,
        isEditorChoice: true,
        contentSample: [
          "The night the third moon broke, nobody in the citadel spoke of sanctuary.",
          "Elara stood at the balcony edge, watching the silver frost creep up the marble gargoyles. Her sword felt heavier than usual, cold against her palm like leaden silence.",
          "'If you step beyond the boundary, lady of salt,' whispers the keeper, 'there is no road back to the mortal light.'"
        ]
      },
      {
        id: "story-102",
        title: "The Celestial Weaver",
        subtitle: "A Tale of Dreams and Starlight",
        excerpt: "In a world where stars are spun from the dreams of mortals, a young apprentice discovers a thread that threatens to unravel the universe.",
        coverImage: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80",
        genre: "Mythos",
        readingTime: "14 min read",
        rating: 4.95,
        likes: 3120,
        views: 61800,
        publishedDate: "Nov 03, 2025",
        isEditorChoice: true,
        contentSample: [
          "Every constellation had a song, though only those born in the indigo tower could hear the lower strings.",
          "Vaelen held the golden loom with hands hardened by silver dust. One misplaced knot, and a king's legacy would turn to ash by dawn."
        ]
      },
      {
        id: "story-103",
        title: "Whispers of the Obsidian Spire",
        subtitle: "Dark Academia & Arcane Mystery",
        excerpt: "Inside the forbidden library of Saint Jude, secret societies decipher forbidden manuscripts written in liquid shadow.",
        coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=600&q=80",
        genre: "Dark Academia",
        readingTime: "11 min read",
        rating: 4.8,
        likes: 1940,
        views: 32900,
        publishedDate: "Dec 18, 2025",
        contentSample: [
          "The scent of old vellum and dried chamomile always heralded professor Vance's arrival.",
          "Julian turned the page slowly, afraid that the charcoal figures etched in 14th-century ink might shift when he blinked."
        ]
      },
      {
        id: "story-104",
        title: "The Glass Sanctuary",
        subtitle: "Short Gothic Romance",
        excerpt: "A lonely botanist builds a greenhouse over forgotten ruins, uncovering an ethereal spirit preserved in crystalline amber.",
        coverImage: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80",
        genre: "Dark Academia",
        readingTime: "7 min read",
        rating: 4.85,
        likes: 1420,
        views: 21100,
        publishedDate: "Jan 10, 2026",
        contentSample: [
          "Glass panels rattled under the coastal gale, yet inside the dome, the orchids bloomed in unnatural lavender dusk.",
          "'He never spoke,' she recorded in her journal. 'He only left footprints made of crushed starlight.'"
        ]
      }
    ]
  },
  {
    id: "author-2",
    name: "Noah Glass",
    handle: "@noah_glass_writer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    bannerImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    role: "Sci-Fi & Cyberpunk Pioneer",
    bio: "Exploring futuristic dystopias, AI consciousness, neon noir thrillers, and post-apocalyptic sagas. Bestselling author of the Sol-9 Universe.",
    location: "Seattle, USA",
    joinedDate: "Member since Mar 2023",
    verified: true,
    featured: true,
    stats: {
      totalStories: 3,
      followersCount: 11800,
      totalReads: "390K",
      avgRating: 4.75,
    },
    genres: ["Cyberpunk", "Sci-Fi", "Neon Noir"],
    achievements: ["Sci-Fi Visionary 2025", "Staff Favorite Pick"],
    stories: [
      {
        id: "story-201",
        title: "Ashes of Winter",
        subtitle: "Sol-9 Protocol • Chapter I",
        excerpt: "When the frost core collapses, a renegade technician must bypass central AI security to reignite humanity's last thermal generator.",
        coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
        genre: "Sci-Fi",
        readingTime: "16 min read",
        rating: 4.75,
        likes: 2410,
        views: 39800,
        publishedDate: "Sep 29, 2025",
        isPopular: true,
        contentSample: [
          "Sub-zero warning indicators flashed in amber across the visor HUD.",
          "Kael pulled the insulated gloves tight. 'If the reactor doesn't pulse in six minutes, Sector 4 turns to solid nitrogen.'"
        ]
      },
      {
        id: "story-202",
        title: "Neon Horizon 2099",
        subtitle: "Neural Cybernetics Saga",
        excerpt: "In a rain-slicked metropolis ruled by megacorps, a rogue hacker recovers a memory chip containing a dead founder's soul.",
        coverImage: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=600&q=80",
        genre: "Cyberpunk",
        readingTime: "12 min read",
        rating: 4.88,
        likes: 3890,
        views: 52400,
        publishedDate: "Nov 20, 2025",
        isEditorChoice: true,
        contentSample: [
          "Holographic billboards projected synthetic rain over the lower decks.",
          "Rin plugged the neural jack straight into her optic port. The torrent of encrypted data burned like liquid electricity."
        ]
      },
      {
        id: "story-203",
        title: "Echoes of the Void",
        subtitle: "Deep Space Mystery",
        excerpt: "A deep-space salvage vessel picks up an ancient automated signal emitting from an abandoned Dyson sphere.",
        coverImage: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=600&q=80",
        genre: "Sci-Fi",
        readingTime: "18 min read",
        rating: 4.7,
        likes: 1750,
        views: 28900,
        publishedDate: "Dec 05, 2025",
        contentSample: [
          "The radar screen beeped with rhythm too exact for natural cosmic decay.",
          "'Cap, that ship left Earth's orbit seventy years before warp drives were invented... yet its engines are idling.'"
        ]
      }
    ]
  },
  {
    id: "author-3",
    name: "Ira Bloom",
    handle: "@ira_bloom",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    bannerImage: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80",
    role: "Literary Fiction & Mystery Specialist",
    bio: "Crafting atmospheric mysteries, environmental fables, and deep character portraits set along forgotten waters.",
    location: "Vancouver, Canada",
    joinedDate: "Member since May 2023",
    verified: true,
    stats: {
      totalStories: 3,
      followersCount: 8900,
      totalReads: "260K",
      avgRating: 4.8,
    },
    genres: ["Mystery", "Literary", "Atmospheric"],
    achievements: ["Storyteller's Guild Choice 2025"],
    stories: [
      {
        id: "story-301",
        title: "The River Archive",
        subtitle: "Secrets Beneath the Current",
        excerpt: "An archivist finds letters sealed in wax floating down the misty river every midnight, foretelling events before they happen.",
        coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
        genre: "Mystery",
        readingTime: "11 min read",
        rating: 4.8,
        likes: 2150,
        views: 31000,
        publishedDate: "Oct 24, 2025",
        isPopular: true,
        contentSample: [
          "The water tasted of iron and pine needles.",
          "Every bottle fished out of the black tide bore the same wax seal—a hummingbird clutching a clock gear."
        ]
      },
      {
        id: "story-302",
        title: "Tides of Solitude",
        subtitle: "Lighthouse Chronicles",
        excerpt: "Living alone on an isolated rock, a lighthouse keeper discovers an amphibious companion who speaks through sea glass melodies.",
        coverImage: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80",
        genre: "Literary",
        readingTime: "15 min read",
        rating: 4.9,
        likes: 1890,
        views: 26400,
        publishedDate: "Nov 15, 2025",
        contentSample: [
          "Foghorns wailed in pairs across the reef.",
          "He arranged the blue glass beads along the windowsill. Outside, gentle ripples sparkled under phosphorescent algae."
        ]
      },
      {
        id: "story-303",
        title: "The Fog Collector",
        subtitle: "Mountain Tale of Forgotten Memories",
        excerpt: "High in the misty highlands, an elder harvests cloud condensation to distill forgotten childhood memories into crystal bottles.",
        coverImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
        genre: "Atmospheric",
        readingTime: "8 min read",
        rating: 4.78,
        likes: 1430,
        views: 19800,
        publishedDate: "Dec 30, 2025",
        contentSample: [
          "The copper nets strained against the dawn breeze.",
          "'One sip,' the old collector warned, 'and you will remember your first laugh, but lose the sound of your mother's name.'"
        ]
      }
    ]
  },
  {
    id: "author-4",
    name: "Reed Nolan",
    handle: "@reed_nolan_books",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    bannerImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80",
    role: "Urban Thriller & Noir Specialist",
    bio: "Pacing gripping suspense, psychological thrillers, and razor-sharp noir fiction that keeps readers turning pages till dawn.",
    location: "New York, USA",
    joinedDate: "Member since Aug 2023",
    verified: true,
    stats: {
      totalStories: 3,
      followersCount: 16500,
      totalReads: "510K",
      avgRating: 4.92,
    },
    genres: ["Thriller", "Noir", "Mystery"],
    achievements: ["#1 Trending Author", "Pro-Read Gold Badge"],
    stories: [
      {
        id: "story-401",
        title: "Glass Orchard",
        subtitle: "The Manhattan Conspiracy",
        excerpt: "An investigative reporter uncovers a secret garden inside a skyscraper penthouse where high-stakes blackmail is cultivated.",
        coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
        genre: "Thriller",
        readingTime: "7 min read",
        rating: 5.0,
        likes: 4200,
        views: 68400,
        publishedDate: "Nov 02, 2025",
        isPopular: true,
        isEditorChoice: true,
        contentSample: [
          "Rain streaked the 60th-floor floor-to-ceiling glass.",
          "The file contained seven names. Three were senators, two were tech titans, and the last was the detective who arrested my father."
        ]
      },
      {
        id: "story-402",
        title: "Midnight Cipher",
        subtitle: "Underground Hacker War",
        excerpt: "When encrypted code starts appearing in daily subway tickets, a codebreaker realizes a subterranean syndicate is planning a citywide blackout.",
        coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
        genre: "Noir",
        readingTime: "13 min read",
        rating: 4.88,
        likes: 3100,
        views: 47200,
        publishedDate: "Dec 12, 2025",
        contentSample: [
          "The neon sign flickered: 24-HOUR DONUTS.",
          "I held the yellow subway stub up to the streetlamp. Embedded in the magnetic strip was a 256-bit private key."
        ]
      },
      {
        id: "story-403",
        title: "Silent Echo",
        subtitle: "Psychological Suspense",
        excerpt: "A sleep therapist discovers her patients are all dreaming about the exact same non-existent apartment on 5th Avenue.",
        coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
        genre: "Thriller",
        readingTime: "10 min read",
        rating: 4.86,
        likes: 2750,
        views: 38900,
        publishedDate: "Jan 04, 2026",
        contentSample: [
          "The audio recorder clicked to a halt.",
          "'Room 4B,' patient twelve whispered in her trance. 'The wallpaper has golden peacocks, and the grandfather clock stops at 3:17 AM.'"
        ]
      }
    ]
  },
  {
    id: "author-5",
    name: "Mina Kade",
    handle: "@mina_kade",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    bannerImage: "https://images.unsplash.com/photo-1511497584788-8767614657ed?auto=format&fit=crop&w=1200&q=80",
    role: "Poetic Fantasy & Romance Author",
    bio: "Writing velvety prose, romantic folklore, and epic voyages through enchanted forests and forgotten kingdoms.",
    location: "Melbourne, Australia",
    joinedDate: "Member since Feb 2024",
    verified: false,
    stats: {
      totalStories: 2,
      followersCount: 6400,
      totalReads: "180K",
      avgRating: 4.85,
    },
    genres: ["High Fantasy", "Romance", "Folklore"],
    achievements: ["Rising Star 2025"],
    stories: [
      {
        id: "story-501",
        title: "Wanderers of Dawn",
        subtitle: "The Sunlit Kingdom • Book I",
        excerpt: "Two rival cartographers are forced to map a mythical island that shifts location with every moonrise.",
        coverImage: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80",
        genre: "High Fantasy",
        readingTime: "14 min read",
        rating: 4.87,
        likes: 2980,
        views: 41000,
        publishedDate: "Nov 28, 2025",
        isPopular: true,
        contentSample: [
          "The compass needle spun erratically like a trapped dragonfly.",
          "'If we don't drop anchor before the fourth bell,' Mina warned, 'the shoreline will dissolve into cloud dust.'"
        ]
      },
      {
        id: "story-502",
        title: "Letters from Halcyon",
        subtitle: "Epistolary Romance & Magic",
        excerpt: "An emotional powerhouse following two star-crossed lovers who communicate only through enchanted letters carried by white falcons.",
        coverImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80",
        genre: "Romance",
        readingTime: "12 min read",
        rating: 4.93,
        likes: 3450,
        views: 49800,
        publishedDate: "Dec 22, 2025",
        isEditorChoice: true,
        contentSample: [
          "My dearest Cassian,",
          "The snow has reached the windowsill in Halcyon. The falcon arrived at midnight with your ribbon... I read your words four times by candlelight."
        ]
      }
    ]
  },
  {
    id: "author-6",
    name: "Julian Vance",
    handle: "@julian_vance_words",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80",
    bannerImage: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80",
    role: "Senior Editor & Historical Fiction Specialist",
    bio: "Unearthing forgotten historical events, wartime sagas, and intricate palace intrigue set across ancient civilizations.",
    location: "Vienna, Austria",
    joinedDate: "Member since Oct 2022",
    verified: true,
    stats: {
      totalStories: 2,
      followersCount: 19800,
      totalReads: "620K",
      avgRating: 4.91,
    },
    genres: ["Historical", "Dark Academia", "Intrigue"],
    achievements: ["Senior Editor", "Masterclass Lecturer", "Pro-Read Pioneer"],
    stories: [
      {
        id: "story-601",
        title: "The Silk Alchemist",
        subtitle: "16th Century Venice Intrigue",
        excerpt: "In Renaissance Venice, a master weaver crafts silk dyed with secret remedies capable of curing diseases—or silencing doges.",
        coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
        genre: "Historical",
        readingTime: "20 min read",
        rating: 4.94,
        likes: 3890,
        views: 59000,
        publishedDate: "Aug 14, 2025",
        isEditorChoice: true,
        contentSample: [
          "Gondolas cut quietly through the dark waters of the Grand Canal.",
          "The crimson dye spilled across the counter like pomegranate juice. Inside the pigment were ground ruby dust and nightshade roots."
        ]
      },
      {
        id: "story-602",
        title: "Empire of Shadows",
        subtitle: "The Fall of Byzantium",
        excerpt: "A scholar races through burning libraries during the siege of 1453 to save the world's last copy of lost Greek philosophies.",
        coverImage: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=600&q=80",
        genre: "Historical",
        readingTime: "17 min read",
        rating: 4.88,
        likes: 2950,
        views: 43200,
        publishedDate: "Nov 19, 2025",
        contentSample: [
          "Smoke smelled of burning cypress wood and melted binding resin.",
          "Leo embraced the leather satchel like a child. 'If these scrolls perish,' he declared, 'a thousand years of light go out with them.'"
        ]
      }
    ]
  }
];

const ALL_GENRES = ["All", "High Fantasy", "Cyberpunk", "Dark Academia", "Sci-Fi", "Mystery", "Thriller", "Romance", "Historical"];

// --- Component Definition ---

export default function AuthorsComponent() {
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [selectedStoryPreview, setSelectedStoryPreview] = useState<Story | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedGenreFilter, setSelectedGenreFilter] = useState<string>("All");
  const [followedAuthors, setFollowedAuthors] = useState<Record<string, boolean>>({
    "author-1": true,
    "author-4": false
  });
  const [bookmarkedStories, setBookmarkedStories] = useState<Record<string, boolean>>({});

  // Filtered authors based on search and genre filter
  const filteredAuthors = useMemo(() => {
    return MOCK_AUTHORS.filter((author) => {
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
  }, [searchQuery, selectedGenreFilter]);

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
  const featuredAuthor = MOCK_AUTHORS.find((a) => a.featured) || MOCK_AUTHORS[0];

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
            <HeroSection
              totalAuthors={MOCK_AUTHORS.length}
              featuredAuthor={featuredAuthor}
              onSelectAuthor={setSelectedAuthor}
            />

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
                      alert(`Opening full reader view for "${selectedStoryPreview.title}"...`);
                      setSelectedStoryPreview(null);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4"
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
