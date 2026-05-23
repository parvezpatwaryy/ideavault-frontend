"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, authClient } from "../app/lib/auth-client";
import { toast } from "react-toastify"; 
import { syncJwtForUser } from "../app/lib/jwt-client";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    if (user) {
      syncJwtForUser(user).catch((error) => {
        console.error("JWT sync failed:", error);
      });
    }
  }, [user]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleLogout = async () => {
    try {
      setIsProfileOpen(false);
      setIsOpen(false);
      await authClient.signOut(); 
      localStorage.removeItem("ideavault_access_token");
      localStorage.removeItem("ideavault_user_email");
      toast.success("Logged out successfully! 👋");

      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (err) {
      console.error(err);
      toast.error("Failed to log out!");
    }
  };

  const getNavLinkStyles = (path) => {
    const isActive = pathname === path;
    return `font-medium transition-colors duration-200 ${isActive
        ? "text-indigo-600 dark:text-indigo-400 font-semibold"
        : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
      }`;
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
              <span className="text-2xl">💡</span>
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                IdeaVault
              </span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className={getNavLinkStyles("/")}>Home</Link>
            <Link href="/ideas" className={getNavLinkStyles("/ideas")}>Ideas</Link>
            {user && (
              <>
                <Link href="/add-idea" className={getNavLinkStyles("/add-idea")}>Add Idea</Link>
                <Link href="/my-ideas" className={getNavLinkStyles("/my-ideas")}>My Ideas</Link>
                <Link href="/my-interactions" className={getNavLinkStyles("/my-interactions")}>My Interactions</Link>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? (
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 14.05l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 111.414 1.414zm2.122-10.606a1 1 0 00-1.414 0l-.707.707a1 1 0 001.414 1.414l.707-.707a1 1 0 000-1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
              )}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <img
                    className="h-9 w-9 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                    src={user.imageUrl || user.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                    alt="User Profile"
                  />
                </button>
                {isProfileOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-xl shadow-lg py-1 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="px-4 py-2 text-sm text-gray-900 dark:text-white font-semibold border-b border-gray-100 dark:border-gray-700 truncate">
                      {user.name}
                    </div>
                    <Link
                      href="/profile"
                      className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Profile Management
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 font-medium"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
                >
                  Registration
                </Link>
              </div>
            )}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
              >
                {isOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L12 12M14 6l-8 8" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link href="/" onClick={() => setIsOpen(false)} className={`block px-3 py-2 rounded-md text-base ${getNavLinkStyles("/")}`}>Home</Link>
          <Link href="/ideas" onClick={() => setIsOpen(false)} className={`block px-3 py-2 rounded-md text-base ${getNavLinkStyles("/ideas")}`}>Ideas</Link>

          {user ? (
            <>
              <Link href="/add-idea" onClick={() => setIsOpen(false)} className={`block px-3 py-2 rounded-md text-base ${getNavLinkStyles("/add-idea")}`}>Add Idea</Link>
              <Link href="/my-ideas" onClick={() => setIsOpen(false)} className={`block px-3 py-2 rounded-md text-base ${getNavLinkStyles("/my-ideas")}`}>My Ideas</Link>
              <Link href="/my-interactions" onClick={() => setIsOpen(false)} className={`block px-3 py-2 rounded-md text-base ${getNavLinkStyles("/my-interactions")}`}>My Interactions</Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-2 px-3">
              <Link href="/login" onClick={() => setIsOpen(false)} className="text-base font-medium text-gray-700 dark:text-gray-200">
                Login
              </Link>
              <Link href="/signup" onClick={() => setIsOpen(false)} className="text-base font-medium text-indigo-600 dark:text-indigo-400">
                Registration
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
