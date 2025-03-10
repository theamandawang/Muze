"use client"

import React, { useState } from 'react'

interface HeroProps {
    displayName: string,
    albumArts?: string[]; // array of album covers
}

const Hero: React.FC<HeroProps> = ({
    displayName, albumArts = []
}) => {
  return (
    <section className='w-full h-[300px] md:h-[400px] lg:h-[500px] bg-[#56435A] flex items-end relative overflow-hidden'>
      {/* Album Covers */}
      {albumArts.length > 0 && (
        <div className='absolute top-1/4 left-1/2 -translate-x-1/2 flex gap-4 justify-center'>
          {albumArts.slice(0, 5).map((art, index) => (
            <img
              key={index}
              src={art}
              alt={`Album ${index + 1}`}
              className={`w-28 h-28 sm:w-36 sm:h-36 lg:w-60 lg:h-60 rounded-xl object-cover transition-transform duration-300 drop-shadow-2xl ${
                index % 2 === 1 ? 'translate-y-8' : '-translate-y-8'
              }`}
            />
          ))}
        </div>
      )}

      {/* Display Name */}
      <h1 className='text-white text-2xl lg:text-4xl font-bold mb-5 lg:mb-10 mx-24'>hey{displayName === '' ? '' : ' ' + displayName}!</h1>
    </section>
  );
}

export default Hero;