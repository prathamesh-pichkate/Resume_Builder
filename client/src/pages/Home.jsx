import HeroSection from "../sections/Home/HeroSection";
import FeaturesSection from "../sections/Home/FeaturesSection";
import TestimonialSection from "../sections/Home/TestimonialSection";
import PricingSection from "../sections/Home/PricingSection";
import ContactSection from "../sections/Home/ContactSection";
import CTASection from "../sections/Home/CTASection";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <TestimonialSection />
      <PricingSection />
      <ContactSection />
      <CTASection />
      <Footer />
    </>
  );
};

export default Home;
