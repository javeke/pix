import { useState, useRef, useEffect } from 'react';
import { HiMenu } from 'react-icons/hi';
import { AiFillCloseCircle } from 'react-icons/ai';

import { Link, Route, Routes } from 'react-router-dom';

import SideBar from "../../components/navigation/sidebar/SideBar";
import UserProfile from "../../components/user-profile/UserProfile";
import Pins from "../../components/pins/Pins";

import { client } from '../../services/sanity.service';
import logo from '../../assets/logo.png';

import { userQuery } from "../../utils/user";

const Home = () => {

  const [toggleSideBar, setToggleSideBar] =  useState(false);
  const [user, setUser] = useState(null);

  const scrollRef = useRef(null);

  useEffect(()=>{
    const profile = localStorage.getItem('user') === undefined ? localStorage.clear() : JSON.parse(localStorage.getItem('user'));

    const query = userQuery(profile?.googleId);

    client.fetch(query)
    .then((response)=>setUser(response[0]))
    .catch((error)=> alert("Please login again"));

  }, []);

  useEffect(()=>{
    scrollRef.current.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out">
      <div className="hidden md:flex h-screen flex-initial">
        <SideBar user={user && user} />
      </div>
      <div className="flex md:hidden flex-row">

        <div className="p-2 w-full flex flex-row justify-between items-center shadow-md">
          <HiMenu fontSize={40} className="cursor-pointer" onClick={()=>setToggleSideBar(true)}/>
          <Link to='/'>
            <img src={logo} alt="logo" className="w-28"/>
          </Link>
          <Link to={`user-profile/${user?._id}`}>
            <img src={user?.image} alt="profile" className="w-12 rounded-lg"/>
          </Link>
        </div>

        {toggleSideBar && (
          <div className="fixed bg-white w-4/5 h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
            <div className="absolute w-full flex justify-end items-center p-2">
              <AiFillCloseCircle fontSize={30} className="cursor-pointer" onClick={()=>setToggleSideBar(false)}/>
            </div>
            <SideBar user={user && user} closeToggle={setToggleSideBar} />
          </div>
        )}
      </div>
      <div className="pb-2 flex-1 h-screen overflow-y-scroll" ref={scrollRef}>
        <Routes>
          <Route path="/user-profile/:userId" element={<UserProfile />}/>
          <Route path="/*" element={<Pins user={user && user}/>}/>
        </Routes>
      </div>
    </div>
  );
}

export default Home;