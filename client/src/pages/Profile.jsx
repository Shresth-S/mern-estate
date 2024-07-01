import { useSelector } from 'react-redux'
import { useRef, useState, useEffect } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';

import { updateUserStart,updateUserFailure,updateUserSuccess, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserStart, signOutUserFailure, signOutUserSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Profile() {
  let theme = localStorage.getItem("theme");
  if (!theme) {
    theme = "light";
  }

  const fileRef = useRef(null);
  const { currentUser,loading,error } = useSelector((state) => state.user)
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setfileUploadError] = useState(false);

  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showBlogsError, setshowBlogsError] = useState(false);
  const [userBlogs, setUserBlogs] = useState([]);
  const dispatch = useDispatch();

  //firebase storage rules-
  // allow read;
  // allow write: if 
  // request.resource.size < 2*1024*1024 &&
  // request.resource.contentType.matches('image/.*')
  
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file); 
  
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log("Upload is " + progress + "% done");
        setFilePerc(Math.round(progress));
      },
    (error) => {
      setfileUploadError(true);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then
        ((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        })
      }
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(data.message));
    }
  }
  
  const handleShowBlogs = async () => {
    try {
      setshowBlogsError(false);
      const res = await fetch(`/api/user/blogs/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setshowBlogsError(true);
        return;
      }
    
      setUserBlogs(data);
    } catch (error) {
      setshowBlogsError(true);
    }
  }

  const handleBlogDelete= async (blogId) => {
    try {
      const res = await fetch(`/api/blog/delete/${blogId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserBlogs((prev) => prev.filter((blog) => blog._id !== blogId));
    }catch (error) {
      console.log(error.message);
    }
  }

  

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input onChange={(e) => setFile(e.target.files[0])}
          type="file" ref={fileRef} hidden accept='image/*' />
        <img onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar} alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-1" />
        <p className="text-sm self-center">
          {fileUploadError ?
            (<span className="text-red-700">Error Image upload (image must be less than 2mb)</span>) 
              : filePerc > 0 && filePerc < 100 ? 
                (<span className="text-slate-700">
                  {`Uploading ${filePerc}%`}
                </span>)
                :
                filePerc == 100 ?
                  (<span className="text-green-700">Image successfully uploaded!</span>)
                :
                ("")
          
          }
        </p>
        <input type="text" defaultValue={currentUser.username}
          placeholder="username" id='username'
          className="border p-3 rounded-lg" onChange={handleChange} />
        <input type="email" defaultValue={currentUser.email}
          placeholder="email" id='email'
          className="border p-3 rounded-lg" onChange={handleChange} />
        <input type="password"
          placeholder="password" id='password'
          className="border p-3 rounded-lg" onChange={handleChange} />
        <button disabled={loading} className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          {loading?'Loading...':'Update'}
        </button>
        <Link className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95' to={'/create-blog'}>
          Create Blog
        </Link>

      </form>

      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete account</span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">Sign out</span>
      </div>

      <p className='text-red-700 mt-5'> {error?error:''} </p>
      <p className='text-green-700 mt-5'> {updateSuccess?'User is updated successfully!':''} </p>
      <button onClick={handleShowBlogs} className='text-green-700 w-full'>Show blogs</button>
      <p className='text-red-700 mt-5'>
        {showBlogsError ? 'Error showing blogs' : ''}
      </p>

      
      {userBlogs && userBlogs.length > 0 &&
    
        <div className="flex flex-col gap-4">
          <h1 className='text-center mt-7 text-2xl font-semibold'>Your Blogs</h1>
          {userBlogs.map((blog) => (
            <div key={blog._id} className="border rounded-lg p-3 flex justify-between items-center gap-4">
              <Link to={`/blog/${blog._id}`}>
                <img src={blog.imageUrls[0]} alt='blog cover' className='h-16 w-16 object-contain' />
              </Link>
              <Link className='flex-1 text-slate-700 font-semibold hover:underline truncate' to={`/blog/${blog._id}`}>
                <p>{blog.name}</p>
              </Link>

              <div className='flex flex-col item-center'>
                <button onClick={()=>handleBlogDelete(blog._id)} className='text-red-700 uppercase'>Delete</button>
                <Link to={`/update-blog/${blog._id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          )
          )}
        </div>
       }
    </div>
  )
}


