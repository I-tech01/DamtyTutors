"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  UserCircle, 
  UserPlus, 
  LogOut, 
  Settings, 
  User, 
  Menu, 
  X, 
  ShieldCheck, 
  Home, 
  BookOpen 
} from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const router = useRouter();
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchSession() {
      const res = await fetch("/api/auth/session");
      if (res.ok) {
        const data = await res.json();
        if (data?.user) {
          setSession(data);
        }
      }
    }
    fetchSession();
  }, []);

  useEffect(() => {
    if (navRef.current) {
      document.documentElement.style.setProperty(
        "--navbar-height",
        `${navRef.current.offsetHeight}px`
      );
    }
  }, [session]);

  async function handleSignOut() {
    await fetch("/api/auth/signout", { method: "POST" });
    setOpen(false);
    router.push("/auth/login");
  }

  const hasUser = !!session?.user;

  // Animation configurations for the mobile drawer slide effect
  const menuVariants: Variants = {
    closed: { x: "100%", transition: { type: "tween", duration: 0.25, ease: "easeInOut" } },
    opened: { x: 0, transition: { type: "tween", duration: 0.3, ease: "easeOut" } }
  };

  return (
    <motion.nav
      ref={navRef}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 bg-gray-800 dark:bg-gray-900 border-b border-gray-700/50 dark:border-gray-800 text-white p-4 flex justify-between items-center shadow-md z-50 backdrop-blur-md"
    >
      <h1
        className="text-xl font-bold cursor-pointer tracking-tight"
        onClick={() => router.push("/")}
      >
        Damty<span className="text-indigo-400">Tutors</span>
      </h1>

      <div className="flex items-center space-x-4">
        {/* About Page Link (Desktop Only) */}
        <Link 
          href="/about" 
          className="text-sm font-medium text-gray-300 hover:text-indigo-400 transition-colors hidden md:block"
        >
          About Us
        </Link>

        {/* Tutor Registration Button (Desktop Only) */}
        <Link
          href="/onboarding"
          className="hidden sm:flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl shadow-md transition-all hover:scale-102"
        >
          <UserPlus size={16} />
          <span>Tutor Registration</span>
        </Link>

        {/* 💡 THE TRIGGER MENU ICON */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="p-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all"
          aria-label="Open system panel navigation navigation"
        >
          <Menu size={24} />
        </button>

        {/* ANIMATED DRIFT-OUT DRAWER OVERLAY SYSTEM */}
        <AnimatePresence>
          {open && (
            <>
              {/* Dimmed backdrop background mask */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black z-45"
                onClick={() => setOpen(false)}
              />

              {/* Side Drawer Sidebar Container */}
              <motion.div
                variants={menuVariants}
                initial="closed"
                animate="opened"
                exit="closed"
                className="fixed top-0 right-0 bottom-0 w-64 max-w-[80vw] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 shadow-2xl z-50 flex flex-col"
              >
                {/* Drawer Menu Title & Close Button Header Container */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 mb-4">
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Navigation Menu</span>
                  <button 
                    type="button" 
                    onClick={() => setOpen(false)}
                    className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Navigation Options List Layout */}
                <div className="flex-1 space-y-1.5">
                  <Link
                    href="/"
                    onClick={() => setOpen(false)}
                    className="flex items-center space-x-3 px-3 py-2.5 text-sm font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-all"
                  >
                    <Home size={18} className="text-gray-400" />
                    <span>Home Layout</span>
                  </Link>

                  <Link
                    href="/about"
                    onClick={() => setOpen(false)}
                    className="flex items-center space-x-3 px-3 py-2.5 text-sm font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-all md:hidden"
                  >
                    <BookOpen size={18} className="text-gray-400" />
                    <span>About Us</span>
                  </Link>

                  <Link
                    href="/onboarding"
                    onClick={() => setOpen(false)}
                    className="flex items-center space-x-3 px-3 py-2.5 text-sm font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-all sm:hidden"
                  >
                    <UserPlus size={18} className="text-indigo-500" />
                    <span>Tutor Registration</span>
                  </Link>

                  {hasUser && (
                    <>
                      <Link
                        href={`/profile/${session.user._id || session.user.id || session.user.tutorId}`}
                        onClick={() => setOpen(false)}
                        className="flex items-center space-x-3 px-3 py-2.5 text-sm font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-all"
                      >
                        <User size={18} className="text-gray-400" />
                        <span>My Profile</span>
                      </Link>

                      {/* 💡 LINKED PROFILE ICON ROUTING TO ADMINISTRATIVE HUB */}
                      <Link
                        href="/admin"
                        onClick={() => setOpen(false)}
                        className="flex items-center space-x-3 px-3 py-2.5 text-sm font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-all border border-indigo-100/50 dark:border-indigo-900/30 bg-indigo-50/20 dark:bg-indigo-950/10"
                      >
                        <ShieldCheck size={18} className="text-indigo-600 dark:text-indigo-400" />
                        <span className="font-semibold text-indigo-700 dark:text-indigo-400">Admin Dashboard</span>
                      </Link>

                      {/* 💡 SETTINGS PATH CONFIGURATION WITH DESIGN ICON ANCHOR */}
                      <Link
                        href="/settings"
                        onClick={() => setOpen(false)}
                        className="flex items-center space-x-3 px-3 py-2.5 text-sm font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-all"
                      >
                        <Settings size={18} className="text-gray-400" />
                        <span>Settings Profile</span>
                      </Link>
                    </>
                  )}
                </div>

                {/* Footer Sign Out Control Panel Block */}
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 mt-auto">
                  {hasUser ? (
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex items-center space-x-3 w-full px-3 py-2.5 text-sm font-medium rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                    >
                      <LogOut size={18} />
                      <span>Sign Out Account</span>
                    </button>
                  ) : (
                    <Link
                      href="/auth/login"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-center w-full px-4 py-2.5 text-sm font-semibold rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 transition-all text-center"
                    >
                      Sign In Session
                    </Link>
                  )}
                </div>

              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
