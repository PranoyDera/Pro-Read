'use client';

import React, { useState } from 'react';
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
  Bell
} from 'lucide-react';
import { IconBooks, IconNotebook, IconSparkles } from '@tabler/icons-react';
import { StoryCard } from '@/app/Components/Authors/StoryCard';
import type { Story } from '@/app/Components/Authors';

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
  const [activeView, setActiveView] = useState<'hub' | 'editor' | 'drafts' | 'upload'>('hub');
  const [initialStoryData, setInitialStoryData] = useState<{ title?: string; content?: string } | null>(null);

  // Mock drafts state
  const [drafts, setDrafts] = useState<DraftItem[]>([
    {
      id: '1',
      title: 'Whispers of the Celestial Canopy',
      excerpt: 'The stars didn’t just shine above Eldoria; they hummed with an ancient resonance that only the keepers could decipher...',
      lastEdited: '2 hours ago',
      wordCount: '2.4k words',
      coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: '2',
      title: 'The Silent Automation Protocol',
      excerpt: 'In the deep neon alleyways of Sector 7, mechanical gears turned without a drop of oil. Maya tightened her grip on the synth-key...',
      lastEdited: 'Yesterday',
      wordCount: '1.8k words',
      coverUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: '3',
      title: 'Chronicles of the Lost Voyager',
      excerpt: 'Log entry 402: The oxygen scrubbers are down to 14 percent, yet the view of the twin supernovas makes it almost tolerable...',
      lastEdited: '3 days ago',
      wordCount: '950 words',
      coverUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop'
    }
  ]);

  // Mock published stories state
  const [publishedStories] = useState<Story[]>([
    {
      id: 'p1',
      title: 'Echoes of the Quantum Horizon',
      subtitle: 'Part I of the Quantum Horizon Saga',
      excerpt: 'A deep dive into the theoretical boundaries of sub-atomic transmission and conscious memory storage across interstellar networks.',
      publishedDate: '12 May 2026',
      readingTime: '8 min read',
      genre: 'Sci-Fi',
      rating: 4.9,
      views: 14200,
      likes: 1800,
      coverImage: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?q=80&w=600&auto=format&fit=crop',
      contentSample: []
    },
    {
      id: 'p2',
      title: 'The Cybernetic Guild: Chapter 1',
      subtitle: 'Chapter 1: The Breach',
      excerpt: 'When neon light reflects off rainy cobblestones in the cyber district, rogue hacker Kaelen plans the ultimate system breach.',
      publishedDate: '28 Apr 2026',
      readingTime: '12 min read',
      genre: 'Cyberpunk',
      rating: 4.8,
      views: 8900,
      likes: 950,
      coverImage: 'https://images.unsplash.com/photo-1515260268569-9271009adfdb?q=80&w=600&auto=format&fit=crop',
      contentSample: []
    },
    {
      id: 'p3',
      title: 'Shadows of the Solitary Kingdom',
      subtitle: 'Volume II: Monarchs & Burden',
      excerpt: 'An epic tale of forgotten realms, ancient swords, and monarchs whose crowns carried burdens far heavier than gold.',
      publishedDate: '14 Mar 2026',
      readingTime: '15 min read',
      genre: 'Fantasy',
      rating: 4.95,
      views: 22500,
      likes: 3100,
      coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop',
      isEditorChoice: true,
      contentSample: []
    }
  ]);

  // Upload file state
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; content: string } | null>(null);

  const handleStartNew = () => {
    setInitialStoryData(null);
    setActiveView('editor');
  };

  const handleOpenDraft = (draft: DraftItem) => {
    setInitialStoryData({
      title: draft.title,
      content: draft.excerpt
    });
    setActiveView('editor');
  };

  const handleDeleteDraft = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDrafts(prev => prev.filter(d => d.id !== id));
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
        {/* Unified Studio & Editor Header */}
        <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
          {/* Left: Branding & Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-[8px] bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20">
                <IconSparkles className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  Pro-Read Creator Studio
                </h1>
                <div className="flex items-center space-x-2 text-xs text-slate-400 font-medium">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Draft saved 2 mins ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Actions (Save, Publish, Bell, Back to Hub) */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <button 
              className="flex items-center justify-center space-x-2 px-5 py-2 text-xs font-semibold tracking-wider text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 rounded-[5px] transition-all duration-200 active:scale-95 shadow-sm cursor-pointer"
            >
              <Save className="w-4 h-4 text-slate-400" />
              <span>SAVE DRAFT</span>
            </button>

            <button 
              className="flex items-center justify-center space-x-2 px-5 py-2 text-xs font-semibold tracking-wider text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 border border-transparent rounded-[5px] shadow-lg shadow-purple-900/30 hover:shadow-purple-700/40 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>PUBLISH</span>
            </button>

            <button 
              onClick={() => setActiveView('hub')}
              title="Back to Hub"
              className="flex items-center justify-center p-2 text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 rounded-[5px] transition-all duration-200 active:scale-95 shadow-sm cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </header>

        <CreateStoryComponent />
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {publishedStories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                onSelectPreview={() => {
                  setInitialStoryData({
                    title: story.title,
                    content: story.excerpt
                  });
                  setActiveView('editor');
                }}
              />
            ))}
          </div>
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
                <div className="text-center py-12 space-y-3">
                  <File className="w-12 h-12 text-slate-600 mx-auto" />
                  <p className="text-slate-400 text-sm">No drafts found.</p>
                  <button 
                    onClick={handleStartNew}
                    className="px-4 py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl hover:bg-amber-400 transition-colors inline-block"
                  >
                    Start a New Story
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
    </div>
  );
}

