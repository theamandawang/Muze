"use client"

import React, { useState } from 'react'

interface HeroProps {
    displayName: string,
}

const Hero: React.FC<HeroProps> = ({
    displayName,
}) => {
    return (
        <section className="w-full h-[620px] bg-[#56435A] flex items-end">
            <h1 className="text-white text-4xl font-bold mb-10 mx-24">hey {displayName}</h1>
        </section>
    )
}

export default Hero;