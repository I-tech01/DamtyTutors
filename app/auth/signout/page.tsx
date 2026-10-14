"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserCircle } from "lucide-react"; 

export default function Navbar({ user }: { user?: any }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function handleSignOut() {
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/auth/login");
  }

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <h1 className="text-xl font-bold">My App</h1>

      <div className="relative">
        {/* Profile icon (Lucide React) */}
        <UserCircle
          className="w-10 h-10 cursor-pointer"
          onClick={() => setOpen(!open)}
        />

        {/* Dropdown menu */}
        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg">
            <button
              onClick={handleSignOut}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}