import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import TutorsSection from "@/components/TutorsSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section: full width banner */}
      <HeroSection />

      {/* About Section: centered content with generous spacing */}
      <section className="relative py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <AboutSection />
        </div>
      </section>

      {/* Tutors Section: horizontal scroll showcase */}
      <section className="relative py-20 bg-white">
        <div className="container mx-auto px-6">
          <TutorsSection />
        </div>
      </section>

      {/* Footer: dark background, compact */}
      {/* <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <Footer />
        </div>
      </footer> */}
    </main>
  );
}