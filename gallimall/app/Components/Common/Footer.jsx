'use client';

import Link from 'next/link';
import { FaGithub, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 pt-12 border-t border-gray-200 dark:border-gray-700">
      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 pb-12">

        {/* Logo & Tagline */}
        <div>
          <h2 className="text-2xl font-extrabold text-blue-600 dark:text-white">GalliMall</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            Empowering your local shopping experience.
          </p>
        </div>

        {/* Explore */}
        <div>
          <h3 className="text-sm font-semibold uppercase mb-4 text-gray-900 dark:text-white tracking-wider">Explore</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#shops" className="hover:text-blue-600 transition-colors">Shops</a></li>
            <li><a href="#products" className="hover:text-blue-600 transition-colors">Products</a></li>
            <li><Link href="/about" className="hover:text-blue-600 transition-colors">About</Link></li>
            <li><Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-sm font-semibold uppercase mb-4 text-gray-900 dark:text-white tracking-wider">Support</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-sm font-semibold uppercase mb-4 text-gray-900 dark:text-white tracking-wider">Connect with Us</h3>
          <p className="text-sm mb-2">fulsoreanilkumar@gallimall.com</p>
          <div className="flex space-x-4 mt-3">
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-pink-500 transition">
              <FaInstagram size={20} />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-black transition">
              <FaGithub size={20} />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-700 transition">
              <FaLinkedinIn size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* QR Section */}
      <div className="max-w-7xl mx-auto px-6 py-10 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-center sm:text-left">
          <h4 className="text-md font-semibold text-gray-800 dark:text-white mb-1">Scan to visit GalliMall.com</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">Quick access to the website via QR code.</p>
        </div>
        <img
          src="/main gallimall-qr.png"
          alt="GalliMall QR Code"
          className="w-28 h-28 border border-gray-300 dark:border-gray-600 rounded-md"
        />
      </div>

      {/* Bottom Bar */}
      <div className="text-center text-sm py-5 text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
        &copy; {new Date().getFullYear()} <span className="font-semibold text-blue-600 dark:text-blue-400">GalliMall</span>. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
