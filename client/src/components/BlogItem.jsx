import React from 'react';
import { Link } from 'react-router-dom';
import {FaPenFancy } from 'react-icons/fa';

export default function BlogItem({ blog }) {
    let theme = localStorage.getItem("theme");
    if (!theme) {
        theme = "light";
    }
  return (
      <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]'>
          <Link to={`/blog/${blog._id}`}>
              <img src={blog.imageUrls[0]}
                  alt="blog cover"
                  className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-150'
              />

              <div className='p-3 flex flex-col gap-2 w-full'>
                  {/* truncate to remove extra spaces */}
                  <p className='truncate text-lg font-semibold text-slate-700'>{blog.name}</p>
                  <div className="flex items-center gap-1">
                      <FaPenFancy className='h-4 w-4 text-green-700'/>
                      <p className={`text-white truncate text-sm w-full ${theme==="dark" ?  'text-white' : 'text-gray-600'}`}>{blog.author}</p>
                  </div>
                  <p className='line-clamp-2 text-slate-600'>
                      {blog.description}
                  </p>

                  <div className='flex gap-4 text-slate-700'>
                      {blog.technology && (<div className='font-bold text-xs'>
                          Technology
                      </div>)}

                      {blog.travel && (<div className='font-bold text-xs'>
                          Travel
                      </div>)}

                      {blog.food && (<div className='font-bold text-xs'>
                          Food
                      </div>)}

                      {blog.lifestyle && (<div className='font-bold text-xs'>
                          Lifestyle
                      </div>)}
                  </div>
              </div>
            
              
          </Link>

      </div>
  )
}
