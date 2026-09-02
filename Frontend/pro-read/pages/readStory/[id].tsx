import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Loader2 } from 'lucide-react';
import CreateStoryComponent from '@/app/Components/CreateStory/Editor';
import { getSingleStory } from '@/app/Service/StoryService';

export default function ReadStoryPage() {
  const router = useRouter();
  const { id } = router.query;
  const [initialData, setInitialData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady || !id) return;

    const loadStory = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await getSingleStory(String(id));
        if (res && res.story) {
          const st = res.story;
          setInitialData({
            id: String(st.id),
            title: st.title || 'Untitled Story',
            content: st.description || '',
            genre: st.genre || 'General',
            coverPic: st.cover_pic || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
            authorName: st.author_name || 'Author',
            authorInitial: st.author_name ? st.author_name.charAt(0).toUpperCase() : 'A',
            readTime: st.read_time || '~3 min',
            likes: st.likes_count || 0,
            views: st.reads_count || 0,
            isReadOnly: true
          });
        } else {
          setError('Story details could not be found.');
        }
      } catch (err: any) {
        console.error('Failed to load story:', err);
        setError(err?.response?.data?.message || err?.message || 'Failed to load story.');
      } finally {
        setIsLoading(false);
      }
    };

    loadStory();
  }, [router.isReady, id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070b16] text-slate-200 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
        <p className="text-sm font-medium text-slate-400">Loading story...</p>
      </div>
    );
  }

  if (error || !initialData) {
    return (
      <div className="min-h-screen bg-[#070b16] text-slate-200 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 max-w-md">
          <p className="font-semibold text-base mb-1">Story Unavailable</p>
          <p className="text-xs text-rose-400/90">{error || 'Story not found.'}</p>
        </div>
        <button
          onClick={() => router.push('/authors')}
          className="px-4 py-2 bg-white/10 hover:bg-white/15 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
        >
          ← Back to Authors
        </button>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{initialData.title || 'Story'} • Pro-Read</title>
      </Head>
      <div className="min-h-screen bg-[#070b16] text-[#e2e8f0]">
        <CreateStoryComponent 
          initialStoryData={initialData}
          isReadOnly={true}
          onBackToHub={() => router.back()}
        />
      </div>
    </>
  );
}
