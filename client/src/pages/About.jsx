import React from 'react'

export default function About() {
  let theme = localStorage.getItem("theme");
  if (!theme) {
    theme = "light";
  }
  return (
    <div className={`py-20 px-4 max-w-6xl mx-auto ${theme==="dark" ?  'text-white' : 'text-slate-700'}`}>
      <h1 className='text-3xl font-bold mb-4 text-slate-800'>Writify</h1>
      <p className='mb-4'>Writify is a leading blogging website that specializes in providing you the best reading and writing experience. Whether you want to gain insights on topic , want to explre information or just want to share you invaluable and exciting experiences, Writify caters to all your needs.</p>
      <p className='mb-4'>
      Our mission is to foster a community of passionate foodies, techies, travel enthusiasts and lifestyle explores who share a love for discovering new cultures and flavors and technologies.  Through engaging content, informative guides, and a vibrant online community, Writify will empower readers to embark on their own adventures around the globe.
      </p>
      <p className='mb-4'>Our team has experts from a wealth of experience and knowledge in the related industry, and we are committed to providing the highest level of service to our visitors. We believe that reading or writing content should be an exciting and rewarding experience, and we are dedicated to making that a reality for each and every one of our users.</p>
    
    </div>
  )
}
