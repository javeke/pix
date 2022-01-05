import { useState, useEffect } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";

import { userQuery, userCreatedPinsQuery, userSavedPinsQuery } from "../../utils/user";

import { client } from "../../services/sanity.service";
import MasonryLayout from "../core/masonry-layout/MasonryLayout";
import Spinner from "../core/spinner/Spinner";
import { firebaseAuthSignOut } from "../../services/firebase.service";

const randomImage = 'https://source.unsplash.com/720x600?render,digital-image,nature,photography,technology,architecture,computer,coding';

const activeBtnStyles = 'bg-red-500 text-white font-bold p-2 rounded-full w-20';
const notActiveBtnStyles = 'bg-primary mr-4 text-black font-bold p-2 rounded-full w-20';

const CREATED_BTN_STATE = 'Created';
const SAVED_BTN_STATE = 'Saved';

const UserProfile = ()=>{

  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState(CREATED_BTN_STATE);
  const [activeBtn, setActiveBtn] = useState(CREATED_BTN_STATE);

  const navigate = useNavigate();

  const { userId } = useParams();

  useEffect(()=>{

    const query = userQuery(userId);

    client.fetch(query)
    .then((response)=>{
      setUser(response[0]);
    })
    .catch(error=>{
      alert("Failed to get user information");
    })

  }, [userId]);

  useEffect(()=>{
    if(text === CREATED_BTN_STATE){
      const createdPinsQuery = userCreatedPinsQuery(userId);

      client.fetch(createdPinsQuery)
      .then((response)=>{
        setPins(response);
      })
      .catch((error)=>{
        alert("Unable to get pins");
      });
    }
    else{
      const savedPinsQuery = userSavedPinsQuery(userId);

      client.fetch(savedPinsQuery)
      .then((response)=>{
        setPins(response);
      })
      .catch((error)=>{
        alert("Unable to get pins");
      });;
    }
  },[text, userId]);

  const logout = async () =>{
    await firebaseAuthSignOut();
    localStorage.clear();
    navigate('/login');
  }


  if(!user) return <Spinner message="Loading profile..." />

  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img src={randomImage} className="w-full h-370 xl:h-410 shadow-lg object-cover" alt="Banner" />
            <img src={user?.image} alt="profile" 
              className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover" />
              <h1 className="font-bold text-2xl text-center mt-3">{user.userName}</h1>
              <div className="absolute top-0 z-1 right-0 p-2">
                {
                  userId === user?._id && (
                    <button 
                      className="bg-white p-2 rounded-full cursor-pointer shadow-md"
                      onClick={logout}
                    >
                      <AiOutlineLogout color="red" fontSize={21} />
                    </button>
                  )
                }
              </div>
          </div>
          <div className="text-center mt-2 mb-7">
            <button
              type="button"
              onClick={() => {
                setText(CREATED_BTN_STATE);
                setActiveBtn(CREATED_BTN_STATE);
              }}
              className={`${ activeBtn === CREATED_BTN_STATE ? activeBtnStyles : notActiveBtnStyles}`}
            >
              Created
            </button>
            <button
              type="button"
              onClick={() => {
                setText(SAVED_BTN_STATE);
                setActiveBtn(SAVED_BTN_STATE);
              }}
              className={`${ activeBtn === SAVED_BTN_STATE? activeBtnStyles : notActiveBtnStyles}`}
            >
              Saved
            </button>
          </div>
          {
            pins && pins.length ? (
              <div className="px-2">
                <MasonryLayout pins={pins} />
              </div>
            ): (
              <div className="flex justify-center items-center font-bold w-full text-lg mt-2">
                No posts found
              </div>
            )

          }
        </div>
      </div>
    </div>
  );
}

export default UserProfile;