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
  Tag,
  X,
  Sparkles,
  Save,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Heart,
  Share2,
  MessageSquare,
  CornerDownRight,
  User,
  Clock,
  Upload
} from 'lucide-react';
import { 
  createStory,
  createDraft, 
  updateDraft, 
  toggleLikeStory, 
  getStoryComments, 
  addCommentToStory,
  StoryComment 
} from '@/app/Service/StoryService';
import { API_BASE_URL } from '@/app/Constants/Common';

interface CreateStoryComponentProps {
  initialStoryData?: {
    id?: string | number;
    title?: string;
    content?: string;
    genre?: string;
    coverPic?: string;
    authorName?: string;
    authorInitial?: string;
    readTime?: string;
    isReadOnly?: boolean;
    likes?: number;
    views?: number;
  } | null;
  isReadOnly?: boolean;
  onStorySaved?: (story: any, isPublished: boolean) => void;
  onBackToHub?: () => void;
}

export default function CreateStoryComponent({
  initialStoryData,
  isReadOnly: isReadOnlyProp = false,
  onStorySaved,
  onBackToHub
}: CreateStoryComponentProps = {}) {
  const isReadOnly = isReadOnlyProp || Boolean(initialStoryData?.isReadOnly);
  const [storyId, setStoryId] = useState<string | number | null>(initialStoryData?.id || null);
  const [title, setTitle] = useState(initialStoryData?.title || 'The Echoes of Aetheria');
  const [authorName, setAuthorName] = useState(initialStoryData?.authorName || 'Author');
  const [authorInitial, setAuthorInitial] = useState(
    initialStoryData?.authorInitial || (initialStoryData?.authorName ? initialStoryData.authorName.charAt(0).toUpperCase() : 'A')
  );
  const [readingTime, setReadingTime] = useState(initialStoryData?.readTime || '~5 min');
  const [wordCount, setWordCount] = useState('1.2K');
  const [isSaved, setIsSaved] = useState(false);
  const [coverUrl, setCoverUrl] = useState(
    initialStoryData?.coverPic || 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200&auto=format&fit=crop'
  );
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  // Handle Cover File Upload from Device
  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      const previewUrl = URL.createObjectURL(file);
      setCoverUrl(previewUrl);
    }
  };

  // Social & Community Interaction States (Likes, Share, Comments)
  const [likesCount, setLikesCount] = useState<number>(initialStoryData?.likes || 0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isLiking, setIsLiking] = useState<boolean>(false);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  const [comments, setComments] = useState<StoryComment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState<boolean>(false);
  const [commentInput, setCommentInput] = useState<string>('');
  const [isSubmittingComment, setIsSubmittingComment] = useState<boolean>(false);
  const [commentFeedback, setCommentFeedback] = useState<string | null>(null);

  // Status & Feedback state
  const [isSubmitting, setIsSubmitting] = useState<'saving' | 'publishing' | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Genre selection state
  const initialGenres = initialStoryData?.genre 
    ? initialStoryData.genre.split(',').map(g => g.trim()).filter(Boolean)
    : ['Fantasy', 'Sci-Fi'];
  const [selectedGenres, setSelectedGenres] = useState<string[]>(initialGenres.length > 0 ? initialGenres : ['Fantasy']);
  const [customGenreInput, setCustomGenreInput] = useState('');
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);

  const availableGenres = [
    'Fantasy',
    'Sci-Fi',
    'Mystery',
    'Thriller',
    'Romance',
    'Adventure',
    'Horror',
    'Historical Fiction',
    'Cyberpunk',
    'Dystopian',
    'Supernatural',
    'Drama',
    'Poetry',
    'Non-Fiction',
    'Philosophy'
  ];

  const handleToggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(prev => prev.filter(g => g !== genre));
    } else {
      setSelectedGenres(prev => [...prev, genre]);
    }
  };

  const handleAddCustomGenre = () => {
    const trimmed = customGenreInput.trim();
    if (!trimmed) return;
    if (!selectedGenres.some(g => g.toLowerCase() === trimmed.toLowerCase())) {
      setSelectedGenres(prev => [...prev, trimmed]);
    }
    setCustomGenreInput('');
  };

  // Ref for contentEditable editor div
  const editorRef = useRef<HTMLDivElement>(null);

  // Populate editor with initial content if provided
  useEffect(() => {
    if (initialStoryData) {
      if (initialStoryData.id !== undefined) setStoryId(initialStoryData.id);
      if (initialStoryData.title !== undefined) setTitle(initialStoryData.title);
      if (initialStoryData.authorName) {
        setAuthorName(initialStoryData.authorName);
        setAuthorInitial(initialStoryData.authorInitial || initialStoryData.authorName.charAt(0).toUpperCase());
      }
      if (initialStoryData.readTime) setReadingTime(initialStoryData.readTime);
      if (initialStoryData.coverPic) setCoverUrl(initialStoryData.coverPic);
      if (initialStoryData.genre) {
        const parsedGenres = initialStoryData.genre.split(',').map(g => g.trim()).filter(Boolean);
        if (parsedGenres.length > 0) setSelectedGenres(parsedGenres);
      }
      if (initialStoryData.likes !== undefined) setLikesCount(Number(initialStoryData.likes) || 0);
    }

    if (editorRef.current && initialStoryData?.content) {
      // If contains HTML, set innerHTML, otherwise wrap paragraphs
      if (initialStoryData.content.includes('<') && initialStoryData.content.includes('>')) {
        editorRef.current.innerHTML = initialStoryData.content;
      } else {
        const paras = initialStoryData.content
          .split('\n\n')
          .filter(Boolean)
          .map(p => `<p>${p.replace(/\n/g, '<br/>')}</p>`)
          .join('');
        editorRef.current.innerHTML = paras || `<p>${initialStoryData.content}</p>`;
      }
      updateWordCount();
    }
  }, [initialStoryData]);

  // Load comments when in read mode or when storyId changes
  useEffect(() => {
    if (storyId) {
      const fetchComments = async () => {
        try {
          setIsLoadingComments(true);
          const res = await getStoryComments(storyId);
          if (res && res.comments) {
            setComments(res.comments);
          }
        } catch (err) {
          console.warn("Could not fetch story comments:", err);
        } finally {
          setIsLoadingComments(false);
        }
      };

      fetchComments();
    }
  }, [storyId]);

  // Handle Like Toggle
  const handleToggleLike = async () => {
    if (!storyId || isLiking) return;
    try {
      setIsLiking(true);
      const res = await toggleLikeStory(storyId);
      if (res) {
        setIsLiked(res.liked);
        setLikesCount(prev => (res.liked ? prev + 1 : Math.max(0, prev - 1)));
      }
    } catch (err) {
      console.error("Failed to toggle like:", err);
      // Fallback local toggle
      setIsLiked(prev => !prev);
      setLikesCount(prev => (!isLiked ? prev + 1 : Math.max(0, prev - 1)));
    } finally {
      setIsLiking(false);
    }
  };

  // Handle Share Click
  const handleShareStory = () => {
    if (typeof window !== 'undefined') {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 3000);
      }
    }
  };

  // Handle Add Comment
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = commentInput.trim();
    if (!trimmed) return;

    if (!storyId) {
      setCommentFeedback("Story ID not available to post comments.");
      return;
    }

    try {
      setIsSubmittingComment(true);
      setCommentFeedback(null);
      const res = await addCommentToStory(storyId, trimmed);
      if (res && res.comment) {
        setComments(prev => [res.comment, ...prev]);
        setCommentInput('');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to post comment.';
      setCommentFeedback(msg);
      // Fallback local addition for demonstration / guest
      const fallbackComment: StoryComment = {
        id: Date.now(),
        story_id: Number(storyId) || 0,
        user_id: 0,
        content: trimmed,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_name: 'You',
        user_profile_pic: null
      };
      setComments(prev => [fallbackComment, ...prev]);
      setCommentInput('');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Helper to format cover pic URL
  const getDisplayCoverUrl = (url: string) => {
    if (!url) return 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200&auto=format&fit=crop';
    if (url.startsWith('blob:') || url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }
    const cleanBase = API_BASE_URL.replace(/\/+$/, '');
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `${cleanBase}${cleanPath}`;
  };

  // Save Draft Handler
  const handleSaveDraft = async () => {
    const editorHtml = editorRef.current?.innerHTML || '';
    const plainContent = editorRef.current?.innerText || '';
    const storyTitle = title.trim() || 'Untitled Draft';
    const genreString = selectedGenres.join(', ');

    if (!plainContent.trim() && !storyTitle) {
      setFeedbackMessage({ type: 'error', text: 'Please write a title or story content before saving.' });
      return;
    }

    try {
      setIsSubmitting('saving');
      setFeedbackMessage(null);

      // If a file was selected from device, send the File object, otherwise send string or null
      const coverPicPayload = coverFile || (coverUrl.startsWith('blob:') ? null : coverUrl);

      let savedResult: any;
      if (storyId) {
        // Update existing draft
        const res = await updateDraft(storyId, {
          title: storyTitle,
          description: editorHtml || plainContent,
          genre: genreString,
          coverPic: coverPicPayload,
          publish: false
        });
        savedResult = res.draft;
        setFeedbackMessage({ type: 'success', text: 'Draft updated successfully!' });
      } else {
        // Create new draft
        const res = await createDraft({
          title: storyTitle,
          description: editorHtml || plainContent,
          genre: genreString,
          coverPic: coverPicPayload
        });
        savedResult = res.draft;
        if (savedResult?.id) setStoryId(savedResult.id);
        setFeedbackMessage({ type: 'success', text: 'New draft saved successfully!' });
      }

      setIsSaved(true);
      if (savedResult?.cover_pic) {
        setCoverUrl(savedResult.cover_pic);
        setCoverFile(null);
      }
      if (onStorySaved) onStorySaved(savedResult, false);
      setTimeout(() => setFeedbackMessage(null), 4000);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to save draft.';
      setFeedbackMessage({ type: 'error', text: msg });
    } finally {
      setIsSubmitting(null);
    }
  };

  // Publish Story Handler
  const handlePublishStory = async () => {
    const editorHtml = editorRef.current?.innerHTML || '';
    const plainContent = editorRef.current?.innerText || '';
    const storyTitle = title.trim();
    const genreString = selectedGenres.join(', ');

    if (!storyTitle) {
      setFeedbackMessage({ type: 'error', text: 'Story title is required to publish.' });
      return;
    }

    if (!plainContent.trim()) {
      setFeedbackMessage({ type: 'error', text: 'Story content cannot be empty when publishing.' });
      return;
    }

    try {
      setIsSubmitting('publishing');
      setFeedbackMessage(null);

      const coverPicPayload = coverFile || (coverUrl.startsWith('blob:') ? null : coverUrl);

      let publishedResult: any;
      if (storyId) {
        // Update and publish existing draft
        const res = await updateDraft(storyId, {
          title: storyTitle,
          description: editorHtml || plainContent,
          genre: genreString,
          coverPic: coverPicPayload,
          publish: true
        });
        publishedResult = res.draft || (res as any).story;
      } else {
        // Directly publish new story to stories table
        const res = await createStory({
          title: storyTitle,
          description: editorHtml || plainContent,
          genre: genreString,
          coverPic: coverPicPayload,
          status: 'published'
        });
        publishedResult = res.story;
      }

      setFeedbackMessage({ type: 'success', text: 'Story published to Pro-Read successfully!' });
      setIsSaved(true);
      if (publishedResult?.cover_pic) {
        setCoverUrl(publishedResult.cover_pic);
        setCoverFile(null);
      }
      if (onStorySaved) onStorySaved(publishedResult, true);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to publish story.';
      setFeedbackMessage({ type: 'error', text: msg });
    } finally {
      setIsSubmitting(null);
    }
  };

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

  // Refs for dropdown click-outside handling
  const genreDropdownRef = useRef<HTMLDivElement>(null);
  const fontDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (genreDropdownRef.current && !genreDropdownRef.current.contains(target)) {
        setIsGenreDropdownOpen(false);
      }
      if (fontDropdownRef.current && !fontDropdownRef.current.contains(target)) {
        setIsFontDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  // Active focused field ('editor' | 'title')
  const [activeField, setActiveField] = useState<'editor' | 'title'>('editor');
  const [titleFontFamily, setTitleFontFamily] = useState<string | null>(null);
  const [titleFontSize, setTitleFontSize] = useState<number>(40);
  const [isTitleBold, setIsTitleBold] = useState<boolean>(true);
  const [isTitleItalic, setIsTitleItalic] = useState<boolean>(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Update selection status when user moves cursor or selects text
  const checkSelectionState = () => {
    if (typeof document !== 'undefined') {
      if (activeField === 'title') {
        setIsBoldActive(isTitleBold);
        setIsItalicActive(isTitleItalic);
        setFontSize(titleFontSize);
        return;
      }

      setIsBoldActive(document.queryCommandState('bold'));
      setIsItalicActive(document.queryCommandState('italic'));

      // Check font size at current selection
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const node = selection.anchorNode;
        const element = node?.nodeType === Node.ELEMENT_NODE ? (node as HTMLElement) : node?.parentElement;
        if (element && editorRef.current?.contains(element)) {
          const computedSize = window.getComputedStyle(element).fontSize;
          const parsed = parseInt(computedSize, 10);
          if (!isNaN(parsed)) {
            setFontSize(parsed);
          }
        }
      }
    }
  };

  const applyFontToSelection = (fontFamilyValue: string) => {
    if (typeof document === 'undefined') return;

    if (activeField === 'title') {
      setTitleFontFamily(fontFamilyValue);
      return;
    }

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && editorRef.current) {
      // If selection is inside editor
      if (editorRef.current.contains(selection.anchorNode)) {
        if (!selection.isCollapsed) {
          document.execCommand('fontName', false, fontFamilyValue);
        } else {
          // If cursor is placed on a line without highlighting, target parent block/paragraph
          const node = selection.anchorNode;
          const element = node?.nodeType === Node.ELEMENT_NODE ? (node as HTMLElement) : node?.parentElement;
          const blockElement = element?.closest('p, div, li, h1, h2, h3, h4, h5, h6');
          if (blockElement && editorRef.current.contains(blockElement)) {
            (blockElement as HTMLElement).style.fontFamily = fontFamilyValue;
          }
        }
      }
    }
  };

  const applyFontSizeToSelection = (delta: number) => {
    if (typeof document === 'undefined') return;

    if (activeField === 'title') {
      const newSize = Math.max(16, Math.min(80, titleFontSize + delta));
      setTitleFontSize(newSize);
      setFontSize(newSize);
      return;
    }

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !editorRef.current) return;

    if (!editorRef.current.contains(selection.anchorNode)) return;

    const newSize = Math.max(12, Math.min(72, fontSize + delta));
    setFontSize(newSize);

    if (!selection.isCollapsed) {
      // Use execCommand fontSize dummy value then replace with precise px style or span wrapping
      document.execCommand('fontSize', false, '7');
      const fontElements = Array.from(editorRef.current.querySelectorAll("font[size='7']"));
      
      const createdSpans: HTMLElement[] = [];
      fontElements.forEach((el) => {
        const span = document.createElement('span');
        span.style.fontSize = `${newSize}px`;
        span.innerHTML = el.innerHTML;
        el.parentNode?.replaceChild(span, el);
        createdSpans.push(span);
      });

      // Restore the user selection over the newly formatted span(s)
      if (createdSpans.length > 0) {
        const newRange = document.createRange();
        newRange.setStartBefore(createdSpans[0]);
        newRange.setEndAfter(createdSpans[createdSpans.length - 1]);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    } else {
      // If no text is selected, apply to parent block
      const node = selection.anchorNode;
      const element = node?.nodeType === Node.ELEMENT_NODE ? (node as HTMLElement) : node?.parentElement;
      const blockElement = element?.closest('p, div, li, h1, h2, h3, h4, h5, h6');
      if (blockElement && editorRef.current.contains(blockElement)) {
        (blockElement as HTMLElement).style.fontSize = `${newSize}px`;
      }
    }
    updateWordCount();
  };

  const applyFormatting = (command: 'bold' | 'italic') => {
    if (activeField === 'title') {
      if (command === 'bold') {
        setIsTitleBold(prev => !prev);
        setIsBoldActive(!isTitleBold);
      } else {
        setIsTitleItalic(prev => !prev);
        setIsItalicActive(!isTitleItalic);
      }
      return;
    }

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

    // Dynamic calculated reading time (~200 wpm)
    const minutes = Math.max(1, Math.ceil(words / 200));
    setReadingTime(`~${minutes} min`);
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
      {/* Editor Action Bar */}
      <div className="sticky top-0 z-30 bg-[#0b1024]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBackToHub && (
            <button
              onClick={onBackToHub}
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
            >
              ← Back to Hub
            </button>
          )}
          <div className="text-xs text-slate-400 font-medium hidden sm:flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isReadOnly ? 'bg-indigo-400' : 'bg-emerald-400'} animate-pulse`} />
            <span>{isReadOnly ? 'Reading Mode' : isSaved ? 'Saved to Cloud' : 'Ready to Save or Publish'}</span>
          </div>
        </div>

        {/* Action Buttons: Save Draft and Publish (Hidden in Read-Only / Reader Mode) */}
        {!isReadOnly && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={isSubmitting !== null}
              onClick={handleSaveDraft}
              className="px-4 py-2 text-xs font-semibold tracking-wider text-slate-200 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 border border-slate-700/80 rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
            >
              {isSubmitting === 'saving' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
                  <span>SAVING...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 text-purple-400" />
                  <span>SAVE DRAFT</span>
                </>
              )}
            </button>

            <button
              type="button"
              disabled={isSubmitting !== null}
              onClick={handlePublishStory}
              className="px-5 py-2 text-xs font-bold tracking-wider text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 rounded-lg shadow-lg shadow-purple-900/40 hover:shadow-purple-700/50 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              {isSubmitting === 'publishing' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>PUBLISHING...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>PUBLISH</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Notification / Feedback Banner */}
      {feedbackMessage && (
        <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 pt-4">
          <div className={`p-3.5 rounded-xl border text-xs sm:text-sm font-medium flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300 ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300 shadow-lg shadow-emerald-950/30'
              : 'bg-rose-950/40 border-rose-500/30 text-rose-300 shadow-lg shadow-rose-950/30'
          }`}>
            <div className="flex items-center gap-2.5">
              {feedbackMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{feedbackMessage.text}</span>
            </div>
            <button 
              onClick={() => setFeedbackMessage(null)}
              className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 relative">
        {/* Story Cover Image Container with Device File Upload */}
        <div className="relative group rounded-[5px] overflow-hidden shadow-2xl border border-white/10 mb-8 bg-[#0c1226]">
          <img 
            src={getDisplayCoverUrl(coverUrl)} 
            alt="Story Banner" 
            className="w-full h-[260px] sm:h-[380px] object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b16] via-transparent to-transparent opacity-80" />
          
          {/* Hidden File Input for Device Upload */}
          <input 
            type="file"
            ref={coverFileInputRef}
            onChange={handleCoverFileChange}
            accept="image/*"
            className="hidden"
          />

          {!isReadOnly && (
            <button 
              type="button"
              onClick={() => coverFileInputRef.current?.click()}
              className="absolute bottom-4 right-4 flex items-center space-x-2 px-3.5 py-2 bg-black/70 hover:bg-black/90 backdrop-blur-md border border-purple-500/30 hover:border-purple-500/60 text-xs font-semibold text-slate-200 hover:text-white rounded-lg shadow-xl opacity-90 group-hover:opacity-100 transition-all duration-200 cursor-pointer active:scale-95"
            >
              <Upload className="w-3.5 h-3.5 text-purple-400" />
              <span>Change Cover (Upload)</span>
            </button>
          )}
        </div>

        {/* Title Input */}
        <div className="mb-4">
          <input
            ref={titleInputRef}
            type="text"
            readOnly={isReadOnly}
            value={title}
            onChange={(e) => {
              if (isReadOnly) return;
              setTitle(e.target.value);
              updateWordCount();
            }}
            onFocus={() => {
              setActiveField('title');
              setIsBoldActive(isTitleBold);
              setIsItalicActive(isTitleItalic);
              setFontSize(titleFontSize);
            }}
            onSelect={() => {
              setActiveField('title');
              checkSelectionState();
            }}
            onKeyUp={checkSelectionState}
            onMouseUp={checkSelectionState}
            placeholder="Title of your story..."
            style={{
              fontFamily: titleFontFamily || undefined,
              fontSize: `${titleFontSize}px`,
              fontWeight: isTitleBold ? 'bold' : 'normal',
              fontStyle: isTitleItalic ? 'italic' : 'normal',
            }}
            className={`w-full bg-transparent font-extrabold text-slate-100 placeholder-slate-600 focus:outline-none tracking-tight leading-tight transition-all ${getTextAlignClass()} ${isReadOnly ? 'cursor-default' : ''}`}
          />
        </div>

        {/* Author & Meta Info */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-slate-400 mb-3 pb-4 border-b border-white/5">
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

        {/* Story Genres Section */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-1.5 text-xs text-slate-400 mr-1">
            <Tag className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-semibold uppercase tracking-wider text-[11px] text-purple-300/90">Genres:</span>
          </div>

          {/* Selected Genre Badges */}
          {selectedGenres.map((genre) => (
            <span 
              key={genre}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/15 text-purple-200 border border-purple-500/30 hover:border-purple-500/60 shadow-sm transition-all"
            >
              <span>{genre}</span>
              {!isReadOnly && (
                <button
                  type="button"
                  onClick={() => handleToggleGenre(genre)}
                  className="text-purple-300 hover:text-white rounded-full p-0.5 hover:bg-purple-500/30 transition-colors cursor-pointer"
                  title={`Remove ${genre}`}
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}

          {/* Add Genre Dropdown & Custom Input Popover */}
          {!isReadOnly && (
            <div ref={genreDropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setIsGenreDropdownOpen(prev => !prev)}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 hover:border-purple-500/40 transition-all cursor-pointer"
              >
                <Plus className="w-3 h-3 text-purple-400" />
                <span>Add Genre</span>
              </button>

              {isGenreDropdownOpen && (
                <div 
                  className="absolute left-0 top-9 z-50 bg-[#0b1024]/98 backdrop-blur-xl border border-purple-500/30 rounded-xl p-3 shadow-2xl w-64 animate-in fade-in zoom-in-95 ring-2 ring-purple-500/20"
                >
                  <div className="text-[11px] font-bold text-purple-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span className="flex items-center space-x-1">
                      <Sparkles className="w-3 h-3 text-purple-400" />
                      <span>Select Genres</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {selectedGenres.length} selected
                    </span>
                  </div>

                  {/* Popular Genres Badges Cloud */}
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto mb-2.5 pr-1 scrollbar-thin scrollbar-thumb-purple-500/30">
                    {availableGenres.map((genre) => {
                      const isSelected = selectedGenres.includes(genre);
                      return (
                        <button
                          key={genre}
                          type="button"
                          onClick={() => handleToggleGenre(genre)}
                          className={`text-xs px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-purple-600 text-white border-purple-400 font-semibold shadow-xs'
                              : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          {genre}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Genre Text Input */}
                  <div className="pt-2 border-t border-white/10 flex items-center space-x-1.5">
                    <input
                      type="text"
                      value={customGenreInput}
                      onChange={(e) => setCustomGenreInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomGenre();
                        }
                      }}
                      placeholder="Custom genre..."
                      className="flex-1 bg-slate-900/90 border border-white/10 rounded-md px-2 py-1 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomGenre}
                      disabled={!customGenreInput.trim()}
                      className="px-2 py-1 rounded-md text-xs bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium transition-all shrink-0 cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Rich ContentEditable Story Text Editor Area */}
        <div className="relative">
          <div
            ref={editorRef}
            contentEditable={!isReadOnly}
            suppressContentEditableWarning
            onFocus={() => {
              if (isReadOnly) return;
              setActiveField('editor');
              checkSelectionState();
            }}
            onSelect={() => {
              if (isReadOnly) return;
              setActiveField('editor');
              checkSelectionState();
            }}
            onKeyUp={checkSelectionState}
            onMouseUp={checkSelectionState}
            onInput={updateWordCount}
            className={`w-full min-h-[300px] bg-transparent text-slate-200 text-lg leading-relaxed focus:outline-none tracking-wide transition-all ${getTextAlignClass()} ${isReadOnly ? 'cursor-default' : ''}`}
          >
            <p>In the forgotten depths of Aetheria, ancient star-lit libraries drifted through silent void space, holding knowledge of worlds long forgotten.</p>
            <p><br /></p>
            <p>Step into the endless corridors where books float softly, bounded by ethereal threads of silver magic. Writers and dreamers alike find solace under the infinite cosmic arches, crafting sagas that echo across galaxies.</p>
          </div>
        </div>

        {/* =========================================================================
           READING MODE: SOCIAL ACTIONS (LIKE, SHARE) & COMMENTS SECTION
           ========================================================================= */}
        {isReadOnly && (
          <section className="mt-12 pt-8 border-t border-white/10 space-y-8 animate-in fade-in duration-300">
            {/* Social Engagement Action Bar (Like, Share, Comment Count) */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-[#0b1024] via-purple-950/20 to-[#0b1024] border border-white/10 shadow-xl">
              <div className="flex items-center gap-3">
                {/* Like Button */}
                <button
                  type="button"
                  disabled={isLiking}
                  onClick={handleToggleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-md ${
                    isLiked 
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 ring-2 ring-rose-500/20' 
                      : 'bg-white/5 hover:bg-rose-500/10 text-slate-300 hover:text-rose-300 border border-white/10'
                  }`}
                >
                  <Heart className={`w-4 h-4 transition-transform active:scale-125 ${isLiked ? 'fill-rose-400 text-rose-400' : ''}`} />
                  <span>{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
                </button>

                {/* Share Button */}
                <button
                  type="button"
                  onClick={handleShareStory}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-indigo-500/10 text-slate-300 hover:text-indigo-300 border border-white/10 transition-all cursor-pointer shadow-md"
                >
                  <Share2 className="w-4 h-4 text-indigo-400" />
                  <span>{copiedShare ? 'Link Copied!' : 'Share Story'}</span>
                </button>
              </div>

              {/* Comments count indicator */}
              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                <span>{comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}</span>
              </div>
            </div>

            {/* Comments Discussion Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-purple-400" />
                  Reader Discussion &amp; Thoughts
                </h3>
                <span className="text-xs text-slate-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                  {comments.length} Thoughts Shared
                </span>
              </div>

              {/* Add Comment Input Form */}
              <form onSubmit={handleAddComment} className="space-y-3 bg-[#0b1024]/80 p-4 sm:p-5 rounded-2xl border border-white/10 shadow-lg">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-purple-500/20 shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <textarea
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder="Share your feedback, theories, or reactions with the author..."
                      rows={3}
                      className="w-full bg-slate-900/90 border border-white/10 rounded-xl p-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
                    />
                    <div className="flex items-center justify-between">
                      {commentFeedback && (
                        <span className="text-xs text-rose-400 font-medium">
                          {commentFeedback}
                        </span>
                      )}
                      <div className="ml-auto">
                        <button
                          type="submit"
                          disabled={!commentInput.trim() || isSubmittingComment}
                          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          {isSubmittingComment ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Posting...</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5" />
                              <span>Post Comment</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-3">
                {isLoadingComments ? (
                  <div className="p-8 text-center text-slate-400 space-y-2">
                    <Loader2 className="w-5 h-5 text-purple-400 animate-spin mx-auto" />
                    <p className="text-xs">Loading reader comments...</p>
                  </div>
                ) : comments.length === 0 ? (
                  <div className="py-10 px-6 rounded-2xl bg-[#0b1024]/40 border border-white/5 text-center flex flex-col items-center justify-center space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-1">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-semibold text-slate-200">No comments yet</p>
                    <p className="text-xs text-slate-400 max-w-sm">
                      Be the first to share your appreciation or critique with {authorName}!
                    </p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div 
                      key={comment.id}
                      className="p-4 rounded-xl bg-[#0b1024]/90 border border-white/5 hover:border-white/10 transition-all space-y-2 shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          {comment.user_profile_pic ? (
                            <img 
                              src={comment.user_profile_pic} 
                              alt={comment.user_name} 
                              className="w-7 h-7 rounded-full object-cover border border-white/10"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 border border-white/10 flex items-center justify-center text-[10px] font-bold text-slate-200">
                              {(comment.user_name || 'R').charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="text-xs font-bold text-white">{comment.user_name || 'Reader'}</span>
                        </div>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {comment.created_at ? new Date(comment.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recently'}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-9">
                        {comment.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Static Fixed Floating Formatting Toolbar (Hidden in Reading / Read-Only Mode) */}
      {!isReadOnly && (
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
            <div ref={fontDropdownRef} className="relative">
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
              onMouseDown={(e) => {
                e.preventDefault();
                applyFontSizeToSelection(2);
              }}
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
              onMouseDown={(e) => {
                e.preventDefault();
                applyFontSizeToSelection(-2);
              }}
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
      )}
    </div>
  );
}
