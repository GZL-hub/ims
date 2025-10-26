import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import JapaneseLogo from '../components/JapaneseLogo';
import ShaderBackground from '../components/ShaderBackground';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual authentication logic
    console.log('Login attempt:', { email, password });
    // For now, redirect to dashboard after form submission
    navigate('/dashboard');
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth login
    console.log('Google login clicked');
  };

  return (
    <section className="flex flex-col md:flex-row h-screen items-center">
      {/* Shader Section */}
      <div className="hidden lg:block w-full md:w-1/2 xl:w-2/3 h-screen relative">
        <ShaderBackground>
          <div className="flex items-center h-full px-6">
            <div className="text-background-50 text-left px-8">
              <h1 className=" text-white text-4xl font-bold mb-6 font-geist tracking-tight">
                I-IMS: Inclusive Inventory Management System
              </h1>
              <p className="text-white text-xl leading-relaxed">
                <span className="font-semibold"> Access your inventory dashboard,</span>
                <span className="font-semibold"> monitor stock levels, </span> {' '}
                <span className="font-semibold">and manage operations with full accessibility</span>.
              </p>
            </div>
          </div>
        </ShaderBackground>
      </div>

      {/* Form Section */}
      <div className="bg-background-50 w-full md:max-w-md lg:max-w-full md:mx-auto md:mx-0 md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12 flex items-center justify-center">
        <div className="w-full h-100">
          <div className="flex items-center gap-2">
            <JapaneseLogo className="text-primary-600" size={32} />
            <h1 className="text-xl font-bold text-text-900">i-IMS</h1>
          </div>

          <h1 className="text-xl md:text-2xl font-bold leading-tight mt-12 text-text-900">
            Log in to your account
          </h1>

          <form className="mt-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-text-700">Email Address</label>
              <input
                type="email"
                placeholder="Enter Email Address"
                className="w-full px-4 py-3 rounded-lg bg-background-200 text-text-900 mt-2 border border-background-300 focus:border-primary-500 focus:bg-background-50 focus:outline-none transition-colors"
                autoFocus
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mt-4">
              <label className="block text-text-700">Password</label>
              <input
                type="password"
                placeholder="Enter Password"
                minLength={6}
                className="w-full px-4 py-3 rounded-lg bg-background-200 text-text-900 mt-2 border border-background-300 focus:border-primary-500 focus:bg-background-50 focus:outline-none transition-colors"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="text-right mt-2">
              <a
                href="#"
                className="text-sm font-semibold text-text-700 hover:text-primary-700 focus:text-primary-700 transition-colors"
              >
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full block bg-primary-500 hover:bg-primary-400 focus:bg-primary-400 text-background-50 font-semibold rounded-lg px-4 py-3 mt-6 transition-colors"
            >
              Log In
            </button>
          </form>

          <hr className="my-6 border-background-300 w-full" />

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full block bg-background-50 hover:bg-background-200 focus:bg-background-200 text-text-900 font-semibold rounded-lg px-4 py-3 border border-background-300 transition-colors"
          >
            <div className="flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                className="w-6 h-6"
                viewBox="0 0 48 48"
              >
                <defs>
                  <path
                    id="a"
                    d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
                  />
                </defs>
                <clipPath id="b">
                  <use xlinkHref="#a" overflow="visible" />
                </clipPath>
                <path clipPath="url(#b)" fill="#FBBC05" d="M0 37V11l17 13z" />
                <path clipPath="url(#b)" fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V0H0z" />
                <path clipPath="url(#b)" fill="#34A853" d="M0 37l30-23 7.9 1L48 0v48H0z" />
                <path clipPath="url(#b)" fill="#4285F4" d="M48 48L17 24l-4-3 35-10z" />
              </svg>
              <span className="ml-4">Log in with Google</span>
            </div>
          </button>

          <p className="mt-8 text-text-900">
            Need an account?{' '}
            <a
              href="#"
              className="text-primary-500 hover:text-primary-700 font-semibold transition-colors"
            >
              Create an account
            </a>
          </p>

          <p className="text-sm text-text-500 mt-12">&copy; 2025 i-IMS - All Rights Reserved.</p>
        </div>
      </div>
    </section>
  );
};

export default Login;
