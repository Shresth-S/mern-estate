import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export default function Contact({ Blog }) {
    let theme = localStorage.getItem("theme");
    if (!theme) {
        theme = "light";
    }

    const [author, setauthor] = useState(null);
    const [message, setMessage] = useState('');

    const onChange = (e) => {
        setMessage(e.target.value);
    };

    useEffect(() => {
        const fetchAuthor = async () => {
            try {
                const res = await fetch(`/api/user/${Blog.userRef}`);

                const data = await res.json();

                setauthor(data);
            }catch (error) {
                console.log(error);
            }
        }
        fetchAuthor();
    }, [Blog.userRef]);

    return (
        <>
            {author && (
                <div className='flex flex-col gap-2'>
                    <p>Contact <span className='font-semibold'>{author.username}</span> for
                        <span className='font-semibold'> {Blog.name.toLowerCase()}</span>
                    </p>
                    <textarea name="message" id="messgae" rows="2"
                        value={message} onChange={onChange} placeholder='Enter your message here...'
                    className='w-full border p-3 rounded-lg'>
                        
                    </textarea>

                    <Link to={`mailto:${author.email}?subject=Regarding${Blog.name}&body=${message}`}
                        className={`text-center p-3 uppercase rounded-lg hover:opacity-95 ${theme==="dark" ?  'bg-white text-slate-700' : 'bg-slate-700 text-white'}`}
                    >
                        Send Message
                    </Link>
                </div>
            )}
        </>
    )
}


