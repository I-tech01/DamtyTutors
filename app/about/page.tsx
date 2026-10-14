"use client";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Sparkles, 
  Rocket, 
  GraduationCap, 
  Users, 
  History, 
  Heart,
  Mail,
  Link
} from "lucide-react";

// Floating Cards Background Data
const floatingCards = [
  { text: "Dynamic 1:1 Live Tracking", icon: Sparkles, color: "text-indigo-500 bg-indigo-50", top: "15%", left: "8%" },
  { text: "Verified Expert Tutors", icon: ShieldCheck, color: "text-emerald-500 bg-emerald-50", top: "25%", right: "10%" },
  { text: "Global Curriculum Alignment", icon: Rocket, color: "text-amber-500 bg-amber-50", top: "65%", left: "5%" },
  { text: "Empowering 10k+ Students", icon: GraduationCap, color: "text-rose-500 bg-rose-50", top: "75%", right: "12%" },
];

// Historical Milestones
const milestones = [
  { year: "2021", title: "The Spark", desc: "Damty Tutor was born out of a passion to bridge learning gaps globally during a shifting digital academic landscape." },
  { year: "2023", title: "100k Hours milestone", desc: "Expanded operations to host multi-curriculum checkbox systems, secure onboarding wizards, and tracking nodes." },
  { year: "2026", title: "The Tomorrow Standard", desc: "Now recognized as a premier educational platform integrating real-time logistics tracking and elite tutor pairings." },
];

// Executive Leadership Team
const leaders = [
  { name: "Sarah Jenkins", role: "Chief Operating Officer", bio: "Operational mastermind overseeing global tracking infrastructure frameworks.", img: "/default-avatar.png" },
  { name: "David Kross", role: "Director of Education", bio: "Curriculum visionary aligning complex checkbox diagnostics to global syllabi.", img: "/default-avatar.png" },
  { name: "Elena Rostova", role: "Head of Tutor Relations", bio: "Ensuring our rigorous onboarding filters match only the top 3% of applicants.", img: "/default-avatar.png" },
];

export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen overflow-x-hidden font-sans relative selection:bg-indigo-500 selection:text-white">
      
      {/* 🔮 HERO SECTION WITH FLOATING VISUAL CARDS */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-6 py-20 bg-linear-to-b from-white via-indigo-50/20 to-transparent overflow-hidden">
        
        {/* Floating Cards (Hidden on small mobile viewports for clean formatting layout structures) */}
        {floatingCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={index}
              style={{ top: card.top, left: card.left, right: card.right }}
              className="absolute hidden md:flex items-center space-x-3 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 z-10 cursor-pointer pointer-events-none"
              animate={{ 
                y: [0, index % 2 === 0 ? -15 : 15, 0],
                rotate: [0, index % 2 === 0 ? 2 : -2, 0]
              }}
              transition={{
                duration: 5 + index,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className={`p-2 rounded-xl ${card.color}`}>
                <Icon size={18} />
              </div>
              <span className="text-xs font-bold text-gray-700 whitespace-nowrap">{card.text}</span>
            </motion.div>
          );
        })}

        {/* Core Hero Text Block Container */}
        <motion.div 
          className="max-w-3xl z-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-700 text-xs font-bold tracking-wider uppercase px-4 py-1.5 rounded-full mb-6 border border-indigo-100/50">
            <Heart size={12} className="fill-indigo-600 animate-pulse" />
            <span>Behind Damty Tutor</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight leading-none mb-6">
            We are rewriting the rules of <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">Digital Mentorship</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
            Damty Tutor is more than an online workspace—it is a secure data-driven ecosystem tailored to foster actual student-to-mentor breakthroughs.
          </p>
        </motion.div>
      </section>

      {/* 🏢 ABOUT THE COMPANY STATEMENT BLOCK */}
      <section className="py-20 px-6 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Our Mission & Ecosystem Philosophy</h2>
          <p className="text-gray-600 leading-relaxed">
            We believe that every student deserves precise learning pipelines. Our centralized workspace connects vetted educators to learners through absolute transparency, real-time analytics, and optimized curriculum delivery tracking dashboards.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
              <span className="text-3xl font-black text-indigo-600 block">98.4%</span>
              <span className="text-xs text-gray-400 font-medium block uppercase tracking-wider mt-0.5">Grade Improvement</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
              <span className="text-3xl font-black text-purple-600 block">Top 3%</span>
              <span className="text-xs text-gray-400 font-medium block uppercase tracking-wider mt-0.5">Strict Tutor Acceptance</span>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="bg-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl min-h-75 flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-700/30 rounded-full blur-3xl z-0" />
          <Users size={40} className="text-indigo-400 z-10" />
          <div className="z-10 mt-12">
            <h3 className="text-xl font-bold mb-2">Built to scale together</h3>
            <p className="text-indigo-200 text-sm leading-relaxed">
              By monitoring availability tracking sheets, matching multi-step checkbox specialties, and ensuring seamless operations, we clear away logistical friction so mentors can focus entirely on what they do best: teaching.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ⏳ HISTORICAL CHRONOLOGY METRIC YEARS */}
      <section className="py-20 bg-white border-y border-gray-100 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center justify-center">
              <History size={24} className="mr-2 text-indigo-600" /> Progression Roadmap
            </h2>
            <p className="text-sm text-gray-500">How we evolved into an institutional data tracker cluster</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {milestones.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.6 }}
                className="bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-xs space-y-3 relative group hover:bg-white hover:shadow-xl transition-all duration-300"
              >
                <div className="text-4xl font-black text-indigo-600/20 group-hover:text-indigo-600 transition-colors duration-300">
                  {item.year}
                </div>
                <h4 className="text-lg font-bold text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 👑 FOUNDER BIOGRAPHY DEDICATED PROFILE SPOTLIGHT */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="bg-linear-to-br from-indigo-50 via-white to-purple-50 rounded-3xl p-8 sm:p-12 border border-indigo-100 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-8 items-center"
        >
          <div className="md:col-span-1 flex flex-col items-center text-center">
            <img 
              src="/default-avatar.png" // Replace with your real founder portrait link asset
              alt="Founder Portrait" 
              className="w-44 h-44 rounded-2xl object-cover ring-4 ring-white shadow-xl bg-white"
            />
            <h3 className="text-xl font-bold text-gray-900 mt-4">Mr. Damilare Isaac</h3>
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-widest mt-1">Founder & Chief Architect</p>
          </div>

          <div className="md:col-span-2 space-y-4 text-gray-600 leading-relaxed text-sm sm:text-base">
            <h3 className="text-lg font-bold text-gray-900">A Message From Our Founder</h3>
            <p>
              We didn&apos;t set out to build another generic database of tutors. We wanted to build a transparent, fail-safe environment where families and administrative teams can immediately spot excellence and track growth metrics cleanly.
            </p>
            <p>
              Education shouldn&apos;t run on logistics guesswork. Every update we deploy—from atomic array handlers to infinite looping home tracks—is engineered to keep elite mentorship simple and reliable.
            </p>
          </div>
        </motion.div>
      </section>

      {/* 👔 EXECUTIVE AND ADMINISTRATIVE WORKSPACE LEADERS */}
      <section className="py-20 bg-gray-50/60 border-t border-gray-100 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Executive Leadership Council</h2>
            <p className="text-sm text-gray-500">The operational team fueling daily logistical infrastructure expansions</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {leaders.map((leader, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white rounded-2xl border border-gray-200/50 p-6 flex flex-col items-center text-center shadow-xs hover:shadow-xl hover:border-indigo-100 transition-all duration-300 group"
              >
                <img 
                  src={leader.img} 
                  alt={leader.name} 
                  className="w-24 h-24 rounded-full object-cover mb-4 ring-4 ring-gray-50 group-hover:ring-indigo-50 transition-all shadow-inner bg-gray-50"
                />
                
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {leader.name}
                </h3>
                
                <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-3">
                  {leader.role}
                </p>
                
                <p className="text-xs text-gray-500 leading-relaxed max-w-xs flex-1">
                  {leader.bio}
                </p>
                
                {/* Administrative Profile Action Anchors */}
                <div className="flex items-center space-x-2 mt-4 pt-3 border-t border-gray-50 w-full justify-center opacity-40 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 hover:bg-indigo-50 rounded-lg text-gray-500 hover:text-indigo-600 transition-colors">
                    <Link size={14} />
                  </button>
                  <button className="p-1.5 hover:bg-indigo-50 rounded-lg text-gray-500 hover:text-indigo-600 transition-colors">
                    <Mail size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
