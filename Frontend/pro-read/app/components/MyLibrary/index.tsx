import React from 'react'
import LibraryHeader from './LibraryHeader'
import CurrentlyReading from './CurrentlyReading'
import FinishedBooks from './FinishedBooks'

function MyLibraryComponent() {
  return (
    <div>
    <div className="bg-[#0C0E12] text-white min-h-screen p-6 space-y-8">
      <LibraryHeader />
      <CurrentlyReading />
      <FinishedBooks />
      {/* <div className="grid grid-cols-2 gap-6">
        <Wishlist />
        <Collections />
      </div> */}
    </div>
    </div>
  )
}

export default MyLibraryComponent
