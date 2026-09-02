'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CreateStoryComponent from './Editor';
import { 
  PenTool, 
  FileText, 
  UploadCloud, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Clock, 
  File, 
  X, 
  Trash2, 
  CheckCircle2, 
  FileCode, 
  BookOpen, 
  Eye, 
  Heart, 
  Save, 
  Check, 
  Send, 
  Bell, 
  Loader2,
  Feather,
  UserPlus,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { IconBooks, IconNotebook, IconSparkles } from '@tabler/icons-react';
import { StoryCard } from '@/app/Components/Authors/StoryCard';
import type { Story } from '@/app/Components/Authors';
import { getMyDrafts, getMyPublishedStories, getSingleStory, deleteStory, StoryItem } from '@/app/Service/StoryService';
import { me, AuthUser } from '@/app/Service/AuthService';
import { becomeAuthor } from '@/app/Service/UserService';

interface PublishedStory {
  id: string;
  title: string;
  excerpt: string;
  publishedDate: string;
  views: string;
  likes: string;
  coverUrl?: string;
}

interface DraftItem {
  id: string;
  authorId?: number | string;
  title: string;
  excerpt: string;
  lastEdited: string;
  wordCount: string;
  coverUrl?: string;
}

interface OptionCardProps {
  category: string;
  title: string;
  description: string;
  actionText: string;
  icon: React.ElementType;
  onClick: () => void;
  badge?: string;
  theme: {
    borderHover: string;
    shadowHover: string;
    bgGlow: string;
    bgGlowHover: string;
    iconBg: string;
    iconBorder: string;
    iconText: string;
    iconHoverBg: string;
    iconHoverText: string;
    categoryText: string;
    titleHover: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    actionText: string;
  };
}

const OptionCard: React.FC<OptionCardProps> = ({
  category,
  title,
  description,
  actionText,
  icon: Icon,
  onClick,
  badge,
  theme
}) => {
  return (
    <div 
      onClick={onClick}
      className={`group relative bg-slate-900/60 hover:bg-slate-900 border border-slate-800 ${theme.borderHover} rounded-[8px] p-7 transition-all duration-300 hover:shadow-2xl ${theme.shadowHover} cursor-pointer flex flex-col justify-between overflow-hidden`}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 ${theme.bgGlow} rounded-full blur-2xl ${theme.bgGlowHover} transition-all duration-500`}></div>
      
      <div>
        <div className={`w-14 h-14 rounded-[5px] ${theme.iconBg} border ${theme.iconBorder} ${theme.iconText} flex items-center justify-center mb-6 group-hover:scale-110 ${theme.iconHoverBg} ${theme.iconHoverText} transition-all duration-300`}>
          <Icon className="w-7 h-7" />
        </div>
        <div className="flex items-center justify-between">
          <span className={`text-xs font-semibold uppercase tracking-wider ${theme.categoryText}`}>{category}</span>
          {badge && (
            <span className={`${theme.badgeBg} ${theme.badgeText} text-xs px-2.5 py-0.5 rounded-full font-semibold border ${theme.badgeBorder}`}>
              {badge}
            </span>
          )}
        </div>
        <h3 className={`text-xl font-bold text-white mt-1 mb-2 ${theme.titleHover} transition-colors`}>
          {title}
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>

      <div className={`mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-sm font-medium ${theme.actionText} group-hover:translate-x-1 transition-transform`}>
        <span>{actionText}</span>
        <ArrowRight className="w-4 h-4" />
      </div>
    </div>
  );
};

export default function CreateStoryPage() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<'hub' | 'editor' | 'drafts' | 'upload'>('hub');
  const [initialStoryData, setInitialStoryData] = useState<{
    id?: string | number;
    title?: string;
    content?: string;
    genre?: string;
    coverPic?: string;
    authorName?: string;
    authorInitial?: string;
    readTime?: string;
    isReadOnly?: boolean;
  } | null>(null);

  // Live user & role state
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [showBecomeAuthorModal, setShowBecomeAuthorModal] = useState<boolean>(false);
  const [authorForm, setAuthorForm] = useState({
    birthDate: '',
    bio: '',
    reason: ''
  });
  const [isSubmittingAuthor, setIsSubmittingAuthor] = useState<boolean>(false);
  const [authorModalError, setAuthorModalError] = useState<string | null>(null);

  // Live state from API
  const [drafts, setDrafts] = useState<DraftItem[]>([]);
  const [publishedStories, setPublishedStories] = useState<Story[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  // Handle URL query parameters (e.g., when redirected from Authors page or reading mode)
  useEffect(() => {
    if (!router.isReady) return;

    const { storyId, mode, title, author, authorInitial, genre, coverPic, readTime } = router.query;
    const isReadMode = mode === 'read' || mode === 'preview';

    // If storyId is present, attempt to fetch fresh story details or use query params
    if (storyId) {
      const loadStoryById = async () => {
        try {
          const res = await getSingleStory(String(storyId));
          if (res && res.story) {
            const st = res.story;
            const isAuthor = currentUser ? currentUser.id === st.author_id : false;
            setInitialStoryData({
              id: String(st.id),
              title: st.title || 'Untitled Story',
              content: st.description || '',
              genre: st.genre || 'General',
              coverPic: st.cover_pic || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
              authorName: st.author_name || (typeof author === 'string' ? author : 'Author'),
              authorInitial: st.author_name ? st.author_name.charAt(0).toUpperCase() : (typeof authorInitial === 'string' ? authorInitial : 'A'),
              readTime: st.read_time || (typeof readTime === 'string' ? readTime : '~3 min'),
              isReadOnly: isReadMode || !isAuthor
            });
            setActiveView('editor');
            return;
          }
        } catch (e) {
          console.warn('Could not fetch story by ID, falling back to query data:', e);
        }

        // Fallback to query parameters if getSingleStory fails or for static/mock data
        if (title) {
          setInitialStoryData({
            id: String(storyId),
            title: typeof title === 'string' ? title : '',
            content: '',
            genre: typeof genre === 'string' ? genre : 'General',
            coverPic: typeof coverPic === 'string' ? coverPic : undefined,
            authorName: typeof author === 'string' ? author : 'Author',
            authorInitial: typeof authorInitial === 'string' ? authorInitial : 'A',
            readTime: typeof readTime === 'string' ? readTime : '~3 min',
            isReadOnly: isReadMode
          });
          setActiveView('editor');
        }
      };

      loadStoryById();
    }
  }, [router.isReady, router.query, currentUser]);

  // Fetch author drafts and published stories from backend
  const loadAuthorStories = async (userRole?: string) => {
    // If role is reader, do not call author-restricted APIs
    const activeRole = userRole || currentUser?.role;
    if (activeRole && activeRole !== 'author') {
      setIsLoadingData(false);
      return;
    }

    try {
      setIsLoadingData(true);
      
      // Fetch drafts
      try {
        const draftsRes = await getMyDrafts();
        if (draftsRes && draftsRes.drafts) {
          const mappedDrafts: DraftItem[] = draftsRes.drafts.map((d: StoryItem) => {
            const plainDesc = (d.description || '').replace(/<[^>]*>/g, ' ').trim();
            const wordCount = plainDesc.split(/\s+/).filter(Boolean).length;
            const formattedDate = d.updated_at
              ? new Date(d.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : 'Recent';

            return {
              id: String(d.id),
              authorId: d.author_id,
              title: d.title || 'Untitled Draft',
              excerpt: plainDesc,
              lastEdited: formattedDate,
              wordCount: `${wordCount} words`,
              coverUrl: d.cover_pic || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop'
            };
          });
          setDrafts(mappedDrafts);
        }
      } catch (err) {
        console.warn("Could not load author drafts:", err);
      }

      // Fetch published stories
      try {
        const pubRes = await getMyPublishedStories();
        if (pubRes && pubRes.stories) {
          const mappedPublished: Story[] = pubRes.stories.map((s: StoryItem) => {
            const plainDesc = (s.description || '').replace(/<[^>]*>/g, ' ').trim();
            const paragraphs = plainDesc.split('\n\n').filter(Boolean);
            return {
              id: String(s.id),
              title: s.title || 'Untitled Story',
              subtitle: s.genre ? `${s.genre} Chronicle` : 'Published Story',
              excerpt: plainDesc.slice(0, 180) + (plainDesc.length > 180 ? '...' : ''),
              publishedDate: s.created_at
                ? new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : 'Recently',
              readingTime: s.read_time || '~3 min read',
              genre: s.genre || 'General',
              rating: 4.9,
              views: Number(s.reads_count) || 0,
              likes: Number(s.likes_count) || 0,
              coverImage: s.cover_pic || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop',
              isPopular: (Number(s.reads_count) || 0) > 10,
              contentSample: paragraphs.length > 0 ? paragraphs.slice(0, 3) : [plainDesc]
            };
          });
          setPublishedStories(mappedPublished);
        }
      } catch (err) {
        console.warn("Could not load published stories:", err);
      }

    } finally {
      setIsLoadingData(false);
    }
  };

  // Check current user profile & role, and only load stories if author
  useEffect(() => {
    const initPage = async () => {
      try {
        const userRes = await me();
        if (userRes && userRes.user) {
          setCurrentUser(userRes.user);
          if (userRes.user.role === 'reader') {
            setShowBecomeAuthorModal(true);
            setIsLoadingData(false);
          } else if (userRes.user.role === 'author') {
            loadAuthorStories('author');
          }
        } else {
          setIsLoadingData(false);
        }
      } catch (err) {
        console.warn("Could not retrieve current user profile:", err);
        setIsLoadingData(false);
      }
    };

    initPage();
  }, []);

  const handleBecomeAuthorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorForm.birthDate) {
      setAuthorModalError("Please select your birth date");
      return;
    }

    try {
      setIsSubmittingAuthor(true);
      setAuthorModalError(null);
      
      const res = await becomeAuthor({
        birthDate: authorForm.birthDate,
        bio: authorForm.bio || undefined,
        reason: authorForm.reason || undefined
      });

      if (res && res.user) {
        setCurrentUser(res.user);
      }
      setShowBecomeAuthorModal(false);
      loadAuthorStories();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to become an author. Please try again.";
      setAuthorModalError(msg);
    } finally {
      setIsSubmittingAuthor(false);
    }
  };

  // Upload file state
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; content: string } | null>(null);

  const handleStartNew = () => {
    router.push('/createNew');
  };

  const handleOpenDraft = (draft: DraftItem) => {
    router.push(`/updateDraft/${draft.id}`);
  };

  const handleDeleteDraft = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteStory(id);
      setDrafts(prev => prev.filter(d => d.id !== id));
    } catch (error) {
      console.error("Failed to delete draft:", error);
      setDrafts(prev => prev.filter(d => d.id !== id));
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string || '';
      setUploadedFile({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        content: text
      });
    };
    reader.readAsText(file);
  };

  const handleProceedWithUpload = () => {
    if (uploadedFile) {
      const titleWithoutExt = uploadedFile.name.replace(/\.[^/.]+$/, "");
      setInitialStoryData({
        title: titleWithoutExt,
        content: uploadedFile.content
      });
      setActiveView('editor');
    }
  };

  if (activeView === 'editor') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <CreateStoryComponent 
          initialStoryData={initialStoryData}
          onBackToHub={() => {
            setActiveView('hub');
            loadAuthorStories('author');
          }}
          onStorySaved={(savedStory, isPublished) => {
            loadAuthorStories('author');
            if (isPublished) {
              setTimeout(() => setActiveView('hub'), 1500);
            }
          }}
        />
      </div>
    );
  }

  const optionCardsData = [
    {
      category: 'Fresh Canvas',
      title: 'Create New',
      description: 'Dive straight into our rich text editor equipped with real-time formatting, live stats, and cover customizations.',
      actionText: 'Start Writing',
      icon: PenTool,
      onClick: handleStartNew,
      theme: {
        borderHover: 'hover:border-amber-500/50',
        shadowHover: 'hover:shadow-amber-500/10',
        bgGlow: 'bg-amber-500/5',
        bgGlowHover: 'group-hover:bg-amber-500/15',
        iconBg: 'bg-amber-500/10',
        iconBorder: 'border-amber-500/20',
        iconText: 'text-amber-400',
        iconHoverBg: 'group-hover:bg-amber-500',
        iconHoverText: 'group-hover:text-slate-950',
        categoryText: 'text-amber-500',
        titleHover: 'group-hover:text-amber-400',
        badgeBg: 'bg-amber-500/20',
        badgeText: 'text-amber-300',
        badgeBorder: 'border-amber-500/30',
        actionText: 'text-amber-400'
      }
    },
    {
      category: 'Saved Stories',
      title: 'Your Drafts',
      description: 'Resume writing from where you left off. Browse your saved drafts, edit, refine, or review your stories.',
      actionText: 'View Saved Drafts',
      icon: FileText,
      onClick: () => setActiveView('drafts'),
      badge: `${drafts.length} Active`,
      theme: {
        borderHover: 'hover:border-purple-500/50',
        shadowHover: 'hover:shadow-purple-500/10',
        bgGlow: 'bg-purple-500/5',
        bgGlowHover: 'group-hover:bg-purple-500/15',
        iconBg: 'bg-purple-500/10',
        iconBorder: 'border-purple-500/20',
        iconText: 'text-purple-400',
        iconHoverBg: 'group-hover:bg-purple-500',
        iconHoverText: 'group-hover:text-white',
        categoryText: 'text-purple-400',
        titleHover: 'group-hover:text-purple-400',
        badgeBg: 'bg-purple-500/20',
        badgeText: 'text-purple-300',
        badgeBorder: 'border-purple-500/30',
        actionText: 'text-purple-400'
      }
    },
    {
      category: 'Import File',
      title: 'Upload Story',
      description: 'Import existing work from text files, Markdown (.md), or documents directly into our editor.',
      actionText: 'Upload Document',
      icon: UploadCloud,
      onClick: () => setActiveView('upload'),
      theme: {
        borderHover: 'hover:border-blue-500/50',
        shadowHover: 'hover:shadow-blue-500/10',
        bgGlow: 'bg-blue-500/5',
        bgGlowHover: 'group-hover:bg-blue-500/15',
        iconBg: 'bg-blue-500/10',
        iconBorder: 'border-blue-500/20',
        iconText: 'text-blue-400',
        iconHoverBg: 'group-hover:bg-blue-500',
        iconHoverText: 'group-hover:text-white',
        categoryText: 'text-blue-400',
        titleHover: 'group-hover:text-blue-400',
        badgeBg: 'bg-blue-500/20',
        badgeText: 'text-blue-300',
        badgeBorder: 'border-blue-500/30',
        actionText: 'text-blue-400'
      }
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950">
      {/* Background Decorative Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-[8px] bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20">
            <IconSparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Pro-Read Creator Studio
            </h1>
            <p className="text-xs text-slate-400">Craft, curate, and publish your next masterpiece</p>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-6xl w-full mx-auto px-6 py-12 flex-1 flex flex-col justify-center">
        {/* Title Section */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 inline-flex items-center gap-1.5">
            <IconSparkles className="w-3.5 h-3.5" /> Start Your Journey
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            What would you like to create today?
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Choose how you want to bring your thoughts to life. Select from starting fresh, picking up a draft, or importing an existing file.
          </p>
        </div>

        {/* Option Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {optionCardsData.map((card, idx) => (
            <OptionCard key={idx} {...card} />
          ))}
        </div>

        {/* Published Stories Section */}
        <div className="mt-6 border-t border-slate-800/80 pt-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-[5px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <IconBooks className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  Published Stories
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {publishedStories.length} Published
                  </span>
                </h3>
                <p className="text-xs text-slate-400">Explore and manage your previously published works</p>
              </div>
            </div>
            <button className="text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5 self-start sm:self-auto">
              <span>View All Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {publishedStories.length === 0 ? (
            <div className="relative py-14 px-6 rounded-2xl bg-gradient-to-b from-emerald-950/20 via-slate-950/40 to-slate-900/60 border border-emerald-500/15 overflow-hidden text-center flex flex-col items-center justify-center">
              {/* Ambient Glow */}
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              
              {/* Dual-layered Icon */}
              <div className="relative mb-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-900/50 to-slate-800 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-950/50 text-emerald-400">
                  <IconBooks className="w-8 h-8 opacity-85" />
                </div>
                <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-slate-900 border border-emerald-500/30 text-emerald-400">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Text Information */}
              <h4 className="text-lg font-bold text-white mb-1.5 tracking-tight">
                No Published Stories Yet
              </h4>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
                You haven&apos;t published any stories yet. Write your thoughts, craft compelling narratives, and share your voice with the world.
              </p>

              {/* Action Button */}
              <button 
                onClick={handleStartNew}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Write &amp; Publish Your First Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {publishedStories.map((story) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  onSelectPreview={() => {
                    router.push(`/readStory/${story.id}`);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/60 py-6 text-center text-xs text-slate-500">
        <p>Pro-Read Creator Studio &copy; {new Date().getFullYear()} • Empowering writers around the globe.</p>
      </footer>

      {/* Drafts Modal / Drawer Overlay */}
      {activeView === 'drafts' && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Your Saved Drafts</h3>
                  <p className="text-xs text-slate-400">Select a story to continue editing</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveView('hub')}
                className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {drafts.length === 0 ? (
                <div className="relative py-12 px-6 rounded-2xl bg-gradient-to-b from-purple-950/20 via-slate-950/40 to-slate-900/60 border border-purple-500/15 overflow-hidden text-center flex flex-col items-center justify-center">
                  {/* Subtle Ambient Glow */}
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
                  
                  {/* Icon with glowing animated ring */}
                  <div className="relative mb-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-900/50 to-slate-800 border border-purple-500/30 flex items-center justify-center shadow-lg shadow-purple-950/50 text-purple-300">
                      <FileText className="w-8 h-8 opacity-80" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-slate-900 border border-purple-500/30 text-purple-400">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Empty state title & description */}
                  <h4 className="text-lg font-bold text-white mb-1.5 tracking-tight">
                    No Drafts Available
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">
                    You haven&apos;t saved any unfinished stories yet. Start writing something new and your progress will appear here.
                  </p>

                  {/* Primary Action Button */}
                  <button 
                    onClick={handleStartNew}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    <span>Create Your First Story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                drafts.map((draft) => (
                  <div 
                    key={draft.id}
                    onClick={() => handleOpenDraft(draft)}
                    className="group bg-slate-950 border border-slate-800/80 hover:border-purple-500/40 rounded-xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center cursor-pointer transition-all hover:bg-slate-800/40"
                  >
                    <div className="flex gap-4 items-start sm:items-center">
                      {draft.coverUrl && (
                        <img 
                          src={draft.coverUrl} 
                          alt={draft.title} 
                          className="w-16 h-16 rounded-lg object-cover border border-slate-800 shrink-0"
                        />
                      )}
                      <div className="space-y-1">
                        <h4 className="font-bold text-white group-hover:text-purple-300 transition-colors">
                          {draft.title}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-1 max-w-md">
                          {draft.excerpt}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" /> {draft.lastEdited}
                          </span>
                          <span>•</span>
                          <span>{draft.wordCount}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button 
                        onClick={(e) => handleDeleteDraft(draft.id, e)}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete Draft"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="px-3.5 py-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 group-hover:bg-purple-500 group-hover:text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5">
                        <span>Edit</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upload Story Modal */}
      {activeView === 'upload' && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Upload Existing Story</h3>
                  <p className="text-xs text-slate-400">Import text or markdown files into your editor</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setActiveView('hub');
                  setUploadedFile(null);
                }}
                className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {!uploadedFile ? (
                <div 
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleFileDrop}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                    dragActive 
                      ? 'border-blue-500 bg-blue-500/10' 
                      : 'border-slate-800 hover:border-slate-700 bg-slate-950/50'
                  }`}
                >
                  <input 
                    type="file" 
                    id="file-upload" 
                    className="hidden" 
                    accept=".txt,.md,.markdown,.docx"
                    onChange={handleFileInput}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer space-y-3 block">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Click to upload or drag & drop file here
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Supports .txt, .md, .markdown, .docx (Max 10MB)
                      </p>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400">
                      <FileCode className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{uploadedFile.name}</h4>
                      <span className="text-xs text-slate-400">{uploadedFile.size}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                    </span>
                    <button 
                      onClick={() => setUploadedFile(null)}
                      className="p-1.5 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button 
                  onClick={() => {
                    setActiveView('hub');
                    setUploadedFile(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  disabled={!uploadedFile}
                  onClick={handleProceedWithUpload}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    uploadedFile 
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25 cursor-pointer' 
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <span>Open in Editor</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
         MODAL 3: JOIN AS AUTHOR MODAL (Prompted when a Reader accesses Create Story)
         ========================================================================= */}
      {showBecomeAuthorModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-[#0c1222] border border-amber-500/20 w-full max-w-lg rounded-2xl shadow-2xl shadow-amber-500/10 overflow-hidden relative">
            {/* Ambient Top Glow */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800/80 flex items-start justify-between relative">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <Feather className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    Join as Author
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300">
                      Creator Studio
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Unlock full publishing tools, rich text studio, and build your readership.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowBecomeAuthorModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleBecomeAuthorSubmit} className="p-6 space-y-4">
              {authorModalError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authorModalError}</span>
                </div>
              )}

              {/* Birth Date (Required) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Birth Date <strong className="text-amber-400">*</strong></span>
                </label>
                <input 
                  type="date"
                  required
                  value={authorForm.birthDate}
                  onChange={(e) => setAuthorForm(prev => ({ ...prev, birthDate: e.target.value }))}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all [color-scheme:dark]"
                />
              </div>

              {/* Author Bio */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <PenTool className="w-3.5 h-3.5 text-amber-400" />
                  <span>Author Bio / Tagline</span>
                </label>
                <textarea 
                  rows={2}
                  placeholder="e.g. Exploring cosmic sci-fi, dark academia, and atmospheric sagas..."
                  value={authorForm.bio}
                  onChange={(e) => setAuthorForm(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all resize-none"
                />
              </div>

              {/* Reason / Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Why do you want to publish? / Your Creator Role</span>
                </label>
                <input 
                  type="text"
                  placeholder="e.g. Fantasy Novelist & Worldbuilder"
                  value={authorForm.reason}
                  onChange={(e) => setAuthorForm(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80">
                <button 
                  type="button"
                  onClick={() => setShowBecomeAuthorModal(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmittingAuthor || !authorForm.birthDate}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
                >
                  {isSubmittingAuthor ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Upgrading to Author...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Join as Author</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

