import { NavLink, Link, useNavigate } from "react-router-dom";
import { RiHomeFill } from 'react-icons/ri';

import logo from '../../../assets/logo.png';
import { categories } from '../../../utils/category';

const SideBar = ({ user, closeToggle })=>{

  const isNotActiveStyle = "flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize"; 
  const isActiveStyle = "flex items-center px-5 gap-3 font-extrabold border-r-2 border-black transition-all duration-200 ease-in-out capitalize"; 

  const handleCloseSideBar = ()=>{
    !!closeToggle && closeToggle(false);
  }

  const navigate = useNavigate();

  const forceLogout = async () =>{
    localStorage.clear();
    navigate('/login');
  }

  return (
    <div className="flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-210 hide-scrollbar">
      <div className="flex flex-col">
        <Link to="/" className="flex p-5 gap-2 my-6 pt-1 w-190 items-center" onClick={()=>handleCloseSideBar()}>
          <img src={logo} alt="Logo" className="w-full" />
        </Link>
        <div className="flex flex-col gap-5">
          <NavLink
           to="/"
           className={({ isActive })=> isActive ? isActiveStyle : isNotActiveStyle }
           onClick={handleCloseSideBar}
          >
            <RiHomeFill />
            Home
          </NavLink>
          <h3 className="mt-3 px-5 text-base">Discover categories</h3>
          { categories.slice(0, categories.length-1).map((category)=> (
              <NavLink 
                to={`/category/${category.name}`}
                className={({ isActive })=> isActive ? isActiveStyle : isNotActiveStyle }
                onClick={handleCloseSideBar}
                key={category.name}
              >
                <img src={category.image} alt={category.name} className="w-8 h-8 rounded-full shadow-sm" />
                {category.name}
              </NavLink>
            )
          )}
        </div>
      </div>
      {user && (
        <Link 
          to={`user-profile/${user._id}`}
          className="flex mt-5 pb-3 gap-2 items-center bg-white rounded-lg shadow-lg mx-3"
          onClick={handleCloseSideBar}
        >
          <img src={user.image} alt="Profile" className="w-10 h-10 rounded-full" />
          <p>{user.userName}</p>
        </Link>
      )}

      {
        !user.userId && (
          <button 
            type="button"
            className="flex my-5 p-3 text-white gap-2 items-center bg-red-500 rounded-lg shadow-lg mx-3"
            onClick={async ()=> {
              handleCloseSideBar();
              await forceLogout();
            }}
          >
            Logout
        </button>
        )
      }
    </div>
  );
}

export default SideBar;