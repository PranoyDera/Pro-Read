import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Loader2 } from 'lucide-react';
import CreateStoryComponent from '@/app/Components/CreateStory/Editor';
import { getSingleDraft } from '@/app/Service/StoryService';
import { authService, AuthUser } from '@/app/Service/AuthService';

export default function UpdateDraftPage() {
  const router = useRouter();
  const { id } = router.query;
  const [initialData, setInitialData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady || !id) return;

    const loadDraft = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let user: AuthUser | null = null;
        try {
          const authRes = await authService.me();
          user = authRes.user;
        } catch {
          user = null;
        }

        if (!user?.id) {
          setError('Authentication required to access draft.');
          return;
        }

        // Call ONLY getSingleDraft(authorId, draftId)
        const draftRes = await getSingleDraft(user.id, String(id));
        const draftData = draftRes?.draft || draftRes?.story;

        if (draftData) {
          setInitialData({
            id: String(draftData.id),
            title: draftData.title || 'Untitled Draft',
            content: draftData.description || '',
            genre: draftData.genre || 'General',
            coverPic: draftData.cover_pic || 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200&auto=format&fit=crop',
            authorName: draftData.author_name || user?.name || 'Author',
            authorInitial: draftData.author_name ? draftData.author_name.charAt(0).toUpperCase() : (user?.name ? user.name.charAt(0).toUpperCase() : 'A'),
            readTime: draftData.read_time || '~3 min',
            isReadOnly: false
          });
        } else {
          setError('Draft details not found.');
        }
      } catch (err: any) {
        console.error('Failed to load draft:', err);
        setError(err?.response?.data?.message || err?.message || 'Failed to load draft details.');
      } finally {
        setIsLoading(false);
      }
    };

    loadDraft();
  }, [router.isReady, id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070b16] text-slate-200 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
        <p className="text-sm font-medium text-slate-400">Loading your draft...</p>
      </div>
    );
  }

  if (error || !initialData) {
    return (
      <div className="min-h-screen bg-[#070b16] text-slate-200 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 max-w-md">
          <p className="font-semibold text-base mb-1">Could Not Open Draft</p>
          <p className="text-xs text-rose-400/90">{error || 'Draft not found.'}</p>
        </div>
        <button
          onClick={() => router.push('/createStory')}
          className="px-4 py-2 bg-white/10 hover:bg-white/15 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
        >
          ← Back to Creator Studio
        </button>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Edit Draft • {initialData.title || 'Pro-Read'}</title>
      </Head>
      <div className="min-h-screen bg-[#070b16] text-[#e2e8f0]">
        <CreateStoryComponent 
          initialStoryData={initialData}
          onBackToHub={() => router.push('/createStory')}
          onStorySaved={(savedStory, isPublished) => {
            if (isPublished) {
              setTimeout(() => router.push('/createStory'), 1500);
            }
          }}
        />
      </div>
    </>
  );
}
