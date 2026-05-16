import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, ShoppingBag, Star } from "lucide-react";
import SliderImg1 from "@/assets/images/laptop-slider.jpg";
import SliderImg2 from "@/assets/images/furniture-slider.jpeg";
import SliderImg3 from "@/assets/images/shirt-slider.jpg";
import SliderImg4 from "@/assets/images/shoes-slider.jpeg";

const HeroSection = ({ isPreview = false }: { isPreview?: boolean }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const sliderData = [
    { image: SliderImg1, title: "Discover Amazing Deals", subtitle: "Up to 70% off on selected items", ctaText: "Shop Now", ctaLink: "/shop", badge: "New Arrivals" },
    { image: SliderImg2, title: "Premium Quality Products", subtitle: "Handpicked items for your lifestyle", ctaText: "Explore", ctaLink: "/shop", badge: "Featured" },
    { image: SliderImg3, title: "Fast & Free Shipping", subtitle: "On orders over $50", ctaText: "Learn More", ctaLink: "/shop", badge: "Limited Time" },
    { image: SliderImg4, title: "Latest Fashion", subtitle: "Stay ahead of the trend", ctaText: "View Collection", ctaLink: "/shop", badge: "New" }
  ];

  useEffect(() => {
    if (!isPreview) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev === sliderData.length - 1 ? 0 : prev + 1));
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [isPreview, sliderData.length]);

  const currentSlide = sliderData[currentImageIndex];

  return (
    <section className="relative w-full overflow-hidden rounded-2xl shadow-2xl my-6">
      <div className="aspect-[16/7] w-full relative">
        <AnimatePresence mode="wait">
          <motion.div key={currentImageIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 w-full h-full">
            <img src={currentSlide.image} alt={currentSlide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center p-12">
              <div className="max-w-2xl text-white">
                <h1 className="text-5xl font-bold mb-4">{currentSlide.title}</h1>
                <p className="text-xl mb-8">{currentSlide.subtitle}</p>
                <Link to={currentSlide.ctaLink} className="bg-white text-black px-8 py-3 rounded-full font-bold">{currentSlide.ctaText}</Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default HeroSection;
