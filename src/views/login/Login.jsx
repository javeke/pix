import GoogleLogin from 'react-google-login';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';

import share from '../../assets/share.mp4';
import logo from '../../assets/logowhite.png';

import { OAUTH_CLIENT_ID } from '../../config';

import { client } from '../../services/sanity.service';
 
const Login = () => {

  const navigate = useNavigate();

  const responseGoogle = async (response) => {
    localStorage.setItem('user', JSON.stringify(response.profileObj));

    const { name, googleId, imageUrl } = response.profileObj;

    const doc = {
      _id: googleId,
      _type:'user',
      userName: name,
      image: imageUrl
    };

    try{
      await client.createIfNotExists(doc);
      navigate('/', { replace: true });
    }
    catch(error){
      alert('Authentication failed');
    }
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
          <div className="shadow-2xl">
            <GoogleLogin 
              clientId={OAUTH_CLIENT_ID}
              render={(renderProps)=>(
                <button 
                  className="flex gap-2 items-center rounded px-4 py-2 bg-mainColor"
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                >
                  <FcGoogle />
                  <span>Sign in with Google</span>
                </button>
              )}
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy="single_host_origin"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;