import React, {useState, useEffect} from 'react';
import { Outlet} from 'react-router-dom';
import CreateUserModal from '../Components/CreateUserModal';
import Button from '../Props/Button';
import Table from '../Components/Table';
import environ from "../Utils/environment_functions";
import toast from "react-hot-toast"
import UserTable from '../Components/UserTable';

environ();

const Users = () => {
    const [open, setOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const baseUrl = import.meta.env.VITE_BACKEND_URL || "https://kms-backend-49bd.onrender.com";
    
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/users`,{
               headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              });
            const data = await response.json();
            setUsers(data);
            console.log("Users fetched successfully");
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }
    
  return (
  <div>
    <div>
      <Button
      label="New User"
      onClick={() => setOpen(true)}
      className='border rounded-xl w-30 cursor-pointer hover:bg-green-700 bg-green-500 p-3'
      />
      <Button
      label="Refresh"
      onClick={fetchUsers}
      className='border ml-2 rounded-xl w-30 cursor-pointer bg-green-500 p-3'/>
      <CreateUserModal
        open={open}
        onClose={() => (setOpen(false), fetchUsers())}  
        onUserCreated={() => toast.success("User created!")}
        />
    </div>
    <div className='mt-4'>
      <UserTable users={users} onUserUpdate={fetchUsers} />
    </div>
  </div>
  );
}

export default Users;
