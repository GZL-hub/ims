import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../components/Logo';
import ShaderBackground from '../components/ShaderBackground';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
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
      <div className="bg-background-50 w-full md:max-w-md lg:max-w-full md:mx-0 md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12 flex items-center justify-center">
        <div className="w-full h-100">
          <div className="flex items-center gap-2">
            <Logo size={32} />
            <h1 className="text-xl font-bold text-text-900 dark:text-white">i-IMS</h1>
          </div>

          <h1 className="text-xl md:text-2xl font-bold leading-tight mt-12 text-text-900 dark:text-white">
            Log in to your account
          </h1>

          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-4 border border-red-200">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

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
              disabled={loading}
              className="w-full block bg-primary-900 hover:bg-primary-800 focus:bg-primary-800 text-white dark:bg-primary-600 dark:hover:bg-primary-500 dark:focus:bg-primary-500 dark:text-black font-semibold rounded-lg px-4 py-3 mt-6 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <hr className="my-6 border-background-300 w-full" />

          <p className="text-center text-sm text-text-600">
            Need an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="font-semibold text-primary-700 hover:text-primary-800 focus:text-primary-800 transition-colors"
            >
              Create an account
            </button>
          </p>

          <p className="text-sm text-text-500 mt-8">SWE3024: Code Camp</p>
        </div>
      </div>
    </section>
  );
};

export default Login;