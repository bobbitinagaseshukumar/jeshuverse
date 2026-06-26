import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { login, userInfo, error, loading, setError } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Clear errors on load
  useEffect(() => {
    setError(null);
  }, [setError]);

  // Destination route after login
  const from = location.state?.from?.pathname || '/';

  // Redirect if already logged in
  useEffect(() => {
    if (userInfo) {
      navigate(from, { replace: true });
    }
  }, [userInfo, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      // handled by context
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 font-sans animate-fade-in">
      <div className="border border-gray-100 p-8 shadow-xl bg-white space-y-6">
        
        <div className="text-center">
          <h1 className="text-2xl font-bold uppercase tracking-wider text-black font-serif">Sign In</h1>
          <p className="text-[11px] text-gray-400 mt-1 uppercase tracking-widest font-semibold">
            Welcome back to JeshuVerse
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-xs p-3 border border-red-100 font-semibold rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 p-2.5 text-xs outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 p-2.5 text-xs outline-none focus:border-gold"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-gold py-3 text-xs tracking-widest font-bold disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-gray-50 text-xs text-gray-500">
          New to JeshuVerse?{' '}
          <Link
            to="/register"
            className="font-bold text-black hover:text-gold transition-colors underline"
          >
            Create an Account
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
