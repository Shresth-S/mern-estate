import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { useSelector } from 'react-redux';
import { FaBath, FaBed, FaChair, FaMap, FaMapMarked, FaMapMarkedAlt, FaParking, FaShare,FaPenFancy } from 'react-icons/fa';
import {GiCommercialAirplane } from 'react-icons/gi';
import {GrTechnology } from 'react-icons/gr';
import { IoFastFoodOutline } from 'react-icons/io5';
import { MdOutlineSportsSoccer } from "react-icons/md";

import Contact from '../components/Contact';

export default function Blog() {
    let theme = localStorage.getItem("theme");
    if (!theme) {
        theme = "light";
    }

    SwiperCore.use([Navigation]);
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);
    const [contact, setContact] = useState(false);
    const params = useParams();
    const {currentUser} = useSelector((state)=>state.user);
    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/blog/get/${params.blogId}`);
                const data = await res.json();
                if (data.success === false) {
                    setError(true);
                    setLoading(false);
                    return;
                }
                setBlog(data);
                setLoading(false);
                setError(false);
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        };
        fetchBlog();
    }, [params.blogId]);
    
  return (
      <main>
            {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
            {error && <p className='text-center my-7 text-2xl'>Something went wrong!</p>}
            {blog && !loading && !error && (
              <div>
                  <Swiper navigation>
                      {blog.imageUrls.map((url) => (
                          <SwiperSlide key={url}>
                              <div className='h-[480px]'
                                style={{ background: `url(${url}) center no-repeat` ,backgroundSize:'cover'}}></div>
                          </SwiperSlide>
                      ))}
                  </Swiper>
                
                  <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
                      <FaShare
                          className='text-slate-500'
                          onClick={() => {
                              navigator.clipboard.writeText(window.location.href);
                              setCopied(true);
                              setTimeout(() => {
                                  setCopied(false);
                              }, 2000);
                          }}
                      />                          
                  </div>
                  {copied && (
                      <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
                          Link copied!
                      </p>
                  )}

                  <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
                      <p className={`items-center mt-6 font-semibold flex gap-4 ${theme==="dark" ?  'text-white' : 'text-slate-600'}`}>
                          <FaPenFancy className='text-green-700' />
                          by-   {blog.author}
                      </p>

                      <div className='flex gap-4'>
                          
                      </div>
                      <p className={`${theme==="dark" ?  'text-white' : 'text-slate-800'}`}>
                            <span className='font-semibold text-black'>
                                Description{' '}
                            </span> <br />
                            <div className='text-lg'>
                                {blog.description}
                            </div>
                        </p>
                      <ul className={`font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6 ${theme==="dark" ?  'text-slate-200' : 'text-green-900'}`}>
                          {blog.travel && (<li className='flex items-center gap-1 whitespace-nowrap'>
                              <GiCommercialAirplane className='text-lg' />
                              {blog.travel ? 'Travel' : ``}
                          </li>)}
                          {blog.technology && (<li className='flex items-center gap-1 whitespace-nowrap'>
                              <GrTechnology className='text-lg' />
                              {blog.technology ? 'Technology' : ``}
                          </li>)}
                          {blog.lifestyle && (<li className='flex items-center gap-1 whitespace-nowrap'>
                              <MdOutlineSportsSoccer className='text-lg' />
                              {blog.lifestyle ? 'Lifestyle' : ``}
                          </li>)}
                          {blog.food && (<li className='flex items-center gap-1 whitespace-nowrap'>
                              <IoFastFoodOutline className='text-lg' />
                              {blog.food ? 'Food' : ``}
                          </li>)}
                      </ul>
                    
                      {currentUser && blog.userRef !== currentUser._id && !contact && (
                            <button onClick={()=>setContact(true)} className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'>
                                Contact Author
                            </button>
                      )}

                      {contact && <Contact blog={blog} />}

                  </div>
                  
              </div>
            )}
      </main>
  )
}


