"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TutorCard from "./TutorCard";

interface Tutor {
  id: string;
  _id?: string;
  name: string;
  subjects?: string[];
  profilePictureUrl?: string;
}

export default function TutorsSection() {
  const [tutors, setTutors] = useState<Tutor[]>([]);

  useEffect(() => {
    async function fetchTutors() {
      try {
        const res = await fetch("/api/tutors");
        if (res.ok) {
          const data = await res.json();
          setTutors(data);
        }
      } catch (err) {
        console.error("Failed to load tutors", err);
      }
    }
    fetchTutors();
  }, []);

  // 💡 Duplicate array elements to ensure an uninterrupted visual looping flow
  const duplicatedTutors = [...tutors, ...tutors, ...tutors];

  return (
    <section className="py-16 bg-white overflow-hidden w-full">
      <h2 className="text-3xl font-semibold text-center mb-10">Meet Our Tutors</h2>
      
      {/* Container masking the overflow bounds */}
      <div className="flex w-full overflow-hidden mask-[linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
        <motion.div
          className="flex space-x-6 px-3"
          animate={{ x: [0, -1000] }} // Adjust lower bounds based on card count & total layout widths
          transition={{
            ease: "linear",
            duration: 25, // Control scrolling speeds (higher number = slower movement)
            repeat: Infinity,
          }}
        >
          {duplicatedTutors.map((tutor, idx) => (
            <TutorCard
              key={`${tutor._id || tutor.id}-${idx}`} // Unique key matching loop indexing elements
              {...tutor}
              _id={tutor._id ?? tutor.id}
              showViewProfile={false} // 💡 Explicitly hidden on the homepage layout structure
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
