import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Briefcase,
  GraduationCap,
  MapPin,
  Phone,
  Calendar,
  Clock,
  BookOpen,
} from "lucide-react";

// 💡 Absolute URL resolution with explicit local fallbacks
async function getTutor(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  
  try {
    const res = await fetch(`${baseUrl}/api/tutors/${id}`, {
      cache: "no-store", // Pull real-time data directly from MongoDB
    });
    
    if (!res.ok) {
      console.error(`Backend returned status ${res.status} for ID: ${id}`);
      return null;
    }
    
    return await res.json();
  } catch (error) {
    console.error("Fetch request execution crash:", error);
    return null;
  }
}

interface PageProps {
  params: Promise<{ id: string }>; 
}

export default async function TutorProfile({ params }: PageProps) {
  // 💡 Await the routing frame layout Promise context block completely first!
  const resolvedParams = await params;
  const targetId = resolvedParams?.id;

  // Protect against literal text fallback calls or missing params
  if (!targetId || targetId === "[id]") {
    return (
      <div className="p-8 text-center font-medium text-red-600 bg-red-50 rounded-xl border border-red-200 max-w-md mx-auto my-12">
        ⚠️ Error: Invalid system link path parameter reference configuration.
      </div>
    );
  }

  const tutor = await getTutor(targetId);

 if (!tutor) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4 transition-colors duration-200">
        <div className="max-w-md w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-2xl shadow-xl text-center space-y-5 animate-fadeIn">
          
          {/* Visual Alert Badge Anchor */}
          <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto text-2xl font-black shadow-xs">
            !
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              Workspace Profile Incomplete
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              We couldn't locate any tutor employee data associated with this user account. You need to complete your profile setup first.
            </p>
          </div>

          <div className="w-full border-t border-gray-50 dark:border-gray-800/60 my-4" />

          {/* 💡 THE REDIRECT TRIGGER BUTTON: Takes them straight to the onboarding form */}
          <Link
            href="/onboarding"
            className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm py-3 rounded-xl transition-all shadow-md text-center hover:scale-[1.02] active:scale-[0.98]"
          >
            Start Onboarding Setup
          </Link>
          
        </div>
      </div>
    );
  }


  // Rest of your JSX layout component engine rules down below...


  const education = tutor.education || {};
  const contactInfo = tutor.contactInfo || {};
  const address = tutor.address || {};
  const subjects = tutor.subjects || [];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* HEADER HERO PANEL */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
          <div className="h-32 bg-linear-to-r from-indigo-600 to-indigo-800" />
          <div className="px-6 pb-6 relative flex flex-col sm:flex-row items-center sm:items-end sm:space-x-5 -mt-16">
            <div className="flex">
              <img
                src={tutor.profilePictureUrl || "/default-avatar.png"}
                alt={tutor.name}
                className="h-28 w-28 rounded-full ring-4 ring-white object-cover shadow-md bg-gray-100"
              />
            </div>
            <div className="mt-6 sm:mt-0 text-center sm:text-left flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {tutor.name || "Professional Tutor"}
                  </h1>
                  <p className="text-sm font-semibold text-indigo-600 mt-0.5">
                    {tutor.position || "Tutor Partner"}
                  </p>
                </div>
                <div className="mt-4 sm:mt-0 flex items-center justify-center space-x-2 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Onboarding Profile Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN BODY CONTENTS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* SIDEBAR COLUMN */}
          <div className="space-y-6 md:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Logistics & Support
              </h2>

              <div className="space-y-3.5 text-sm text-gray-600">
                {contactInfo.phone && (
                  <div className="flex items-center space-x-2.5">
                    <Phone size={16} className="text-gray-400 shrink-0" />
                    <span>{contactInfo.phone}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2.5">
                  <Clock size={16} className="text-gray-400 shrink-0" />
                  <span>
                    {tutor.timeZone || "GMT+1"} ({tutor.weeklyCapacity || 10} hrs/wk)
                  </span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Calendar size={16} className="text-gray-400 shrink-0" />
                  <span>
                    Joined {tutor.yearJoined || new Date().getFullYear()}
                  </span>
                </div>
                {tutor.startDate && (
                  <div className="flex items-center space-x-2.5">
                    <Briefcase size={16} className="text-gray-400 shrink-0" />
                    <span>
                      Starts:{" "}
                      {new Date(tutor.startDate).toLocaleDateString(undefined, {
                        dateStyle: "medium",
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* ADDRESS PANEL */}
            {address.street && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-3">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Primary Location
                </h2>
                <div className="flex items-start space-x-2.5 text-sm text-gray-600">
                  <MapPin size={16} className="text-gray-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">{address.street}</p>
                    <p>{address.city}, {address.state}</p>
                    <p className="text-xs text-gray-400 mt-0.5">ZIP {address.zip}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* BROAD CONTENT COLUMN */}
          <div className="space-y-6 md:col-span-2">
            
            {/* METHODOLOGY BIO */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-3">
              <h2 className="text-sm font-bold text-gray-800 flex items-center space-x-2">
                <span>Methodology & Overview</span>
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                {tutor.bio || "This tutor has not added a detailed professional bio summary yet."}
              </p>
            </div>

            {/* ACADEMIC EXPERTISE */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-gray-800 flex items-center space-x-2">
                <GraduationCap size={18} className="text-indigo-600" />
                <span>Academic & Professional Pedigree</span>
              </h2>
              <div className="border-l-2 border-indigo-100 pl-4 space-y-1">
                <h3 className="text-sm font-bold text-gray-900">
                  {education.degree || "Degree Level Stated"}
                </h3>
                <p className="text-sm text-gray-600">
                  {education.institution || "Graduated Educational Institute"}
                </p>
                <div className="flex items-center space-x-4 text-xs text-gray-400 pt-1">
                  <span>Class of {education.graduationYear || "N/A"}</span>
                  <span>•</span>
                  <span>{tutor.experienceYears || 0} Years Experience</span>
                </div>
              </div>
            </div>

            {/* TEACHING SPECIALTIES CHIPS */}
            {subjects.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-3">
                <h2 className="text-sm font-bold text-gray-800 flex items-center space-x-2">
                  <BookOpen size={18} className="text-indigo-600" />
                  <span>Teaching Specialties ({subjects.length})</span>
                </h2>
                <div className="flex flex-wrap gap-2 pt-1">
                  {subjects.map((sub: string) => (
                    <span
                      key={sub}
                      className="text-xs font-semibold px-3 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg shadow-xs"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
