import { BookOpen } from 'lucide-react'
import React from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

function CuratedInbox() {
  return (
    <div className='bg-[#191C1F] flex justify-center items-center p-16 rounded-md'>
      <div className='flex flex-col gap-8 items-center text-center w-full max-w-xl'>
        <div className='flex flex-col justify-center items-center gap-4'>
        <BookOpen className='h-10 w-10' />

        <h1
          style={{ fontFamily: '"Noto Serif", serif' }}
          className='font-bold text-4xl'
        >
          Curated Inbox
        </h1>

        <p
          style={{ fontFamily: "Manrope, sans-serif" }}
          className='text-[#C7C4D7] max-w-lg'
        >
          Receive a weekly digest of scholarly reviews, exclusive author
          interviews, and our most refined reading recommendations
        </p>
        </div>
        <div className='w-full max-w-md flex gap-2'>
          <Input className='flex-1 rounded-none !bg-[#0C0E12] h-12' />
          <Button className='bg-[#C1C1FF] px-4 rounded-md text-[#1200A9] h-12'>
            JOIN
          </Button>
        </div>

      </div>
    </div>
  )
}

export default CuratedInbox