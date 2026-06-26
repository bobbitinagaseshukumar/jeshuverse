import { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, User, Menu, X, Search, LogOut, ChevronDown, ShieldAlert } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo, logout } = useContext(AuthContext);
  const { getCartCount } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setProfileDropdownOpen(false);
  }, [location]);

  // Click outside listener for profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Women', path: '/shop?category=women' },
    { name: 'Men', path: '/shop?category=men' },
    { name: 'Kids', path: '/shop?category=kids' },
    { name: 'Jewellery', path: '/shop?category=jewellery' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          
          {/* Mobile Hamburguer Toggle */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 -ml-2 text-black md:hidden hover:text-gold transition-colors duration-200"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>

          {/* Nav Links - Desktop Left */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-xs uppercase tracking-widest font-medium text-black hover:text-gold transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Logo - Center */}
          <div className="flex-1 flex justify-center md:absolute md:left-1/2 md:-translate-x-1/2">
            <Link to="/" className="flex flex-col items-center">
              <span className="text-xl sm:text-2xl font-bold tracking-widest text-black uppercase">
                JESHU<span className="text-gold">VERSE</span>
              </span>
              <span className="text-[7px] sm:text-[8px] uppercase tracking-[0.25em] text-gray-400 -mt-1 font-medium hidden sm:block">
                Fashion for Women, Men, Kids & Jewellery
              </span>
            </Link>
          </div>

          {/* Utility Icons - Right */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-black hover:text-gold transition-colors duration-200"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="p-2 text-black hover:text-gold transition-colors duration-200 relative"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {wishlistItems.length > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[8px] font-bold text-black ring-2 ring-white">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart Link */}
            <Link
              to="/cart"
              className="p-2 text-black hover:text-gold transition-colors duration-200 relative"
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {getCartCount() > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[8px] font-bold text-white ring-2 ring-white">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* User Profile / Dropdown */}
            <div className="relative" ref={dropdownRef}>
              {userInfo ? (
                <>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center text-xs font-medium text-black hover:text-gold transition-colors duration-200 py-2 focus:outline-none"
                  >
                    <User size={20} className="mr-0.5 sm:mr-1" />
                    <span className="hidden sm:inline max-w-[80px] truncate">{userInfo.name.split(' ')[0]}</span>
                    <ChevronDown size={14} className="hidden sm:inline ml-0.5" />
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl py-1 z-50 animate-fade-in font-sans">
                      <div className="px-4 py-2 border-b border-gray-100 text-xs font-semibold text-gray-500">
                        Hello, {userInfo.name}
                      </div>
                      
                      {userInfo.isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center px-4 py-2 text-xs text-black hover:bg-gold-pale hover:text-gold transition-colors duration-150"
                        >
                          <ShieldAlert size={14} className="mr-2" />
                          Admin Dashboard
                        </Link>
                      )}

                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-xs text-black hover:bg-gold-pale hover:text-gold transition-colors duration-150"
                      >
                        <User size={14} className="mr-2" />
                        My Profile
                      </Link>

                      <Link
                        to="/orders"
                        className="flex items-center px-4 py-2 text-xs text-black hover:bg-gold-pale hover:text-gold transition-colors duration-150"
                      >
                        <ShoppingBag size={14} className="mr-2" />
                        My Orders
                      </Link>

                      <button
                        onClick={() => {
                          logout();
                          navigate('/login');
                        }}
                        className="w-full flex items-center px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors duration-150 text-left border-t border-gray-100 mt-1"
                      >
                        <LogOut size={14} className="mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to="/login"
                  className="p-2 text-black hover:text-gold transition-colors duration-200"
                  aria-label="Login"
                >
                  <User size={20} />
                </Link>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Slide-down Search Bar */}
      {searchOpen && (
        <div className="border-t border-gray-100 bg-white shadow-inner absolute left-0 right-0 py-4 px-4 z-40 animate-fade-in">
          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center font-sans">
            <input
              type="text"
              placeholder="Search products, collections, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-b border-black py-2 px-1 text-sm outline-none focus:border-gold transition-colors duration-200"
              autoFocus
            />
            <button
              type="submit"
              className="ml-3 bg-black hover:bg-gold hover:text-black text-white p-2.5 text-xs uppercase tracking-widest transition-all duration-200"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="ml-2 text-gray-400 hover:text-black p-2"
            >
              <X size={20} />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Nav Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-40 transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          {/* Drawer Panel */}
          <div className="relative flex flex-col w-full max-w-xs bg-white shadow-2xl h-full py-4 px-6 z-10 animate-fade-in font-sans">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <span className="text-lg font-bold tracking-widest">
                JESHU<span className="text-gold">VERSE</span>
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 -mr-2 text-black hover:text-gold"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Menu Links */}
            <div className="flex flex-col space-y-4">
              <span className="text-[10px] tracking-widest text-gray-400 uppercase font-semibold">Collections</span>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-sm font-medium text-black hover:text-gold border-b border-gray-50 pb-2 transition-colors duration-150"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="mt-auto border-t border-gray-100 pt-6 space-y-4">
              {userInfo ? (
                <>
                  <div className="text-xs text-gray-500 mb-2">Logged in as {userInfo.name}</div>
                  
                  {userInfo.isAdmin && (
                    <Link
                      to="/admin"
                      className="block text-sm font-medium text-black hover:text-gold"
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  <Link
                    to="/profile"
                    className="block text-sm font-medium text-black hover:text-gold"
                  >
                    My Profile
                  </Link>

                  <Link
                    to="/orders"
                    className="block text-sm font-medium text-black hover:text-gold"
                  >
                    My Orders
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }}
                    className="w-full flex items-center text-sm font-medium text-red-600 hover:text-red-700 transition-colors pt-2 border-t border-gray-50"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="w-full inline-block text-center btn-gold"
                >
                  Login / Register
                </Link>
              )}
            </div>

          </div>
        </div>
      )}

    </header>
  );
};

export default Navbar;
