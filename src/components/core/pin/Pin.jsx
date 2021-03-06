import { client, urlFor } from "../../../services/sanity.service";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { isMobile } from 'react-device-detect'

import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';
import { fetchUser } from "../../../utils/user";
import { formatDateTime } from "../../../utils/funcs";

const Pin = ({ pin })=>{

  const [postHovered, setPostHovered] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const navigate = useNavigate();

  const user = fetchUser();

  const alreadySaved = !!(pin?.save?.filter((item)=>item?.postedBy?._id === user?.userId)?.length);

  const savePin = id =>{
    if(!alreadySaved){
      setSavingPost(true);
      
      client.patch(id).setIfMissing({ save: []})
      .insert('after', 'save[-1]', [{
        _key: uuidv4(),
        userId: user.userId,
        postedBy: {
          _type: 'postedBy',
          _ref: user.userId
        }
      }]).commit()
      .then(()=>{
        window.location.reload();
        setSavingPost(false);
      });
    }
  }


  const deletePin = id => {
    client.delete(id).then(_=> window.location.reload());
  }
   

  return <div className="m-2 shadow-md pb-2 rounded-md">
    <div 
      onMouseEnter={()=>setPostHovered(true)}
      onMouseLeave={()=>setPostHovered(false)}
      onTouchStart={()=>setPostHovered(true)}
      onTouchEnd={()=>setPostHovered(false)}
      onClick={()=> navigate(`/pin-detail/${pin._id}`)}
      className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
    >
        <img src={urlFor(pin.image).width(250).url()} alt="Pin" className="rounded-lg w-full" />
        { (postHovered || isMobile) && (
          <div className="absolute top-0 w-full h-full flex flex-col justify-between p-2 pl-1 z-50">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a href={`${pin.image?.asset?.url}?dl=`} 
                  download 
                  onClick={(e)=>e.stopPropagation()}
                  className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md"
                > 
                  <MdDownloadForOffline /> 
                </a>
              </div>
              {
                alreadySaved ? (
                  <button type="button" className="bg-red-500 rounded-3xl opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base hover:shadow-md">
                    {pin?.save?.length} Saved
                  </button>
                ):(
                  <button type="button" 
                    className="bg-red-500 rounded-3xl opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base hover:shadow-md"
                    onClick={(e)=>{
                      e.stopPropagation();
                      savePin(pin?._id);
                    }}
                  >
                    { savingPost ? 'Saving' : 'Save'}
                  </button>
                )
              }
            </div>
            <div className="flex justify-between items-center gap-2 w-full">
              {
                pin?.destination && (
                  <a href={pin?.destination} target="_blank" rel="noreferrer"
                    className="bg-white flex items-center gap-2 text-black py-2 px-4 rounded-full opacity:70 hover:opacity-100 hover:shadow-md"
                  >
                    <BsFillArrowUpRightCircleFill />
                    { pin?.destination.length > 15 ?  `${pin?.destination.slice(0, 15)}...` : pin?.destination}
                  </a>
                )
              }
              {
                pin?.postedBy?._id ===  user.userId && (
                  <button type="button" 
                    className="bg-white p-3 md:p-2 text-dark rounded-3xl opacity-70 hover:opacity-100 font-bold text-base hover:shadow-md"
                    onClick={(e)=>{
                      e.stopPropagation();
                      deletePin(pin?._id);
                    }}
                  >
                    <AiTwotoneDelete fontSize={ isMobile ? 21 : 16}/>
                  </button>
                )
              }
            </div>
          </div>
        )}
    </div>
    <Link to={`/user-profile/${pin?.postedBy?._id}`} className="flex flex-wrap md:gap-2 gap-3 mt-2 items-center" >
      <img src={pin?.postedBy?.image} alt="user" 
        className="w-8 h-8 rounded-full object-cover"
      />
      <p className="font-semibold capitalize">{pin?.postedBy?.userName}</p>
      <p className="ml-auto mr-3 text-xs">{formatDateTime(pin?._createdAt)}</p>
    </Link>
  </div>;
}

export default Pin;