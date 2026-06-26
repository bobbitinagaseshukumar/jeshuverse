import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Facebook, ShieldCheck } from 'lucide-react';

const Footer = () => {
  const whatsappNum = import.meta.env.VITE_WHATSAPP_NUMBER || '+919999999999';
  const phoneNum = import.meta.env.VITE_CONTACT_PHONE || '+919999999999';

  return (
    <footer className="bg-black text-white font-sans border-t-2 border-gold pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info Column */}
          <div className="space-y-4">
            <span className="text-xl sm:text-2xl font-bold tracking-widest text-white uppercase block">
              JESHU<span className="text-gold">VERSE</span>
            </span>
            <p className="text-xs text-gray-400 leading-relaxed font-light">
              Timeless fashion trends designed for your everyday elegance. Explore premium collections of Men's, Women's, Kids' wear, and fine Jewellery crafted to stand out.
            </p>
            <div className="flex space-x-4 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-gold transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-gold transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Quick Shop Links Column */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-gold font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <Link to="/shop?category=women" className="hover:text-white transition-colors">Women's Wear</Link>
              </li>
              <li>
                <Link to="/shop?category=men" className="hover:text-white transition-colors">Men's Wear</Link>
              </li>
              <li>
                <Link to="/shop?category=kids" className="hover:text-white transition-colors">Kids' Wear</Link>
              </li>
              <li>
                <Link to="/shop?category=jewellery" className="hover:text-white transition-colors">Jewellery</Link>
              </li>
            </ul>
          </div>

          {/* Help Links Column */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-gold font-semibold mb-4">Customer Care</h3>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <Link to="/profile" className="hover:text-white transition-colors">Track Orders</Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-white transition-colors">My Wishlist</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">Shopping Cart</Link>
              </li>
              <li>
                <a
                  href={`https://wa.me/${whatsappNum.replace(/[^0-9]/g, '')}?text=Hello%20JeshuVerse,%20I%20have%20a%20support%20query.`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest text-gold font-semibold mb-4">Get In Touch</h3>
            <ul className="space-y-3 text-xs text-gray-400">
              <li className="flex items-start">
                <MapPin size={16} className="text-gold mr-2.5 shrink-0" />
                <span>102 Elegant Fashion Hub, Ring Road, Mumbai, Maharashtra, India</span>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="text-gold mr-2.5 shrink-0" />
                <a href={`tel:${phoneNum}`} className="hover:text-white transition-colors">{phoneNum}</a>
              </li>
              <li className="flex items-center">
                <Mail size={16} className="text-gold mr-2.5 shrink-0" />
                <a href="mailto:support@jeshuverse.com" className="hover:text-white transition-colors">support@jeshuverse.com</a>
              </li>
              <li className="flex items-center text-[10px] text-gray-500 pt-2 border-t border-zinc-900">
                <ShieldCheck size={14} className="text-green-500 mr-2" />
                Secured Payments via Razorpay
              </li>
            </ul>
          </div>

        </div>

        {/* Divider and Copyright */}
        <div className="border-t border-zinc-900 pt-8 mt-8 flex flex-col sm:flex-row items-center justify-between text-[10px] text-gray-500 font-sans">
          <p>© {new Date().getFullYear()} JeshuVerse. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
