import { Link, useNavigate } from "react-router-dom";
import { IoMdAdd, IoMdSearch } from "react-icons/io";

const NavBar = ({ searchTerm, setSearchTerm, user }) =>{

  const navigate = useNavigate();

  if(!user) return null;

  return (
    <div className="flex gap-2 md:gap-5 w-full mt-5 pb-7"> 
      <nav className="flex items-center w-full px-2 rounded-md bg-whtie focus-within:shadow-sm">
        <IoMdSearch fontSize={21} className="ml-1" />
        <input type="search" 
          onChange={(e)=> setSearchTerm(e.target.value)} 
          value={searchTerm}
          placeholder="Search"
          onFocus={()=> navigate('/search')}
          className="p-2 w-full bg-white"
        />
      </nav>
      <div className="flex gap-3">
        <Link to={`/user-profile/${user?._id}`} className="hidden md:block">
          <img src={user?.image} alt="user" className="w-14 h-12 rounded-lg" />
        </Link>
        <Link to={`/create-pin`} className="bg-gray-500 text-white rounded-lg w-12 h-12 md:w-14 flex justify-center items-center">
          <IoMdAdd fontSize={21} />
        </Link>
      </div>
    </div>
  );
}

export default NavBar;