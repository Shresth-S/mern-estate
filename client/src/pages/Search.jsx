import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BlogItem from '../components/BlogItem';

export default function Search() {
    let theme = localStorage.getItem("theme");
    if (!theme) {
        theme = "light";
    }

    const navigate = useNavigate();
    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        lifestyle: false,
        food: false,
        travel: false,
        technology: false,
        offer: false,
        sort: 'created_at',
        order:'desc',
    })

    const [loading, setLoading] = useState(false);
    const [blogs, setBlogs] = useState([]);
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const lifestyleFromUrl = urlParams.get('lifestyle');
        const foodFromUrl = urlParams.get('food');
        const travelFromUrl = urlParams.get('travel');
        const technologyFromUrl = urlParams.get('technology');
        const offerFromUrl = urlParams.get('offer');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');

        if (searchTermFromUrl || lifestyleFromUrl || foodFromUrl || travelFromUrl || technologyFromUrl || offerFromUrl || sortFromUrl || orderFromUrl) {
            //if any of them changes
            setSidebarData({
                searchTerm: searchTermFromUrl || '',
                lifestyle: lifestyleFromUrl === 'true' ? true : false,
                food: foodFromUrl === 'true' ? true : false,
                travel: travelFromUrl === 'true' ? true : false,
                technology: technologyFromUrl === 'true' ? true : false,
                offer: offerFromUrl === 'true' ? true : false,
                sort: sortFromUrl || 'created_at',
                order: orderFromUrl || 'desc',
            });
        }

        const fetchBlogs = async () => {
            setLoading(true);
            setShowMore(false);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/blog/get?${searchQuery}`);
            const data = await res.json();
            if (data.length > 8) {
                setShowMore(true);
            }else {
                setShowMore(false);
            }
            setBlogs(data);
            setLoading(false);
        }

        fetchBlogs();

    }, [location.search]);

    const handleChange = (e) => {
        if (e.target.id === 'searchTerm') {
            setSidebarData({...sidebarData, searchTerm: e.target.value})
        }

        if (e.target.id === 'lifestyle' || e.target.id === 'food' || e.target.id === 'travel' || e.target.id === 'technology') {
            setSidebarData({ ...sidebarData, [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false });
        }

        if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'created_at';

            const order = e.target.value.split('_')[1] || 'desc';

            setSidebarData({ ...sidebarData, sort, order });
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const urlParams = new URLSearchParams();

        urlParams.set('searchTerm', sidebarData.searchTerm);
        urlParams.set('lifestyle', sidebarData.lifestyle);
        urlParams.set('food', sidebarData.food);
        urlParams.set('travel', sidebarData.travel);
        urlParams.set('technology', sidebarData.technology);
        urlParams.set('sort', sidebarData.sort);
        urlParams.set('order', sidebarData.order);

        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }

    const onShowMoreClick = async () => {
        const numberOfBlogs = blogs.length;
        const startIndex = numberOfBlogs;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/blog/get?${searchQuery}`);
        const data = await res.json();
        if (data.length < 9) {
            setShowMore(false);
        }
        setBlogs([...blogs, ...data]);
    };

  return (
      <div className='flex flex-col md:flex-row'>
          <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
              <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
                  <div className="flex items-center gap-2">
                      <label className='whitespace-nowrap font-semibold'>Search Term:</label>
                      <input type="text" id='searchTerm' placeholder='Search...'
                          className='border rounded-lg p-3 w-full'
                          value={sidebarData.searchTerm} onChange={handleChange } />
                  </div>

                  <div className="flex gap-2 flex-wrap items-center">
                      <label className='font-semibold'>Related to:</label>
                      <div className="flex gap-2">
                          <input type="checkbox" id="lifestyle" className='w-5'
                            onChange={handleChange} checked={sidebarData.lifestyle} />
                          <span>Lifestyle</span>
                      </div>
                      <div className="flex gap-2">
                          <input type="checkbox" id="food" className='w-5'
                            onChange={handleChange} checked={sidebarData.food} />
                          <span>Food</span>
                      </div>
                      <div className="flex gap-2">
                          <input type="checkbox" id="travel" className='w-5'
                            onChange={handleChange} checked={sidebarData.travel} />
                          <span>Travel</span>
                      </div>
                      <div className="flex gap-2">
                          <input type="checkbox" id="technology" className='w-5'
                            onChange={handleChange} checked={sidebarData.technology} />
                          <span>Technology</span>
                      </div>
                  </div>
                  <div className='flex items-center gap-2'>
                      <label className='font-semibold'>Sort:</label>
                      <select onChange={handleChange} defaultValue={'created_at_desc'} id="sort_order" className='border rounded-lg p-3'>
                          <option value={'createdAt_desc'}>Latest</option>
                          <option value={'createdAt_asc'}>Oldest</option>
                      </select>
                  </div>
                  <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Search</button>
              </form>
          </div> 

          <div className="flex-1">
              <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>
                  Blog results:
              </h1>
              <div className="p-7 flex flex-wrap gap-4">
                  {!loading && blogs.length === 0 && (
                      <p className='text-xl text-slate-700'>No blog found!</p>
                  )}
                  {loading && (
                      <p className='text-xl text-slate-700 text-center w-full'>Loading...</p>
                  )}

                  {!loading && blogs && blogs.map((blog) => (
                          <BlogItem key={blog._id} blog={blog} />
                      ))
                  }

                  {showMore && (
                      <button onClick={onShowMoreClick}
                        className='text-green-700 hover:underline p-7'>
                        Show more
                       </button>
                  )}
              </div>
          </div> 
      </div>
  )
}
