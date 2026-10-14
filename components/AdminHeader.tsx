"use client";

export default function AdminHeader({ toggleMenu }: { toggleMenu: () => void }) {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors"
        onClick={toggleMenu}
      >
        Add Admin
      </button>
    </div>
  );
}