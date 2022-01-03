import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import Login from './views/login/Login';
import Home from './views/home/Home';
import { fetchUser } from './utils/user';

function App() { 
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(()=>{

    const profileString = fetchUser();

    if(!profileString || profileString === 'undefined'){
      navigate('/login', { replace: true });
    }

    if(profileString && location.pathname === '/login'){
      navigate('/', { replace: true });
    }

  }, [location.pathname, navigate])

  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="/*" element={<Home />} />
    </Routes>
  );
}

export default App;
