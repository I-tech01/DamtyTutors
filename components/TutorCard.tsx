import Link from 'next/link';

interface TutorCardProps {
  _id: string;
  name: string;
  subjects?: string[];
  profilePictureUrl?: string;
  showViewProfile?: boolean; // 💡 New prop to control button visibility
}

export default function TutorCard({ 
  _id, 
  name, 
  subjects = [], 
  profilePictureUrl, 
  showViewProfile = false // Defaults to false (hidden for homepage)
}: TutorCardProps) {
  
  const primarySubject = subjects.length > 0 ? subjects[0] : 'General Tutor';

  return (
    <div className="shrink-0 w-64 bg-gray-50 rounded-xl shadow-lg p-6 text-center transition transform hover:-translate-y-2 hover:shadow-2xl">
      <img
        src={profilePictureUrl || '/default-avatar.png'}
        alt={name}
        className="w-full h-40 object-cover rounded-lg mb-4 bg-gray-100"
      />
      <h3 className="text-xl font-semibold text-gray-900 truncate">{name}</h3>
      <p className="text-gray-600 text-sm truncate mb-2">{primarySubject}</p>
      
      {/* 💡 Conditionally render the button based on the prop */}
      {showViewProfile && (
        <Link
          href={`/tutors/${_id}`}
          className="mt-4 inline-block w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-md transition"
        >
          View Profile
        </Link>
      )}
    </div>
  );
}
