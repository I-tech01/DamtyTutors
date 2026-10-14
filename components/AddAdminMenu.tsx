"use client";
import { Employee } from "@/types/employee";
import { X, UserPlus, UserMinus, ShieldAlert } from "lucide-react";

interface AddAdminMenuProps {
  allEmployees: Employee[];
  promoteToAdmin: (email: string) => void;
  demoteFromAdmin: (email: string) => void; // 💡 New prop to handle demotions
  closeMenu: () => void;
}

export default function AddAdminMenu({
  allEmployees = [],
  promoteToAdmin,
  demoteFromAdmin,
  closeMenu,
}: AddAdminMenuProps) {
  return (
    <>
      {/* Background click backdrop dismissal */}
      <div 
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-xs transition-opacity animate-fadeIn" 
        onClick={closeMenu} 
      />

      <div className="fixed top-0 right-0 w-96 h-full bg-white shadow-2xl p-6 overflow-y-auto z-50 flex flex-col animate-slideLeft">
        {/* Header Block */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Access Management</h2>
            <p className="text-xs text-gray-400 mt-0.5">Manage administrative staff privileges</p>
          </div>
          <button 
            onClick={closeMenu} 
            className="p-2 hover:bg-gray-100 text-gray-400 hover:text-gray-700 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Employee List */}
        {allEmployees.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            No employees available on tracker
          </div>
        ) : (
          <div className="space-y-3 flex-1">
            {allEmployees.map((emp) => {
              const isAdmin = emp.roles?.includes("admin");
              const emailAddress = emp.contactInfo?.email || "";

              return (
                <div
                  key={emp._id}
                  className="flex items-center justify-between p-3 rounded-xl border border-gray-50 bg-gray-50/50 hover:bg-gray-50 transition-all duration-200"
                >
                  {/* Identity Column */}
                  <div className="flex items-center space-x-3 min-w-0">
                    <img
                      src={emp.profilePictureUrl || "/default-avatar.png"}
                      alt={emp.name}
                      className="h-11 w-11 rounded-full object-cover border border-gray-200 shrink-0 bg-white"
                    />
                    <div className="min-w-0">
                      <span className="font-semibold text-sm text-gray-800 block truncate">
                        {emp.name}
                      </span>
                      {/* Dynamic Role Status Badges */}
                      {isAdmin ? (
                        <span className="inline-flex items-center text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md mt-0.5 border border-amber-100">
                          <ShieldAlert size={10} className="mr-1" /> Admin Staff
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[10px] font-medium text-gray-500 bg-white px-2 py-0.5 rounded-md mt-0.5 border border-gray-200">
                          Tutor
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div>
                    {isAdmin ? (
                      /* 💡 MINUS BUTTON: Removes employee from admin workspace role */
                      <button
                        onClick={() => emailAddress && demoteFromAdmin(emailAddress)}
                        disabled={!emailAddress}
                        className="p-2 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-xl border border-red-100 transition-all duration-200 shadow-xs flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Demote from Admin"
                      >
                        <UserMinus size={18} className="transform group-hover:scale-105 transition-transform" />
                      </button>
                    ) : (
                      /* PLUS BUTTON: Promotes employee to admin role */
                      <button
                        onClick={() => emailAddress && promoteToAdmin(emailAddress)}
                        disabled={!emailAddress}
                        className="p-2 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white rounded-xl border border-indigo-100 transition-all duration-200 shadow-xs flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Promote to Admin"
                      >
                        <UserPlus size={18} className="transform group-hover:scale-105 transition-transform" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
