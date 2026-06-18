import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Props/Button';
import {IoIosLogOut} from "react-icons/io";

const Logout = () => {
    const navigate = useNavigate();
    
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        navigate("/login", { replace: true });
    };

  return (
    <>
      <IoIosLogOut
        onClick={handleLogout}
        label="Logout"
        className='text-2xl text-green-700 hover:text-red-500 transition"'
      />
    </>
  );
}

export default Logout;
