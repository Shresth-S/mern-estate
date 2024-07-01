import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import About from './pages/About';
import Profile from './pages/Profile';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import UpdateBlog from './pages/UpdateBlog';
import Blog from './pages/Blog';
import Search from './pages/Search';
import CreateBlog from './pages/CreateBlog';

export default function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path='/search' element={<Search/>}/>
        <Route path="/blog/:blogId" element={<Blog />} />
        
        <Route element={<PrivateRoute />} >
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-blog" element={<CreateBlog />} />
          <Route path="/update-blog/:blogId" element={<UpdateBlog />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

