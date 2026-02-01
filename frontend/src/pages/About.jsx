import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div>

      <div className='text-2xl text-center pt-8 border-t'>

        <Title text1={'ABOUT'} text2={'US'} />

      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>We offer stylish, comfortable, and affordable clothing for everyday wear. Our collections are inspired by modern trends and made with quality in mind. We’re committed to a simple, smooth, and reliable shopping experience.</p>
          <p>From everyday wear to special occasions, our collections are carefully selected to match current trends while staying timeless. We believe clothing should feel good, look good, and last long.</p>
          <b className='text-gray-800' >Our Mission</b>
          <p>Our mission is to provide quality, stylish clothing at affordable prices while delivering a smooth and enjoyable shopping experience.</p>
        </div>

      </div>

      <div className='text-xl py-4'>

        <Title text1={'WHY'} text2={'CHOOSE US'} />

      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>

        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Quality Assurance:</b>
          <p className='text-gray-600'>We are committed to maintaining the highest standards of quality in every product we offer. From materials to craftsmanship, we ensure durability, comfort, and style so our customers can shop with confidence every time.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Convenience:</b>
          <p className='text-gray-600'>We make shopping easy and convenient with a user-friendly website, fast checkout, and reliable delivery, so you can enjoy your favorite styles without any hassle.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer Service:</b>
          <p className='text-gray-600'>We pride ourselves on providing exceptional customer service, offering friendly, helpful, and responsive support to ensure every shopping experience is smooth and enjoyable.</p>
          
        </div>

      </div>

      <NewsletterBox/>

    </div>
  )
}

export default About
