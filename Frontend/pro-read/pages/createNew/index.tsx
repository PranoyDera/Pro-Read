import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import CreateStoryComponent from '@/app/Components/CreateStory/Editor';

export default function CreateNewPage() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Create New Story • Pro-Read</title>
      </Head>
      <div className="min-h-screen bg-[#070b16] text-[#e2e8f0]">
        <CreateStoryComponent 
          onBackToHub={() => router.push('/createStory')}
          onStorySaved={(savedStory, isPublished) => {
            if (isPublished) {
              setTimeout(() => router.push('/createStory'), 1500);
            } else if (savedStory?.id) {
              // Update URL to updateDraft/[id] once draft is created
              router.replace(`/updateDraft/${savedStory.id}`);
            }
          }}
        />
      </div>
    </>
  );
}
