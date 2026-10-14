interface HeroSectionProps {
  title?: string;
  subtitle?: string;
}

export default function HeroSection({
  title = "Learn Anytime, Anywhere with Expert Tutors",
  subtitle = "Connecting students and tutors for personalized online learning.",
}: HeroSectionProps) {
  return (
    <section
      className="relative min-h-screen bg-cover bg-center bg-no-repeat animate-fadeInBg"
      style={{ backgroundImage: "url('/heroImage.jpg')" }}
    >
      <div className="absolute inset-0  bg-opacity-50"></div>
      <div className="relative z-10 flex flex-col items-start justify-center h-full px-8 text-white animate-fadeIn">
        <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">
          {title}
        </h1>
        <p className="mt-4 text-lg opacity-90 max-w-xl">{subtitle}</p>
        <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg transition transform hover:scale-105">
          Get Started
        </button>
      </div>
    </section>
  );
}