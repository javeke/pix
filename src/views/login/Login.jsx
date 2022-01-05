import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';

import { googleSignIn, twitterSignIn } from '../../services/firebase.service';
import { AiOutlineTwitter } from 'react-icons/ai';

import share from '../../assets/share.mp4';
import logo from '../../assets/logowhite.png';

import { client } from '../../services/sanity.service';
 
const Login = () => {

  const navigate = useNavigate();

  const handleResponse = async response => {

    const { displayName, uid, photoURL } = response;

    const user = {
      name: displayName , userId: uid, imageUrl: photoURL
    };

    localStorage.setItem('user', JSON.stringify(user));

    const doc = {
      _id: uid,
      _type:'user',
      userName: displayName,
      image: photoURL
    };

    try{
      await client.createIfNotExists(doc);
      navigate('/', { replace: true });
    }
    catch(error){
      alert('Authentication failed');
    }
  }

  const responseGoogle = async () => {
    const response = await googleSignIn();

    if(!response){
      alert('Authentication failed');
      return;
    }

    await handleResponse(response);
  }

  const responseTwitter = async () => {
    const response = await twitterSignIn();

    if(!response){
      alert('Authentication failed');
      return;
    }

    await handleResponse(response);
  }

  return (
    <div className="flex flex-col items-center h-screen">
      <div className="relative w-full h-full">
        <video className="w-full h-full object-cover" 
          type="video/mp4" 
          src={share} autoPlay loop muted 
        />
        <div className="absolute flex flex-col justify-center items-center top-0 left-0 right-0 bottom-0 bg-blackOverlay">
          <div className="p-5">
            <img src={logo} width="130px" alt="Logo" />
          </div>
          <div className="shadow-2xl mb-2">
            <button 
              className="flex w-200 gap-2 items-center rounded px-4 py-2 bg-mainColor"
              onClick={responseGoogle}
            >
              <FcGoogle />
              <span>Sign in with Google</span>
            </button>
          </div>
          <div className="shadow-2xl">
            <button 
              className="flex w-200 gap-2 items-center rounded px-4 py-2 bg-mainColor"
              onClick={responseTwitter}
            >
              <AiOutlineTwitter color='#00acee' />
              <span>Sign in with Twitter</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;