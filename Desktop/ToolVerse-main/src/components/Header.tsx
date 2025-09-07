'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    setIsClient(true);
    
    // 点击外部关闭菜单
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-menu="user"]')) {
        setIsUserMenuOpen(false);
      }
      if (!target.closest('[data-menu="mobile"]')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2">
            <img 
              src="/favicon.png" 
              alt="ToolVerse" 
              className="w-8 h-8 rounded-lg"
            />
            <span className="text-xl font-bold text-gray-900">ToolVerse</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/tools" className="text-gray-600 hover:text-primary-600 transition-colors">
              Browse Tools
            </a>
            <a href="/blog" className="text-gray-600 hover:text-primary-600 transition-colors flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              Blog
            </a>
            <a href="/about" className="text-gray-600 hover:text-primary-600 transition-colors">
              About
            </a>
            <a href="/contact" className="text-gray-600 hover:text-primary-600 transition-colors">
              Contact
            </a>
            <a 
              href="/submit"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Submit Tool
            </a>

            {/* User Authentication */}
            {isClient && (
              <div className="flex items-center space-x-4">
                {status === 'loading' ? (
                  <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                ) : session ? (
                  <div className="relative" data-menu="user">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      {session.user?.image ? (
                        <img
                          src={session.user.image}
                          alt={session.user.name || ''}
                          className="w-8 h-8 rounded-full border-2 border-gray-300"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {session.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                      )}
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                        <div className="py-1">
                          <div className="px-4 py-2 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
                            <p className="text-sm text-gray-500">{session.user?.email}</p>
                          </div>
                          <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                            <span className="mr-2">👤</span>
                            Profile
                          </a>
                          <a href="/favorites" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                            <span className="mr-2">❤️</span>
                            Favourites
                          </a>
                          <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                            <span className="mr-2">⚙️</span>
                            Settings
                          </a>
                          <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          >
                            <span className="mr-2">🚪</span>
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link
                      href="/auth/signin"
                      className="text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div data-menu="mobile">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isClient && isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4" data-menu="mobile">
            <div className="flex flex-col space-y-4">
              <a href="/tools" className="text-gray-600 hover:text-primary-600 transition-colors">
                Browse Tools
              </a>
              <a href="/blog" className="text-gray-600 hover:text-primary-600 transition-colors flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                Blog
              </a>
              <a href="/about" className="text-gray-600 hover:text-primary-600 transition-colors">
                About
              </a>
              <a href="/contact" className="text-gray-600 hover:text-primary-600 transition-colors">
                Contact
              </a>
              <a href="/submit" className="text-gray-600 hover:text-primary-600 transition-colors">
                Submit Tool
              </a>

              {/* Mobile User Authentication */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                {status === 'loading' ? (
                  <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                ) : session ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 py-2">
                      {session.user?.image ? (
                        <img
                          src={session.user.image}
                          alt={session.user.name || ''}
                          className="w-8 h-8 rounded-full border-2 border-gray-300"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {session.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
                        <p className="text-xs text-gray-500">{session.user?.email}</p>
                      </div>
                    </div>
                    <a href="/profile" className="block py-2 text-gray-600 hover:text-primary-600 transition-colors flex items-center">
                      <span className="mr-2">👤</span>
                      Profile
                    </a>
                    <a href="/favorites" className="block py-2 text-gray-600 hover:text-primary-600 transition-colors flex items-center">
                      <span className="mr-2">❤️</span>
                      Favourites
                    </a>
                    <a href="/settings" className="block py-2 text-gray-600 hover:text-primary-600 transition-colors flex items-center">
                      <span className="mr-2">⚙️</span>
                      Settings
                    </a>
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="block w-full text-left py-2 text-gray-600 hover:text-primary-600 transition-colors flex items-center"
                    >
                      <span className="mr-2">🚪</span>
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/auth/signin"
                      className="block py-2 text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="block py-2 bg-primary-600 text-white px-4 rounded-lg hover:bg-primary-700 transition-colors text-center"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
