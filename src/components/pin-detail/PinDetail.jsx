import { useState, useEffect, useCallback } from "react";
import { MdDownloadForOffline } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { client, urlFor } from "../../services/sanity.service";
import MasonryLayout from "../core/masonry-layout/MasonryLayout";

import { pinDetailQuery, pinDetailMorePinQuery } from "../../utils/pin";

import Spinner from "../core/spinner/Spinner";

const PinDetail = ({ user })=>{

  const [pins, setPins] = useState(null);
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);

  const { pinId } = useParams();

  const addComment = ()=>{
    if(comment){
      setAddingComment(true);
      
      client.patch(pinId)
      .setIfMissing({
        comments : []
      })
      .insert('after', 'comments[-1]', [{
        comment,  
        _key: uuidv4(),
        postedBy: {
          _type: 'postedBy',
          _ref: user?._id
        }
      }])
      .commit()
      .then((response)=>{
        fetchPinDetails();
        setComment('');
        setAddingComment(false);
      })
      .catch((error)=>{
        alert("Failed to add comment");
        setAddingComment(false);
        setComment('');
      });
    }
  }

  const fetchPinDetails = () => {
    const query = pinDetailQuery(pinId);

    if(query){
      client.fetch(query)
      .then((response)=>{
        setPinDetail(response[0]);

        if(response[0]){

          client.fetch(pinDetailMorePinQuery(response[0]))
          .then((resp)=> setPins(resp));
        }
      })
      .catch((error)=>{
        alert("Unable to get pin details");
      })
    }
  }

  const memoFetchPinDetails = useCallback(fetchPinDetails, [pinId]);

  useEffect(()=>{
    memoFetchPinDetails();
  }, [pinId, memoFetchPinDetails]);

  if(!pinDetail) return <Spinner message="Loading pin..." />;

  return (
    <>
      <div className="flex xl:flex-row flex-col m-auto bg-white" style={{ maxWidth: '1500px', borderRadius: '32px'}}>
        <div className="flex justify-center items-center md:items-start flex-initial">
          <img 
            src={pinDetail?.image && urlFor(pinDetail.image).url()} alt="Pin" 
            className="rounded-t-3xl rounded-b-lg"
          />
        </div>
        <div className="w-full p-5 flex-1 xl:min-w-620">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <a href={`${pinDetail.image.asset.url}?dl=`} download
                onClick={(e)=>e.stopPropagation()}
                className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md"
              >
                <MdDownloadForOffline /> 
              </a>
            </div>
            <a href={pinDetail.destination} target='_blank' rel="noreferrer">
              { pinDetail?.destination.length > 45 ?  `${pinDetail?.destination.slice(0, 45)}...` : pinDetail?.destination}
            </a>
          </div>
          <div>
            <h1 className="text-3xl font-bold break-words mt-3">
              {pinDetail.title}
            </h1>
            <p className="mt-3">{pinDetail.about}</p>
            <small className="mt-3 capitalize text-xs text-gray-600">{pinDetail.category}</small>
          </div>
          <Link to={`/user-profile/${pinDetail?.postedBy?._id}`} className="flex gap-2 mt-5 items-center bg-white rounded-lg" >
            <img src={pinDetail?.postedBy?.image} alt="user profile" 
              className="w-8 h-8 rounded-full object-cover"
            />
            <p className="font-semibold capitalize">{pinDetail?.postedBy?.userName}</p>
          </Link>
          <h2 className="mt-5 text-xl">Comments</h2>
          <div className="max-h-370 overflow-y-auto">
            {
              pinDetail?.comments?.map(comment => (  
              <div key={comment} className="flex gap-2 mt-5 items-center rounded-lg bg-white">
                <Link to={`/user-profile/${comment.postedBy?._id}`}><img src={comment.postedBy.image} alt="user profile" className="w-8 h-8 rounded-full cursor-pointer" /></Link>
                <div className="flex flex-col">
                  <p className="font-semibold">{comment.postedBy.userName}</p>
                  <p className="text-sm">{comment.comment}</p>
                </div>
              </div>))
            }
          </div>
          <div className="flex flex-wrap mt-6 gap-3">
            <Link to={`/user-profile/${user?._id}`}>
              <img src={user?.image} alt="user profile" 
                className="w-10 h-10 rounded-full cursor-pointer"
              />
            </Link>
            <input type="text" className="flex-1 border-gray-100 border-2 p-2 rounded-2xl focus:border-gray-200" 
              placeholder="Add a comment"
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
            <button type="button" 
              className="bg-red-500 text-white rounded-full px-6 py-2 text-semibold text-base"
              onClick={addComment}
            >
              { addingComment ? 'Posting the comment' : 'Post'}
            </button>
          </div>
        </div>
      </div>
      {
        pins && pins.length > 0 ? (
          <>
            <h2 className="text-center font-bold text-xl mt-8 mb-4">More like this</h2>
            <MasonryLayout pins={pins} />
          </>
        )
        : (
          <Spinner message="Loading more pins" />
        )
      }
    </>
  );
}

export default PinDetail;