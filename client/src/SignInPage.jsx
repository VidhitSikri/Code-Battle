
import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', formData);
    navigate('/');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0A0C1A] relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/30 rounded-full filter blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-800/30 rounded-full filter blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md p-8 rounded-2xl backdrop-blur-xl bg-black/40 border border-blue-500/20 shadow-[0_0_40px_rgba(59,130,246,0.1)]">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-purple-500 bg-clip-text text-transparent mb-2">
            System Access
          </h1>
          <p className="text-blue-300/60 text-sm">Enter your credentials to proceed</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-blue-400/50" />
            </div>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-blue-950/20 border border-blue-500/20 rounded-lg focus:ring-2 focus:ring-blue-500/40 focus:border-transparent outline-none text-blue-100 placeholder-blue-400/50 transition-all duration-300"
              placeholder="Username"
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-blue-400/50" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-12 py-3 bg-blue-950/20 border border-blue-500/20 rounded-lg focus:ring-2 focus:ring-blue-500/40 focus:border-transparent outline-none text-blue-100 placeholder-blue-400/50 transition-all duration-300"
              placeholder="Password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-400/50 hover:text-blue-300 transition-colors duration-200"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          <button
            type="submit"
            className="cursor-pointer w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-800 hover:from-blue-700 hover:to-purple-900 text-white rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:ring-2 focus:ring-blue-500/40 font-medium"
          >
            Initialize Access
          </button>
        </form>

        <div className="mt-6 text-center text-sm space-y-2">
          <p className="text-blue-300/80">
            No account created? 
            <Link
              to="/register" 
              className="ml-2 text-blue-400 hover:text-blue-300 transition-colors duration-200 font-semibold"
            >
              Sign Up
            </Link>
          </p>
          <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors duration-200">
            Forgot access codes?
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
