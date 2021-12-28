import { client, urlFor } from "../../../services/sanity.service";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';

const Pin = ({ pin })=>{

   const [postHovered, setPostHovered] = useState(false);
   const [savingPost, setSavingPost] = useState(false);
   const navigate = useNavigate();

  return <div className="m-2">
    <div 
      onMouseEnter={()=>setPostHovered(true)}
      onMouseLeave={()=>setPostHovered(false)}
      onClick={()=> navigate(`/pin-detail/${pin._id}`)}
      className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
    >
        <img src={urlFor(pin.image).width(250).url()} alt="Pin" className="rounded-lg w-full" />
        { postHovered && (
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
            </div>
          </div>
        )}
    </div>
  </div>;
}

export default Pin;