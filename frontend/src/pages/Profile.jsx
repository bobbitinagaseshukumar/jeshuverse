import { useState, useContext, useEffect } from 'react';
import { User, ShieldCheck } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { userInfo, updateProfile, loading, error, setError } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [success, setSuccess] = useState(false);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    setError(null);
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
      setMobile(userInfo.mobile);
      setAddress(userInfo.address);
    }
  }, [userInfo, setError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setLocalError('');

    if (password && password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    try {
      const payload = {
        name,
        email,
        mobile,
        address,
      };

      if (password) {
        payload.password = password;
      }

      await updateProfile(payload);
      setSuccess(true);
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      // Handled by context
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 sm:py-16 font-sans animate-fade-in">
      <div className="border border-gray-100 p-8 shadow-xl bg-white space-y-6">
        
        <div className="flex items-center space-x-3 border-b border-gray-100 pb-4">
          <div className="p-2.5 bg-gold-pale text-gold rounded-full">
            <User size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold uppercase tracking-wider text-black font-serif">Account Profile</h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
              Manage your personal information
            </p>
          </div>
        </div>

        {success && (
          <div className="bg-green-50 text-green-700 border border-green-100 text-xs p-3 font-semibold rounded">
            Profile updated successfully!
          </div>
        )}
        {(error || localError) && (
          <div className="bg-red-50 text-red-600 border border-red-100 text-xs p-3 font-semibold rounded">
            {localError || error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-200 p-2.5 text-xs outline-none focus:border-gold"
              />
            </div>
            
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Mobile Number</label>
              <input
                type="tel"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full border border-gray-200 p-2.5 text-xs outline-none focus:border-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 p-2.5 text-xs outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Shipping Address</label>
            <textarea
              rows="3"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border border-gray-200 p-2.5 text-xs outline-none focus:border-gold resize-none"
            ></textarea>
          </div>

          <div className="border-t border-gray-100 pt-4 mt-6">
            <h3 className="text-[10px] uppercase font-bold text-black tracking-widest mb-3 flex items-center">
              <ShieldCheck size={14} className="text-gold mr-1.5" /> Security Credentials (Optional)
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="Leave blank to keep same"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-200 p-2.5 text-xs outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Leave blank to keep same"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-200 p-2.5 text-xs outline-none focus:border-gold"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-gold py-3 text-xs tracking-widest font-bold mt-4 disabled:bg-gray-200 disabled:text-gray-400"
          >
            {loading ? 'Saving Changes...' : 'Save Profile Changes'}
          </button>

        </form>

      </div>
    </div>
  );
};

export default Profile;
