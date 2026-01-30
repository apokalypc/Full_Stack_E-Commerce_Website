import React from 'react'
import { assets } from '../assets/assets'

const OurPolicy = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700'>

       <div>
        <img src={assets.exchange_icon} className='w-12 m-auto mb-5' alt="" />
        <p className='font-seibold'>Easy Exchange Policy</p>
        <p className='text-gray-400'>We offer a hassle-free exchange policy for all our products.</p>
       </div>
       <div>
        <img src={assets.quality_icon} className='w-12 m-auto mb-5' alt="" />
        <p className='font-seibold'>7 Days Return Policy</p>
        <p className='text-gray-400'>We provide a 7-day free return policy for all our products.</p>
       </div>
       <div>
        <img src={assets.support_img} className='w-12 m-auto mb-5' alt="" />
        <p className='font-seibold'>Best Customer Support</p>
        <p className='text-gray-400'>We offer 24/7 customer support.</p>
       </div>
    </div>
  )
}

export default OurPolicy
