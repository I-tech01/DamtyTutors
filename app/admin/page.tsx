"use client";
import { Employee } from "@/types/employee";
import { useEffect, useState } from "react";
import AdminTutorCard from "@/components/AdminTutorCard";
import AddAdminMenu from "@/components/AddAdminMenu";
import AdminHeader from "@/components/AdminHeader";

export default function AdminDashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    fetch("/api/employees")
      .then((res) => res.json())
      .then((data) => {
        setEmployees(data);
      })
      .catch((error) => console.error("Failed to fetch employees:", error));
  }, []);

  // 💡 Promotion Logic: Adds the "admin" role to the user's account
  async function promoteToAdmin(email: string) {
    const res = await fetch("/api/users/make-admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (data.success) {
      alert(`${email} is now an admin!`);
      
      // Update local state reactively so cards and menus adjust instantly
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.contactInfo?.email === email
            ? { ...emp, roles: [...(emp.roles || []), "admin"] }
            : emp
        )
      );
    } else {
      alert(data.message || "Failed to promote user");
    }
  }

  // 💡 Demotion Logic: Strips away the "admin" role from the user's account
  async function demoteFromAdmin(email: string) {
    const res = await fetch("/api/users/remove-admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (data.success) {
      alert(`${email} has been removed from admins.`);
      
      // Filter out "admin" from the matching tutor's roles array
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.contactInfo?.email === email
            ? { ...emp, roles: emp.roles?.filter((role) => role !== "admin") || [] }
            : emp
        )
      );
    } else {
      alert(data.message || "Failed to remove admin clearance");
    }
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <AdminHeader toggleMenu={() => setShowMenu(!showMenu)} />

      {/* Main Grid View Area */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {employees.map((emp) => (
          <AdminTutorCard 
            key={emp._id} 
            tutor={emp} 
          />
        ))}
      </div>

      {/* Access Management Slide-over panel */}
      {showMenu && (
        <AddAdminMenu
          allEmployees={employees} // 💡 Now passes all accounts to safely run comparison checks
          promoteToAdmin={promoteToAdmin}
          demoteFromAdmin={demoteFromAdmin} // 💡 Connects the minus action logic block
          closeMenu={() => setShowMenu(false)}
        />
      )}
    </div>
  );
}
