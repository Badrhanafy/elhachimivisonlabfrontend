// pages/admin/Login.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../logo_elhachimilab_finly-01.png'
import { 
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  CheckCircle,
  Loader2,
  Shield,
  Sparkles,
  ArrowRight,
  X
} from 'lucide-react';
import axios from 'axios';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_BASE = process.env.REACT_APP_API_URL || 'https://server.elhachimivisionlab.com/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await axios.post(`${API_BASE}/admin/login`, {
        email,
        password
      });

      if (response.data.success) {
        localStorage.setItem('admin_token', response.data.token);
        localStorage.setItem('admin_user', JSON.stringify(response.data.user));
        
        setSuccess('Login successful! Redirecting...');
        
        setTimeout(() => {
          window.location.href = '/admin/dashboard';
        }, 1500);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message || 
        'Invalid email or password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Pure Dark Background */}
      <div className="fixed inset-0 bg-black" />
      
      {/* Animated Glassmorphism Elements - Green & Yellow */}
      <div className="fixed inset-0 overflow-hidden">
        {/* Large moving yellow-green blurry shape */}
        <motion.div
          animate={{
            x: [0, 150, -80, 0],
            y: [0, -120, 100, 0],
            scale: [1, 1.3, 0.8, 1],
            rotate: [0, 45, -30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-10 -left-20 w-[600px] h-[600px] bg-[#B8E601]/15 rounded-full blur-3xl"
        />
        
        {/* Second moving element - more yellow */}
        <motion.div
          animate={{
            x: [0, -180, 120, 0],
            y: [0, 150, -100, 0],
            scale: [1, 0.7, 1.4, 1],
            rotate: [0, -60, 45, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
            delay: 2
          }}
          className="absolute bottom-20 -right-20 w-[700px] h-[700px] bg-[#B8E601]/10 rounded-full blur-3xl"
        />
        
        {/* Third element - greenish tint */}
        <motion.div
          animate={{
            x: [0, 200, -150, 0],
            y: [0, -80, 120, 0],
            scale: [1, 1.2, 0.9, 1],
            rotate: [0, 30, -45, 0],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "linear",
            delay: 1
          }}
          className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[#B8E601]/20 rounded-full blur-3xl"
        />
        
        {/* Fourth element - subtle movement */}
        <motion.div
          animate={{
            x: [0, -100, 180, 0],
            y: [0, 100, -150, 0],
            scale: [1, 1.1, 0.7, 1],
            rotate: [0, -45, 60, 0],
          }}
          transition={{
            duration: 32,
            repeat: Infinity,
            ease: "linear",
            delay: 3
          }}
          className="absolute bottom-1/4 left-1/3 w-[450px] h-[450px] bg-[#B8E601]/5 rounded-full blur-3xl"
        />
      </div>

      {/* Main Container - Centered and Compact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-sm z-10"
      >
        {/* Glassmorphism Card */}
        <div className="relative p-[2px] rounded-2xl overflow-hidden">
          {/* Subtle Gradient Border */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#B8E601]/5 to-transparent opacity-30" />
           {/* Rotating Gradient Border */}
  <div className="absolute inset-0 animate-spin-slow bg-[conic-gradient(from_0deg,#B8E601,transparent,#B8E601)]" />
   {/* Card */}
  <div className="relative backdrop-blur-xl bg-black/90 rounded-2xl shadow-2xl overflow-hidden">
          {/* Inner Glow */}
          <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(184,230,1,0.03)]" />

          {/* Content */}
          <div className="relative z-10 p-6">
            {/* Logo & Header */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-6"
            >
              {/* Logo Container with Yellow-Green Glow */}
              <div className="relative inline-block mb-4">
                {/* Animated Glow Effect */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-[#B8E601]/30 rounded-full blur-xl"
                />
                
                {/* Logo */}
                <div className="relative w-20 h-20 mx-auto group">
                  <div className="absolute inset-0 bg-black border fstbg border-[#B8E601] group-hover:rotate-0 rounded-xl rotate-12  transform-gpu" />
                  <div className="absolute inset-0 bg-black rounded-xl sgndbg -rotate-3 transform-gpu border border-black" />
                  <div className="relative w-full h-full bg-black border border-[#B8E601] to-[#B8E601]/70 rounded-xl flex items-center justify-center shadow-xl">
                    <img src={logo} alt="dd" srcset="" />
                  </div>
                </div>
              </div>

              <h1 className="text-2xl font-bold text-white mb-1">
                Admin Access
              </h1>
              <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3 text-[#B8E601]" />
                Sign in to dashboard
                <Sparkles className="w-3 h-3 text-[#B8E601]" />
              </p>
            </motion.div>

            {/* Messages */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-start gap-2"
                >
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-rose-400 flex-1">{error}</p>
                  <button 
                    onClick={() => setError('')}
                    className="text-rose-400/50 hover:text-rose-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              )}

              {success && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-3 bg-[#B8E601]/10 border border-[#B8E601]/20 rounded-lg flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4 text-[#B8E601]" />
                  <p className="text-xs text-[#B8E601] flex-1">{success}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-500">
                  Email
                </label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Mail className="w-4 h-4 text-gray-600 group-focus-within:text-[#B8E601] transition-colors" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-black/40 border border-white/5 rounded-lg focus:border-[#B8E601]/30 focus:outline-none text-sm text-white placeholder-gray-700 transition-all"
                    placeholder="admin@example.com"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-500">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Lock className="w-4 h-4 text-gray-600 group-focus-within:text-[#B8E601] transition-colors" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 bg-black/40 border border-white/5 rounded-lg focus:border-[#B8E601]/30 focus:outline-none text-sm text-white placeholder-gray-700 transition-all"
                    placeholder="••••••••"
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#B8E601] transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="relative w-full group overflow-hidden mt-2"
              >
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#B8E601] to-[#B8E601]/70 rounded-lg opacity-90 group-hover:opacity-100 transition-opacity" />
                
                {/* Button Content */}
                <div className="relative px-4 py-2.5 flex items-center justify-center gap-2 text-black font-medium text-sm">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      Sign In
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-[10px] text-gray-700">
                © 2024 El Hachimi Vision Lab
              </p>
            </div>
          </div>
        </div>
        </div>
      </motion.div>

      {/* Add X icon import if not already imported */}
      {(() => { const X = ({ className }) => null; return null; })()}
    </div>
  );
};

export default AdminLogin;