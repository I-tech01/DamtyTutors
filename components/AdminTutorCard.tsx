"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Phone,
  Mail,
  GraduationCap,
  Calendar,
  Clock,
  BookOpen,
  User,
  MapPin,
  Briefcase,
  Globe
} from "lucide-react";

interface AdminTutorCardProps {
  tutor: any;
}

export default function AdminTutorCard({ tutor }: AdminTutorCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!tutor) {
    return (
      <div className="bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-6 text-center text-xs text-gray-400">
        Missing tutor record data
      </div>
    );
  }

  // Data mapping setup
  const tutorName = tutor.tutorName || tutor.name || "Unnamed Tutor";
  const avatarUrl = tutor.avatarUrl || tutor.profilePictureUrl || "/default-avatar.png";
  const phoneNumber = tutor.phoneNumber || tutor.contactInfo?.phone || "No phone listed";
  const tutorEmail = tutor.email || tutor.contactInfo?.email || "No Email Provided";
  const positionName = tutor.position || "Tutor";

  const degree = tutor.education?.degree || tutor.education || "—";
  const institution = tutor.education?.institution || tutor.institution || "—";
  const graduationYear = tutor.education?.graduationYear || tutor.graduationYear || "—";
  const experienceYears = tutor.experienceYears ?? 0;
  const subjects = tutor.subjects || [];
  const bio = tutor.bio || "No professional overview bio provided.";

  const timeZone = tutor.timeZone || "GMT+1";
  const weeklyCapacity = tutor.weeklyCapacity || 10;
  const street = tutor.address?.street || tutor.street || "";
  const city = tutor.address?.city || tutor.city || "";
  const state = tutor.address?.state || tutor.state || "";
  const zip = tutor.address?.zip || tutor.zip || "";

  return (
    <>
      {/* 💳 QUICK-GLANCE CARD */}
      <div
        onClick={() => setIsOpen(true)}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 p-6 flex flex-col items-center text-center cursor-pointer relative group"
      >
        <div className="absolute top-4 right-4 bg-indigo-50 text-indigo-600 text-xs font-semibold px-2.5 py-1 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition-colors">
          View Profile
        </div>

        <img
          src={avatarUrl}
          alt={tutorName}
          className="h-24 w-24 rounded-full object-cover ring-4 ring-indigo-50 mb-4 bg-gray-50"
        />

        <h2 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
          {tutorName}
        </h2>
        <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2">
          {positionName}
        </p>

        <div className="w-full border-t border-gray-50 my-3" />

        <div className="w-full space-y-1.5 text-left text-xs text-gray-500">
          <div className="flex items-center space-x-2 truncate">
            <Mail size={14} className="text-gray-400 shrink-0" />
            <span className="truncate">{tutorEmail}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone size={14} className="text-gray-400 shrink-0" />
            <span>{phoneNumber}</span>
          </div>
        </div>
      </div>
   {/* 🪟 DETACHED DETAILED WORKSPACE PROFILE */}
      {isOpen && mounted && createPortal(
        <div 
          style={{ 
            top: "var(--navbar-height, 72px)", 
            height: "calc(100vh - var(--navbar-height, 72px))" 
          }}
          className="fixed left-0 right-0 bottom-0 z-50 bg-gray-100 flex flex-col overflow-y-auto animate-fadeIn"
        >
          {/* Top Fixed Navigation Bar for the Profile Card */}
          <div className="w-full bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-xs shrink-0">
            <div className="flex items-center space-x-3">
              <User size={22} className="text-indigo-600" />
              <h3 className="text-xl font-bold text-gray-900">
                Detailed Tutor Workspace Profile
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl cursor-pointer transition-all text-sm shrink-0 border border-gray-200 shadow-xs active:scale-95"
            >
              <X size={18} />
              <span>Close Screen</span>
            </button>
          </div>


          {/* Full Screen Layout Container */}
          <div className="max-w-6xl w-full mx-auto p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Sidebar Column (Main Bio / Identity Card) */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-gray-200/60 shadow-sm flex flex-col items-center text-center">
                <img
                  src={avatarUrl}
                  alt={tutorName}
                  className="h-36 w-36 rounded-full object-cover ring-4 ring-indigo-100 mb-4 shadow-md"
                />
                <h4 className="text-2xl font-black text-gray-900">{tutorName}</h4>
                <p className="text-sm font-semibold text-indigo-600 tracking-wide uppercase mt-1">
                  {positionName}
                </p>
                <div className="mt-2 text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                  Onboarded Year: {tutor.joiningYear || new Date().getFullYear()}
                </div>

                <div className="w-full border-t border-gray-100 my-6" />

                {/* Primary Core Contact info list */}
                <div className="w-full space-y-4 text-left text-sm text-gray-600">
                  <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <Mail size={18} className="text-indigo-500 shrink-0" />
                    <span className="truncate font-medium">{tutorEmail}</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <Phone size={18} className="text-indigo-500 shrink-0" />
                    <span className="font-medium">{phoneNumber}</span>
                  </div>
                </div>
              </div>

              {/* Operations Logistics Mini Card */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200/60 shadow-sm space-y-4">
                <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center">
                  <Clock size={16} className="mr-2 text-indigo-500" /> Operational Metrics
                </h5>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span className="text-xs text-gray-400 block">Weekly Capacity</span>
                    <span className="text-base font-bold text-gray-800">{weeklyCapacity} Hours</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span className="text-xs text-gray-400 block">Time Zone</span>
                    <span className="text-base font-bold text-gray-800">{timeZone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Main Content Details Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Bio Statement */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/60 shadow-sm space-y-3">
                <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center">
                  <Briefcase size={16} className="mr-2 text-indigo-500" /> Professional Overview
                </h5>
                <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">{bio}</p>
              </div>

              {/* Education Dashboard Block */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/60 shadow-sm space-y-4">
                <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center">
                  <GraduationCap size={18} className="mr-2 text-indigo-500" /> Academic & Experience Profiles
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-100 bg-gray-50/50 p-4 rounded-2xl">
                    <span className="text-xs text-gray-400 block font-semibold">Degree / Qualification</span>
                    <span className="text-lg font-bold text-gray-800">{degree}</span>
                  </div>
                  <div className="border border-gray-100 bg-gray-50/50 p-4 rounded-2xl">
                    <span className="text-xs text-gray-400 block font-semibold">Institution</span>
                    <span className="text-lg font-bold text-gray-800">{institution}</span>
                  </div>
                  <div className="border border-gray-100 bg-gray-50/50 p-4 rounded-2xl">
                    <span className="text-xs text-gray-400 block font-semibold">Graduation Year</span>
                    <span className="text-lg font-bold text-gray-800">{graduationYear}</span>
                  </div>
                  <div className="border border-gray-100 bg-gray-50/50 p-4 rounded-2xl">
                    <span className="text-xs text-gray-400 block font-semibold">Field Background Experience</span>
                    <span className="text-lg font-bold text-gray-800">{experienceYears} Years Active</span>
                  </div>
                </div>
              </div>

              {/* Subjects and Specialties Row Layout */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/60 shadow-sm space-y-4">
                <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center">
                  <BookOpen size={16} className="mr-2 text-indigo-500" />
                  Endorsed Teaching Competencies
                </h5>

                <div className="flex flex-wrap gap-2">
                  {subjects.length > 0 ? (
                    subjects.map((sub: string) => (
                      <span
                        key={sub}
                        className="inline-flex items-center rounded-full bg-indigo-50 text-indigo-700 px-3 py-1.5 text-xs font-semibold border border-indigo-100"
                      >
                        {sub}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No custom sub-specialties mapped to this employee account yet.
                    </p>
                  )}
                </div>
              </div>

              {/* Physical Location Address Block */}
              {(street || city || state) && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/60 shadow-sm space-y-4">
                  <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center">
                    <MapPin size={16} className="mr-2 text-indigo-500" />
                    Physical Base Address
                  </h5>

                  <div className="space-y-1 text-gray-700">
                    {street && <p className="font-medium">{street}</p>}
                    <p>{[city, state, zip].filter(Boolean).join(", ")}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}