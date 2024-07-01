import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import BlogItem from '../components/BlogItem';

export default function Home() {
    let theme = localStorage.getItem("theme");
    if (!theme) {
        theme = "light";
    }

    const [travelBlogs, settravelBlogs] = useState([]);
    const [technologyBlogs, settechnologyBlogs] = useState([]);
    const [lifestyleBlogs, setlifestyleBlogs] = useState([]);
    const [foodBlogs, setfoodBlogs] = useState([]);
    SwiperCore.use([Navigation]);

    useEffect(() => {
        const fetchTravelBlogs = async () => {
            try {
                const res = await fetch('/api/blog/get?travel=true&limit=4');
                const data = await res.json();
                settravelBlogs(data);
                fetchFoodBlogs();
            } catch (error) {
                console.log(error);
           }
        }

        const fetchTechnologyBlogs = async () => {
            try {
                const res = await fetch('/api/blog/get?technology=true&limit=4');
                const data = await res.json();
                settechnologyBlogs(data);
            } catch (error) {
                console.log(error);
           }
        }

        const fetchLifestyleBlogs = async () => {
            try {
                const res = await fetch('/api/blog/get?lifestyle=true&limit=4');
                const data = await res.json();
                setlifestyleBlogs(data);
                fetchTravelBlogs();
            } catch (error) {
                console.log(error);
           }
        }

        const fetchFoodBlogs = async () => {
            try {
                const res = await fetch('/api/blog/get?food=true&limit=4');
                const data = await res.json();
                fetchTechnologyBlogs();
                setfoodBlogs(data);
            } catch (error) {
                console.log(error);
           }
        }

        fetchLifestyleBlogs();
    },[])

    return (
        <div>
            {/* top */}
            <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
                <h1 className='var(--text_color) font-bold text-3xl lg:text-6xl'>
                    Write your next <span className={`${theme==="dark" ?  'text-white' : 'text-slate-500'}`}>engaging</span>
                    <br />
                    Blog with ease
                </h1>
                <div className={`text-xs sm:text-sm ${theme==="dark" ?  'text-white' : 'text-gray-400'}`}>
                    Writify is the best place to share your experiences with the world!!.
                    <br />
                    We have a wide range of interests for you to explore from.
                </div>
                <Link to={"/search"} className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'>
                    Let's get started...
                </Link>
            </div>

            
            <Swiper navigation>
                {
                    travelBlogs && travelBlogs.length > 0 && 
                    travelBlogs.map((blog) => (
                        <SwiperSlide>
                            <div style={{ background: `url(${blog.imageUrls[0]}) center no-repeat`,backgroundSize:"cover" }}
                                className='h-[540px]' key={blog._id}>
                            </div>
                        </SwiperSlide>
                    ))
                }
            </Swiper>

            <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
                
                {travelBlogs && travelBlogs.length > 0 && (
                    <div className="my-3">
                        <div className="">
                            <h2 className={`text-2xl font-semibold ${theme==="dark" ?  'text-white' : 'text-slate-600'}`}
                            >Recent Travel Blogs</h2>
                            <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>
                                Show more travel Blogs
                            </Link>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            {travelBlogs.map((blog) => (
                                <BlogItem blog={blog} key={blog._id} />
                            ))}
                        </div>
                    </div>
                )
                }

                {technologyBlogs && technologyBlogs.length > 0 && (
                    <div className="my-3">
                        <div className="">
                            <h2 className={`text-2xl font-semibold ${theme === "dark" ? 'text-white' : 'text-slate-600'}`}>
                                Recent Tech Blogs
                            </h2>
                            <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>
                            Show more tech Blogs
                            </Link>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            {technologyBlogs.map((blog) => (
                                <BlogItem blog={blog} key={blog._id} />
                            ))}
                        </div>
                    </div>
                )
                }

                {foodBlogs && foodBlogs.length > 0 && (
                    <div className="my-3">
                        <div className="">
                            <h2 className={`text-2xl font-semibold ${theme === "dark" ? 'text-white' : 'text-slate-600'}`}>
                                Recent Food Blogs
                            </h2>
                            <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>
                            Show more food Blogs
                            </Link>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            {foodBlogs.map((blog) => (
                                <BlogItem blog={blog} key={blog._id} />
                            ))}
                        </div>
                    </div>
                )
                }

                {lifestyleBlogs && lifestyleBlogs.length > 0 && (
                    <div className="my-3">
                        <div className="">
                            <h2 className={`text-2xl font-semibold ${theme==="dark" ?  'text-white' : 'text-slate-600'}`}>
                                Recent Travel Blogs
                            </h2>
                            <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>
                            Show more lifestyle Blogs
                            </Link>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            {lifestyleBlogs.map((blog) => (
                                <BlogItem blog={blog} key={blog._id} />
                            ))}
                        </div>
                    </div>
                )
                }

                {/* {rentBlogs && rentBlogs.length > 0 && (
                    <div className="my-3">
                        <div className="">
                            <h2 className='text-2xl font-semibold text-slate-600'>Recent places for rent</h2>
                            <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>
                                Show more places for rent
                            </Link>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            {rentBlogs.map((blog) => (
                                <BlogItem blog={blog} key={blog._id} />
                            ))}
                        </div>
                    </div>
                )
                }

                {saleBlogs && saleBlogs.length > 0 && (
                    <div className="my-3">
                        <div className="">
                            <h2 className='text-2xl font-semibold text-slate-600'>Recent places for sale</h2>
                            <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>
                                Show more places for sale
                            </Link>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            {saleBlogs.map((blog) => (
                                <BlogItem blog={blog} key={blog._id} />
                            ))}
                        </div>
                    </div>
                )
                } */}
            </div>
        </div> 
    );
}
