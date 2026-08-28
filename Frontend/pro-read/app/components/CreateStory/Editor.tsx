'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Type, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  Bold, 
  Italic, 
  Undo,
  Redo,
  Plus, 
  Minus, 
  Image as ImageIcon,
  Sliders,
  Check,
} from 'lucide-react';

export default function CreateStoryComponent() {
  const [title, setTitle] = useState('The Echoes of Aetheria');
  const [authorName, setAuthorName] = useState('Author');
  const [authorInitial, setAuthorInitial] = useState('A');
  const [readingTime, setReadingTime] = useState('~5 min');
  const [wordCount, setWordCount] = useState('1.2K');
  const [isSaved, setIsSaved] = useState(false);
  const [coverUrl, setCoverUrl] = useState(
    'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200&auto=format&fit=crop'
  );

  // Ref for contentEditable editor div
  const editorRef = useRef<HTMLDivElement>(null);

  // Floating toolbar toggle state
  const [isToolbarOpen, setIsToolbarOpen] = useState(false);
  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState(false);
  const [fontSearch, setFontSearch] = useState('');

  // Formatting state for editor controls
  const [isBoldActive, setIsBoldActive] = useState(false);
  const [isItalicActive, setIsItalicActive] = useState(false);
  const [alignIndex, setAlignIndex] = useState(0); // 0: left, 1: center, 2: right, 3: justify
  const [fontSize, setFontSize] = useState(18); // px
  const [fontFamilyIndex, setFontFamilyIndex] = useState(0);

  const alignments = ['left', 'center', 'right', 'justify'] as const;
  const [fontFamilies, setFontFamilies] = useState([
    // MS Word / System Fonts
    { label: 'Calibri', family: 'Calibri, "Segoe UI", sans-serif', isGoogleFont: false, category: 'MS Word' },
    { label: 'Calibri Light', family: '"Calibri Light", Calibri, sans-serif', isGoogleFont: false, category: 'MS Word' },
    { label: 'Times New Roman', family: '"Times New Roman", Times, serif', isGoogleFont: false, category: 'MS Word' },
    { label: 'Arial', family: 'Arial, Helvetica, sans-serif', isGoogleFont: false, category: 'MS Word' },
    { label: 'Arial Black', family: '"Arial Black", Gadget, sans-serif', isGoogleFont: false, category: 'MS Word' },
    { label: 'Georgia', family: 'Georgia, serif', isGoogleFont: false, category: 'MS Word' },
    { label: 'Cambria', family: 'Cambria, Georgia, serif', isGoogleFont: false, category: 'MS Word' },
    { label: 'Garamond', family: 'Garamond, Baskerville, serif', isGoogleFont: false, category: 'MS Word' },
    { label: 'Verdana', family: 'Verdana, Geneva, sans-serif', isGoogleFont: false, category: 'MS Word' },
    { label: 'Courier New', family: '"Courier New", Courier, monospace', isGoogleFont: false, category: 'MS Word' },
    { label: 'Consolas', family: 'Consolas, monospace', isGoogleFont: false, category: 'MS Word' },
    { label: 'Trebuchet MS', family: '"Trebuchet MS", sans-serif', isGoogleFont: false, category: 'MS Word' },
    { label: 'Comic Sans MS', family: '"Comic Sans MS", cursive', isGoogleFont: false, category: 'MS Word' },
    { label: 'Impact', family: 'Impact, Haettenschweiler, sans-serif', isGoogleFont: false, category: 'MS Word' },
    { label: 'Century Gothic', family: '"Century Gothic", AppleGothic, sans-serif', isGoogleFont: false, category: 'MS Word' },
    { label: 'Palatino Linotype', family: '"Palatino Linotype", Palatino, serif', isGoogleFont: false, category: 'MS Word' },
    { label: 'Segoe UI', family: '"Segoe UI", Tahoma, sans-serif', isGoogleFont: false, category: 'MS Word' },
    { label: 'Tahoma', family: 'Tahoma, Verdana, sans-serif', isGoogleFont: false, category: 'MS Word' },
    { label: 'Franklin Gothic', family: '"Franklin Gothic Medium", sans-serif', isGoogleFont: false, category: 'MS Word' },
    { label: 'Book Antiqua', family: '"Book Antiqua", Palatino, serif', isGoogleFont: false, category: 'MS Word' },
    { label: 'Bookman Old Style', family: '"Bookman Old Style", Bookman, serif', isGoogleFont: false, category: 'MS Word' },

    // Google Fonts API Web Fonts
    { label: 'Roboto', family: '"Roboto", sans-serif', isGoogleFont: true, category: 'Google API' },
    { label: 'Open Sans', family: '"Open Sans", sans-serif', isGoogleFont: true, category: 'Google API' },
    { label: 'Montserrat', family: '"Montserrat", sans-serif', isGoogleFont: true, category: 'Google API' },
    { label: 'Poppins', family: '"Poppins", sans-serif', isGoogleFont: true, category: 'Google API' },
    { label: 'Inter', family: '"Inter", sans-serif', isGoogleFont: true, category: 'Google API' },
    { label: 'Lora', family: '"Lora", serif', isGoogleFont: true, category: 'Google API' },
    { label: 'Merriweather', family: '"Merriweather", serif', isGoogleFont: true, category: 'Google API' },
    { label: 'Playfair Display', family: '"Playfair Display", serif', isGoogleFont: true, category: 'Google API' },
    { label: 'Oswald', family: '"Oswald", sans-serif', isGoogleFont: true, category: 'Google API' },
    { label: 'Raleway', family: '"Raleway", sans-serif', isGoogleFont: true, category: 'Google API' },
    { label: 'Fira Code', family: '"Fira Code", monospace', isGoogleFont: true, category: 'Google API' },
    { label: 'Cinzel', family: '"Cinzel", serif', isGoogleFont: true, category: 'Google API' },
    { label: 'Dancing Script', family: '"Dancing Script", cursive', isGoogleFont: true, category: 'Google API' },
    { label: 'Pacifico', family: '"Pacifico", cursive', isGoogleFont: true, category: 'Google API' },
    { label: 'Lobster', family: '"Lobster", cursive', isGoogleFont: true, category: 'Google API' },
    { label: 'Bebas Neue', family: '"Bebas Neue", cursive', isGoogleFont: true, category: 'Google API' },
    { label: 'Abril Fatface', family: '"Abril Fatface", serif', isGoogleFont: true, category: 'Google API' },
    { label: 'Caveat', family: '"Caveat", cursive', isGoogleFont: true, category: 'Google API' },
    { label: 'Satisfy', family: '"Satisfy", cursive', isGoogleFont: true, category: 'Google API' },
    { label: 'Ubuntu', family: '"Ubuntu", sans-serif', isGoogleFont: true, category: 'Google API' },
    { label: 'Kanit', family: '"Kanit", sans-serif', isGoogleFont: true, category: 'Google API' },
    { label: 'Exo 2', family: '"Exo 2", sans-serif', isGoogleFont: true, category: 'Google API' },
    { label: 'Nunito', family: '"Nunito", sans-serif', isGoogleFont: true, category: 'Google API' },
    { label: 'Rubik', family: '"Rubik", sans-serif', isGoogleFont: true, category: 'Google API' },
    { label: 'Work Sans', family: '"Work Sans", sans-serif', isGoogleFont: true, category: 'Google API' },
    { label: 'Quicksand', family: '"Quicksand", sans-serif', isGoogleFont: true, category: 'Google API' },
    { label: 'Comfortaa', family: '"Comfortaa", cursive', isGoogleFont: true, category: 'Google API' },
    { label: 'Permanent Marker', family: '"Permanent Marker", cursive', isGoogleFont: true, category: 'Google API' },
    { label: 'Great Vibes', family: '"Great Vibes", cursive', isGoogleFont: true, category: 'Google API' },
    { label: 'Anton', family: '"Anton", sans-serif', isGoogleFont: true, category: 'Google API' },
    { label: 'Josefin Sans', family: '"Josefin Sans", sans-serif', isGoogleFont: true, category: 'Google API' },
    { label: 'Inconsolata', family: '"Inconsolata", monospace', isGoogleFont: true, category: 'Google API' },
    { label: 'Source Code Pro', family: '"Source Code Pro", monospace', isGoogleFont: true, category: 'Google API' },
    { label: 'Space Mono', family: '"Space Mono", monospace', isGoogleFont: true, category: 'Google API' },
  ]);

  // Dynamically load font face via Google Fonts API
  const loadFontViaApi = (fontLabel: string) => {
    if (typeof document === 'undefined') return;
    const slug = fontLabel.replace(/\s+/g, '+');
    const elementId = `google-font-${fontLabel.replace(/\s+/g, '-').toLowerCase()}`;
    if (!document.getElementById(elementId)) {
      const link = document.createElement('link');
      link.id = elementId;
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${slug}:wght@400;600;700&display=swap`;
      document.head.appendChild(link);
    }
  };

  // Dynamically load and inject custom font entered via API search
  const handleLoadCustomApiFont = (customName: string) => {
    const trimmed = customName.trim();
    if (!trimmed) return;

    loadFontViaApi(trimmed);

    const existingIdx = fontFamilies.findIndex(
      f => f.label.toLowerCase() === trimmed.toLowerCase()
    );

    const fontFamStr = `"${trimmed}", sans-serif`;
    applyFontToSelection(fontFamStr);

    if (existingIdx !== -1) {
      setFontFamilyIndex(existingIdx);
    } else {
      const newFontItem = {
        label: trimmed,
        family: fontFamStr,
        isGoogleFont: true,
        category: 'Custom API'
      };
      setFontFamilies(prev => [newFontItem, ...prev]);
      setFontFamilyIndex(0);
    }
    setFontSearch('');
    setIsFontDropdownOpen(false);
  };

  // Load font stylesheet when font selection changes
  useEffect(() => {
    const activeFont = fontFamilies[fontFamilyIndex];
    if (activeFont && activeFont.isGoogleFont) {
      loadFontViaApi(activeFont.label);
    }
  }, [fontFamilyIndex]);

  const filteredFonts = fontFamilies.filter(f => 
    f.label.toLowerCase().includes(fontSearch.toLowerCase()) ||
    f.category.toLowerCase().includes(fontSearch.toLowerCase())
  );

  const currentAlign = alignments[alignIndex];
  const currentFontFamily = fontFamilies[fontFamilyIndex];

  // Update selection status when user moves cursor or selects text
  const checkSelectionState = () => {
    if (typeof document !== 'undefined') {
      setIsBoldActive(document.queryCommandState('bold'));
      setIsItalicActive(document.queryCommandState('italic'));
    }
  };

  const applyFontToSelection = (fontFamilyValue: string) => {
    if (typeof document !== 'undefined') {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        if (!selection.isCollapsed) {
          document.execCommand('fontName', false, fontFamilyValue);
        } else {
          // If cursor is placed on a line without highlighting, target parent block/paragraph
          const node = selection.anchorNode;
          const element = node?.nodeType === Node.ELEMENT_NODE ? (node as HTMLElement) : node?.parentElement;
          const blockElement = element?.closest('p, div, li, h1, h2, h3, h4, h5, h6');
          if (blockElement && editorRef.current?.contains(blockElement)) {
            blockElement.style.fontFamily = fontFamilyValue;
          }
        }
      }
    }
  };

  const applyFormatting = (command: 'bold' | 'italic') => {
    if (typeof document !== 'undefined') {
      document.execCommand(command, false);
      checkSelectionState();
      updateWordCount();
    }
  };

  const handleUndo = () => {
    if (typeof document !== 'undefined') {
      document.execCommand('undo', false);
      checkSelectionState();
      updateWordCount();
    }
  };

  const handleRedo = () => {
    if (typeof document !== 'undefined') {
      document.execCommand('redo', false);
      checkSelectionState();
      updateWordCount();
    }
  };

  const updateWordCount = () => {
    const editorText = editorRef.current?.innerText || '';
    const fullText = `${title} ${editorText}`;
    const words = fullText.trim().split(/\s+/).filter(Boolean).length;
    if (words >= 1000) {
      setWordCount(`${(words / 1000).toFixed(1)}K`);
    } else {
      setWordCount(`${words}`);
    }
  };

  const handleSaveDraft = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const renderAlignIcon = () => {
    switch (currentAlign) {
      case 'center': return <AlignCenter className="w-4 h-4" />;
      case 'right': return <AlignRight className="w-4 h-4" />;
      case 'justify': return <AlignJustify className="w-4 h-4" />;
      default: return <AlignLeft className="w-4 h-4" />;
    }
  };

  const getTextAlignClass = () => {
    switch (currentAlign) {
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      case 'justify': return 'text-justify';
      default: return 'text-left';
    }
  };

  return (
    <div className="min-h-screen bg-[#070b16] text-[#e2e8f0] font-sans flex flex-col relative selection:bg-purple-600/40">
      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 relative">
        {/* Story Cover Image Container */}
        <div className="relative group rounded-[5px] overflow-hidden shadow-2xl border border-white/10 mb-8 bg-[#0c1226]">
          <img 
            src={coverUrl} 
            alt="Story Banner" 
            className="w-full h-[260px] sm:h-[380px] object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b16] via-transparent to-transparent opacity-80" />
          
          <button 
            onClick={() => {
              const url = prompt('Enter image URL:', coverUrl);
              if (url) setCoverUrl(url);
            }}
            className="absolute bottom-4 right-4 flex items-center space-x-2 px-3 py-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/15 text-xs text-slate-300 hover:text-white rounded-[5px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Change Cover</span>
          </button>
        </div>

        {/* Title Input */}
        <div className="mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              updateWordCount();
            }}
            onSelect={checkSelectionState}
            onKeyUp={checkSelectionState}
            onMouseUp={checkSelectionState}
            placeholder="Title of your story..."
            style={{ fontFamily: currentFontFamily.family }}
            className={`w-full bg-transparent text-3xl sm:text-5xl font-extrabold text-slate-100 placeholder-slate-600 focus:outline-none tracking-tight leading-tight transition-all ${getTextAlignClass()}`}
          />
        </div>

        {/* Author & Meta Info */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-slate-400 mb-4 pb-6 border-b border-white/5">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-500 flex items-center justify-center text-slate-100 font-bold text-xs ring-2 ring-white/10 shadow-inner">
              {authorInitial}
            </div>
            <span className="text-slate-300 font-medium">By {authorName}</span>
          </div>

          <span className="text-slate-600">•</span>

          <div className="flex items-center space-x-1.5">
            <span className="text-slate-400">Reading Time:</span>
            <span className="text-slate-300 font-medium">{readingTime}</span>
          </div>
        </div>

        {/* Rich ContentEditable Story Text Editor Area */}
        <div className="relative">
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onSelect={checkSelectionState}
            onKeyUp={checkSelectionState}
            onMouseUp={checkSelectionState}
            onInput={updateWordCount}
            style={{ fontSize: `${fontSize}px` }}
            className={`w-full min-h-[300px] bg-transparent text-slate-200 leading-relaxed focus:outline-none tracking-wide transition-all ${getTextAlignClass()}`}
          >
            <p>In the forgotten depths of Aetheria, ancient star-lit libraries drifted through silent void space, holding knowledge of worlds long forgotten.</p>
            <p><br /></p>
            <p>Step into the endless corridors where books float softly, bounded by ethereal threads of silver magic. Writers and dreamers alike find solace under the infinite cosmic arches, crafting sagas that echo across galaxies.</p>
          </div>
        </div>
      </main>

      {/* Static Fixed Floating Formatting Toolbar */}
      <aside 
        className="fixed bottom-6 right-6 z-[9999] select-none flex flex-col items-end"
      >
        {/* Expanded Toolbar Panel with 500ms Open & Exit Animation */}
        <div className={`flex flex-col items-center bg-[#0b1024]/95 backdrop-blur-xl border border-purple-500/30 rounded-full py-3 px-1.5 shadow-2xl space-y-2.5 transition-all duration-500 ease-in-out origin-bottom ring-2 ring-purple-500/20 mb-3 ${
          isToolbarOpen 
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto max-h-[600px]' 
            : 'opacity-0 scale-75 translate-y-6 pointer-events-none max-h-0 py-0 overflow-hidden space-y-0 border-transparent shadow-none ring-0'
        }`}>
          {/* Undo Action */}
          <button 
            onMouseDown={(e) => {
              e.preventDefault();
              handleUndo();
            }}
            title="Undo (Ctrl+Z)" 
            className="p-2 text-slate-300 hover:text-purple-400 hover:bg-white/5 rounded-full transition-all duration-200 group relative cursor-pointer"
          >
            <Undo className="w-4 h-4" />
            <span className="absolute right-14 top-1/2 -translate-y-1/2 bg-[#0d152e] text-xs text-slate-200 px-2.5 py-1 rounded shadow-md border border-white/10 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
              Undo
            </span>
          </button>

          {/* Redo Action */}
          <button 
            onMouseDown={(e) => {
              e.preventDefault();
              handleRedo();
            }}
            title="Redo (Ctrl+Y)" 
            className="p-2 text-slate-300 hover:text-purple-400 hover:bg-white/5 rounded-full transition-all duration-200 group relative cursor-pointer"
          >
            <Redo className="w-4 h-4" />
            <span className="absolute right-14 top-1/2 -translate-y-1/2 bg-[#0d152e] text-xs text-slate-200 px-2.5 py-1 rounded shadow-md border border-white/10 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
              Redo
            </span>
          </button>

          <div className="w-4 h-[1px] bg-white/10" />

          {/* Selection Bold Toggle */}
          <button 
            onMouseDown={(e) => {
              e.preventDefault();
              applyFormatting('bold');
            }}
            title="Format selection Bold" 
            className={`p-2 rounded-full transition-all duration-200 group relative cursor-pointer ${
              isBoldActive ? 'text-purple-400 bg-purple-500/20 ring-1 ring-purple-500/50' : 'text-slate-300 hover:text-purple-400 hover:bg-white/5'
            }`}
          >
            <Bold className="w-4 h-4" />
            <span className="absolute right-14 top-1/2 -translate-y-1/2 bg-[#0d152e] text-xs text-slate-200 px-2.5 py-1 rounded shadow-md border border-white/10 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
              Bold Selection
            </span>
          </button>

          {/* Selection Italic Toggle */}
          <button 
            onMouseDown={(e) => {
              e.preventDefault();
              applyFormatting('italic');
            }}
            title="Format selection Italic" 
            className={`p-2 rounded-full transition-all duration-200 group relative cursor-pointer ${
              isItalicActive ? 'text-purple-400 bg-purple-500/20 ring-1 ring-purple-500/50' : 'text-slate-300 hover:text-purple-400 hover:bg-white/5'
            }`}
          >
            <Italic className="w-4 h-4" />
            <span className="absolute right-14 top-1/2 -translate-y-1/2 bg-[#0d152e] text-xs text-slate-200 px-2.5 py-1 rounded shadow-md border border-white/10 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
              Italic Selection
            </span>
          </button>

          <div className="w-4 h-[1px] bg-white/10" />

          {/* Alignment Selector */}
          <button 
            onClick={() => setAlignIndex((prev) => (prev + 1) % alignments.length)}
            title={`Alignment: ${currentAlign}`} 
            className="p-2 text-slate-300 hover:text-purple-400 hover:bg-white/5 rounded-full transition-all duration-200 group relative cursor-pointer"
          >
            {renderAlignIcon()}
            <span className="absolute right-14 top-1/2 -translate-y-1/2 bg-[#0d152e] text-xs text-slate-200 px-2.5 py-1 rounded shadow-md border border-white/10 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity capitalize">
              Align: {currentAlign}
            </span>
          </button>

          {/* Font Family Dropdown Menu */}
          <div className="relative">
            <button 
              onMouseDown={(e) => {
                e.preventDefault();
                setIsFontDropdownOpen(prev => !prev);
              }}
              title={`Font Style: ${currentFontFamily.label}`} 
              className={`p-2 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center group relative ${
                isFontDropdownOpen 
                  ? 'text-purple-400 bg-purple-500/25 ring-1 ring-purple-500/60' 
                  : 'text-slate-300 hover:text-purple-400 hover:bg-white/5'
              }`}
            >
              <Type className="w-4 h-4" />
              <span className="absolute right-14 top-1/2 -translate-y-1/2 bg-[#0d152e] text-xs text-slate-200 px-2.5 py-1 rounded shadow-md border border-white/10 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                Font: {currentFontFamily.label}
              </span>
            </button>

            {/* Font Options Popover Dropdown */}
            {isFontDropdownOpen && (
              <div 
                onMouseDown={(e) => e.preventDefault()}
                className="absolute right-14 bottom-0 bg-[#0b1024]/98 backdrop-blur-2xl border border-purple-500/40 rounded-xl p-2 shadow-2xl z-50 flex flex-col space-y-1.5 min-w-[220px] max-w-[260px] animate-in fade-in zoom-in-95 ring-2 ring-purple-500/20"
              >
                <div className="px-1 text-[10px] font-bold text-purple-300/80 uppercase tracking-wider flex items-center justify-between">
                  <span>Fonts Library (API Enabled)</span>
                  <span className="text-[9px] text-purple-400 bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-500/30">
                    {filteredFonts.length} Fonts
                  </span>
                </div>

                {/* Font Search Filter */}
                <input 
                  type="text"
                  value={fontSearch}
                  onChange={(e) => setFontSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && fontSearch.trim()) {
                      handleLoadCustomApiFont(fontSearch);
                    }
                  }}
                  placeholder="Search font or type any font name..."
                  className="w-full bg-slate-900/90 border border-white/10 rounded-md px-2.5 py-1 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
                />

                {/* Dynamic API Custom Font Fetch Button */}
                {fontSearch.trim().length > 0 && !fontFamilies.some(f => f.label.toLowerCase() === fontSearch.trim().toLowerCase()) && (
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleLoadCustomApiFont(fontSearch)}
                    className="w-full px-2.5 py-1.5 rounded-lg text-xs text-left bg-gradient-to-r from-purple-900/80 to-indigo-900/80 hover:from-purple-800 hover:to-indigo-800 border border-purple-500/50 text-purple-200 transition-all flex items-center justify-between cursor-pointer font-medium shadow-md"
                  >
                    <span className="truncate">Load &quot;{fontSearch}&quot; via API</span>
                    <span className="text-[9px] bg-purple-500/30 text-purple-300 px-1.5 py-0.5 rounded font-bold uppercase shrink-0 ml-1">
                      + Fetch
                    </span>
                  </button>
                )}

                {/* Scrollable Fonts List */}
                <div className="max-h-[240px] overflow-y-auto space-y-0.5 pr-0.5 scrollbar-thin scrollbar-thumb-purple-500/30">
                  {filteredFonts.length > 0 ? (
                    filteredFonts.map((font) => {
                      const originalIdx = fontFamilies.findIndex(f => f.label === font.label);
                      const isSelected = fontFamilyIndex === originalIdx;
                      return (
                        <button
                          key={font.label}
                          onMouseEnter={() => {
                            if (font.isGoogleFont) loadFontViaApi(font.label);
                          }}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            if (font.isGoogleFont) loadFontViaApi(font.label);
                            applyFontToSelection(font.family);
                            setFontFamilyIndex(originalIdx);
                            setIsFontDropdownOpen(false);
                            setFontSearch('');
                          }}
                          style={{ fontFamily: font.family }}
                          className={`w-full px-2.5 py-1.5 rounded-lg text-xs text-left transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-purple-600/35 text-purple-200 border border-purple-500/50 font-semibold shadow-sm'
                              : 'text-slate-300 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <span className="truncate pr-1">{font.label}</span>
                          <div className="flex items-center space-x-1 shrink-0">
                            <span className={`text-[8px] px-1 py-0.2 rounded font-sans uppercase font-bold tracking-tight ${
                              font.isGoogleFont 
                                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' 
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}>
                              {font.category}
                            </span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-purple-400 ml-1" />}
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="text-xs text-slate-400 text-center py-3 space-y-1">
                      <p>No local font matches &quot;{fontSearch}&quot;</p>
                      <button
                        onClick={() => handleLoadCustomApiFont(fontSearch)}
                        className="text-xs text-purple-300 underline font-semibold cursor-pointer hover:text-purple-200"
                      >
                        Click to fetch from Web API
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="w-4 h-[1px] bg-white/10" />

          {/* Font Size Increase */}
          <button 
            onClick={() => setFontSize((prev) => Math.min(36, prev + 2))}
            title="Increase Font Size" 
            className="p-1.5 text-slate-300 hover:text-purple-400 hover:bg-white/5 rounded-full transition-all duration-200 group relative cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="absolute right-14 top-1/2 -translate-y-1/2 bg-[#0d152e] text-xs text-slate-200 px-2.5 py-1 rounded shadow-md border border-white/10 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
              Increase Size ({fontSize}px)
            </span>
          </button>

          {/* Font Size Display Badge */}
          <span className="text-[10px] font-semibold text-purple-300 bg-purple-950/40 border border-purple-500/20 px-1.5 py-0.5 rounded">
            {fontSize}px
          </span>

          {/* Font Size Decrease */}
          <button 
            onClick={() => setFontSize((prev) => Math.max(12, prev - 2))}
            title="Decrease Font Size" 
            className="p-1.5 text-slate-300 hover:text-purple-400 hover:bg-white/5 rounded-full transition-all duration-200 group relative cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
            <span className="absolute right-14 top-1/2 -translate-y-1/2 bg-[#0d152e] text-xs text-slate-200 px-2.5 py-1 rounded shadow-md border border-white/10 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
              Decrease Size ({fontSize}px)
            </span>
          </button>

          <div className="w-4 h-[1px] bg-white/10" />

          {/* Word Count Indicator */}
          <div className="flex flex-col items-center justify-center text-center pt-0.5">
            <span className="text-[10px] font-bold tracking-wider text-slate-300 bg-white/5 px-2 py-1 rounded-md border border-white/5">
              {wordCount}
            </span>
          </div>
        </div>

        {/* Floating Action Button */}
        <button 
          onClick={() => setIsToolbarOpen(prev => !prev)}
          title={isToolbarOpen ? "Click to close formatting tools" : "Click to open formatting tools"}
          className={`w-12 h-12 rounded-full flex items-center justify-center bg-[#0b1024]/95 backdrop-blur-xl border border-purple-500/50 text-purple-300 shadow-2xl transition-all duration-500 ease-in-out active:scale-95 cursor-pointer group relative ring-2 ring-purple-500/30 hover:ring-purple-500/60 ${
            isToolbarOpen ? 'bg-purple-950/90 text-purple-200 ring-purple-500/70' : ''
          }`}
        >
          <Sliders className={`w-5 h-5 transition-transform duration-500 ease-in-out ${isToolbarOpen ? 'rotate-90 scale-110' : 'rotate-0'}`} />
          <span className="absolute right-14 top-1/2 -translate-y-1/2 bg-[#0d152e] text-xs text-slate-200 px-3 py-1.5 rounded-lg shadow-xl border border-white/10 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity font-medium">
            {isToolbarOpen ? "Close Tools" : "Formatting Tools"}
          </span>
        </button>
      </aside>
    </div>
  );
}
