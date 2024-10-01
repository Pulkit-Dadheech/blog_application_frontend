import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { useState } from 'react';
import Footer from "../components/Footer";
import { URL } from '../url';

const Register = () => {
  const [username,setUsername] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState(false);
  const [errorMessage,setErrorMessage] = useState("");
  const navigate = useNavigate();
  
  const handleRegister=async()=>{
    setErrorMessage('');
    try{
      const res = await axios.post(URL+'/api/auth/register', {username,email,password});
      setUsername(res.data.username);
      setEmail(res.data.email);
      setPassword(res.data.password);
      setError(false);
      navigate("/login");
    }catch(e){
      setError(true);
      if (e.response && e.response.status === 400) {
        setErrorMessage(e.response.data.message); 
      } else {
        setErrorMessage('An unexpected error occurred.');
      }
    }
  }
  return (
    <>
    <div className='flex items-center justify-between px-6 md:px-[200px] py-4 md:py-2'>
        <h1 className='text-lg md:text-xl font-extrabold'><Link to='/'>Blog Market</Link></h1>
        <h3><Link to="/login">Login</Link></h3>
    </div>
    <div className='w-full flex justify-center items-center h-[80vh]'> 
      <div className='flex flex-col justify-center items-center space-y-4 w-[80%] md:w-[25%]'>
        <h1 className='text-xl font-bold text-left'>Create an account</h1>
        <input value={username} onChange={(e)=>setUsername(e.target.value)} className='w-full py-2 px-4 outline-none border-black border-2' type='text' placeholder='Enter your Username'/>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} className='w-full py-2 px-4 outline-none border-black border-2' type='email' placeholder='Enter your email'/>
        <input value={password} onChange={(e)=>setPassword(e.target.value)} className='w-full py-2 px-4 outline-none border-black border-2' type={'password'} placeholder='Enter your password'/>
        <button onClick={handleRegister} className='w-full px-4 py-4 text-lg font-bold text-white bg-black rounded-lg hover:bg-gray-600 hover:text-black'>Register</button>
        {error && <h3 className='text-red-500'>{errorMessage}</h3>}
        <div className='flex justify-center items center space-x-4'>
            <p>Already have an account?</p>
            <p className='text-gray-500 hover:text-black'><Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  )
}

export default Register
