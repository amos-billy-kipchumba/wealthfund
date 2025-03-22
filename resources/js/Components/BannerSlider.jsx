import React, { useState, useEffect, useRef } from "react";
import { Link } from '@inertiajs/react';

const BannerSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const slideInterval = useRef(null);
  const totalSlides = 1;

  const settings = {
    delay: 9000,
    animationDuration: 2000,
  };

  useEffect(() => {
    startSlideshow();
    window.addEventListener("scroll", handleScroll);
    return () => {
      clearInterval(slideInterval.current);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const startSlideshow = () => {
    clearInterval(slideInterval.current);
    slideInterval.current = setInterval(goToNextSlide, settings.delay);
  };

  const goToNextSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
      setTimeout(() => setIsAnimating(false), settings.animationDuration);
    }
  };

  const goToPrevSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
      setTimeout(() => setIsAnimating(false), settings.animationDuration);
    }
  };

  const goToSlide = (index) => {
    if (!isAnimating && index !== currentSlide) {
      setIsAnimating(true);
      setCurrentSlide(index);
      setTimeout(() => setIsAnimating(false), settings.animationDuration);
    }
  };

  const handleScroll = () => {
    setScrollY(window.scrollY * 0.5);
  };

  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative w-full h-[700px] sm:h-[500px]">
        <div
          className={`absolute top-0 left-0 w-full h-full bg-cover bg-center transition-opacity duration-[${settings.animationDuration}ms] ${
            currentSlide === 0 ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: "url('images/slides/slide1.png')", transform: `translateY(${scrollY}px)` }}
        >
          <div className="space-y-6 text-white container mx-auto flex flex-col mt-24">
            <h1 className="text-6xl text-white sm:text-3xl font-bold tracking-wide">
            The Future of Investing
            </h1>
            <p className="text-lg sm:text-base">
                Experience Hassle-Free Investing
            </p>
            <div className="flex space-x-4">
              <Link
                href={route('register')}
                className="px-6 py-3 bg-green-400 text-white rounded-md text-sm hover:bg-blue-700 transition"
              >
                Get started
              </Link>
              <Link
                href={route('contact-us')}
                className="px-6 py-3 border border-white text-white rounded-md text-sm hover:bg-white hover:text-green-600 transition"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerSlider;
