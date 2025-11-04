import { heroImg } from '@/utils/images'
import React from 'react'
import { Link } from 'react-router-dom'

function Hero() {
  return (
    <section className='min-h-svh flex items-center justify-center'>
        <div className='flex flex-col items-start gap-3'>
            <h2 className='font-semibold text-4xl'>Hey There 👋,</h2>
            <p className='text-gray-700'>Welcome to Bluekart — your one-stop shop for quality products at unbeatable prices. Explore our wide range of collections, from the latest tech to everyday essentials, all designed to make your shopping experience smarter and smoother.</p>
            <Link to={"/allproducts"} className='bg-primary text-primary-foreground rounded-md py-2 px-20 cursor-pointer hover:bg-blue-400'>Shop Now</Link>
        </div>
        <div>
            <img src={heroImg} className='w-[1200px]' alt="hero image" />
        </div>
    </section>
  )
}

export default Hero