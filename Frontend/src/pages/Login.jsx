import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../Context/Context';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const { setUser, setUsers } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUsers(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem('user');
      }
    }
  }, [setUsers]);

  const onSubmit = async (data) => {
    try {
      // Check for correct API endpoint
      const response = await axios.post('http://localhost:3000/user/login', data);
      
      // Extract token and user data from response
      const { token, user } = response.data;
      
      if (!token) {
        throw new Error('Invalid token received');
      }
      
      // Store token as a string (not as JSON)
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set token in user state
      setUser({ token });
      setUsers(user);
      
      toast.success('Login successful');
      navigate('/');
      reset();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials or server connection.';
      toast.error(errorMessage);
      console.error('Login Error:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#002970]">Welcome Back!</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#002970]">Email</label>
            <input type="email" id="email" {...register('email', { required: 'Email is required' })} 
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#00baf2] focus:border-[#00baf2]" />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#002970]">Password</label>
            <input type="password" id="password" {...register('password', { required: 'Password is required' })} 
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#00baf2] focus:border-[#00baf2]" />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>
          <button type="submit" className="w-full bg-[#00baf2] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#002970] transition-all">
            Login
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{' '}
          <Link to='/signup' className='text-[#00baf2]'>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
