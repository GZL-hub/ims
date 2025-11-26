import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../components/Logo';
import ShaderBackground from '../components/ShaderBackground';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      navigate('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
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
              <h1 className="text-white text-4xl font-bold mb-6 font-geist tracking-tight">
                Join I-IMS Today
              </h1>
              <p className="text-white text-xl leading-relaxed">
                <span className="font-semibold">Create your account</span>
                <span className="font-semibold"> to access powerful inventory management tools</span>{' '}
                <span className="font-semibold">with full accessibility features</span>.
              </p>
            </div>
          </div>
        </ShaderBackground>
      </div>

      {/* Form Section */}
      <div className="bg-background-50 w-full md:max-w-md lg:max-w-full md:mx-0 md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12 flex items-center justify-center overflow-y-auto">
        <div className="w-full h-100 py-8">
          <div className="flex items-center gap-2">
            <Logo size={32} />
            <h1 className="text-xl font-bold text-text-900 dark:text-white">i-IMS</h1>
          </div>

          <h1 className="text-xl md:text-2xl font-bold leading-tight mt-12 text-text-900 dark:text-white">
            Create your account
          </h1>

          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-4 border border-red-200">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form className="mt-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-text-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="John"
                  className="w-full px-4 py-3 rounded-lg bg-background-200 text-text-900 mt-2 border border-background-300 focus:border-primary-500 focus:bg-background-50 focus:outline-none transition-colors"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-text-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Doe"
                  className="w-full px-4 py-3 rounded-lg bg-background-200 text-text-900 mt-2 border border-background-300 focus:border-primary-500 focus:bg-background-50 focus:outline-none transition-colors"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-text-700">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg bg-background-200 text-text-900 mt-2 border border-background-300 focus:border-primary-500 focus:bg-background-50 focus:outline-none transition-colors"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="mt-4">
              <label className="block text-text-700">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter Password"
                minLength={6}
                className="w-full px-4 py-3 rounded-lg bg-background-200 text-text-900 mt-2 border border-background-300 focus:border-primary-500 focus:bg-background-50 focus:outline-none transition-colors"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="mt-4">
              <label className="block text-text-700">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                minLength={6}
                className="w-full px-4 py-3 rounded-lg bg-background-200 text-text-900 mt-2 border border-background-300 focus:border-primary-500 focus:bg-background-50 focus:outline-none transition-colors"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full block bg-primary-900 hover:bg-primary-800 focus:bg-primary-800 text-white dark:bg-primary-600 dark:hover:bg-primary-500 dark:focus:bg-primary-500 dark:text-black font-semibold rounded-lg px-4 py-3 mt-6 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-8 text-text-900">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary-500 hover:text-primary-700 font-semibold transition-colors"
            >
              Log in
            </Link>
          </p>

          <p className="text-sm text-text-500 mt-12">&copy; 2025 i-IMS - All Rights Reserved.</p>
        </div>
      </div>
    </section>
  );
};

export default Register;
