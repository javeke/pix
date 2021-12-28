import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import Login from './views/login/Login';
import Home from './views/home/Home';

import './App.css';

function App() { 
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(()=>{

    const profileString = localStorage.getItem('user');

    if(!profileString){
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
