import React from 'react'

const NewsletterBox = () => {

    const onSubmitHandler = (event) => {
        event.preventDefault();
    }

  return (
    <div className='text-center'>
      <p className='text-2xl font-medium text-gray-800' >Suscribe now & get 20% off on your first order.</p>
      <p className='text-gry-400 mt-3'>
        Join our newsletter to stay updated with the latest news and exclusive offers.
      </p>
      <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3'>
        <input className='-full sm:flex-1 outline-none' type="email" placeholder='Enter your email' required />
        <button type='submit' className='bg-black text-white text-xs px-10 py-4'>SUBSCRIBE</button>
      </form>
    </div>
  )
}

export default NewsletterBox
