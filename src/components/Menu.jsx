import React, { useContext } from 'react'
import { Link} from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { URL } from '../url';
import axios from 'axios';

const Menu = () => {
    const {user,setUser} = useContext(UserContext);

    const handleLogout=async()=>{
      try{
        const res = await axios.get(URL+"/api/auth/logout",{withCredentials: true});
        setUser(null)
      }
      catch(e){
        console.log("logout error!! please try again");
      }
    }
  return (
    <div className='bg-gray-100 z-10 w-[200px] flex flex-col items-start absolute top-12 right-6 rounded-md p-3 md:right-32 shadow-md'>
       {!user && <h3 className='text-black font-semibold text-sm p-2 hover:text-gray-500 cursor-pointer'><Link to={"/login"}>Login</Link></h3>}
       {!user && <h3 className='text-black font-semibold text-sm p-2 hover:text-gray-500 cursor-pointer'><Link to={"/register"}>Register</Link></h3>}
       {user && <h3 className='text-black font-semibold text-sm p-2 hover:text-gray-500 cursor-pointer'><Link to={"/profile/"+user._id}>Profile</Link></h3>}
       {user && <h3 className='text-black font-semibold text-sm p-2 hover:text-gray-500 cursor-pointer'><Link to={"/write"}>Write</Link></h3>}
       {user && <h3 className='text-black font-semibold text-sm p-2 hover:text-gray-500 cursor-pointer' ><Link to={"/myblogs/"+user._id}>My blogs</Link></h3>}
       {user && <h3 onClick={handleLogout} className='text-black font-semibold text-sm p-2 hover:text-gray-500 cursor-pointer'>Logout</h3>}
    </div>
  )
}

export default Menu;