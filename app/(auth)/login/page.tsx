"use client"
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button, Box, Typography } from '@mui/material';
import { toast } from 'react-toastify';

const loginSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});
type LoginSchema=  z.infer<typeof loginSchema>
const LoginPage = () => {
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues:{
        password:""
    }
  });

  const onSubmit = (data:LoginSchema) => {
    toast.success('Login successful!');
    // Handle login logic
  };

  return (
<div className="h-screen flex items-center justify-center bg-gradient-to-r from-[#ff4b2b] to-[#ff416c]">
      <div className="bg-white bg-opacity-20 backdrop-blur-lg p-10 rounded-xl shadow-xl max-w-sm mx-auto transform transition hover:scale-105 duration-300">
        <h2 className="text-4xl font-extrabold text-center text-white mb-6">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="password"
                className="w-full px-4 py-2 bg-transparent border border-white text-white rounded-md placeholder-white focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
                placeholder="Enter Password"
              />
            )}
          />
          <Button
            type="submit"
            className="w-full py-3 text-white bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-lg shadow-md hover:from-purple-500 hover:to-red-600 transition transform hover:-translate-y-1 duration-500"
          >
            Login
          </Button>
        </form>
        <div className="text-center mt-4">
          <a href="#" className="text-white hover:underline">Forgot password?</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
