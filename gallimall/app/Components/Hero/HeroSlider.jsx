"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Link from 'next/link';
import { IoArrowForwardOutline } from 'react-icons/io5';
import Image from "next/image";

// Images for sliders
import kirana from "../../../public/images/Category/local-kirana-store.jpg";
import tiffins from "../../../public/images/Category/tiffin.jpg";
import veg_fruits from "../../../public/images/Category/fresh-fruits.jpg";
import dairy from "../../../public/images/Category/dairy-bakery.jpg";


const Slides = [
  {
    title: "Shop Local, Get It Fast",
    description: "Your favorite stores, groceries, and essentials at your doorstep.",
    images: [kirana, tiffins, veg_fruits, dairy],
    cta: "Start Shopping",
    custom: true,
    bgClass: "from-yellow-300 via-gray-200 to-blue-300",
  },
  {
    title: "Support Your Neighborhood",
    description: "Empower local vendors with every purchase.",
    images: [kirana, tiffins, veg_fruits, dairy],
    cta: "Browse Stores",
    custom: true,
    bgClass: "from-pink-300 via-red-200 to-purple-300",
  },
  {
    title: "Same-Day Delivery Available",
    description: "From fresh veggies to electronics — delivered the same day.",
    images: [kirana, tiffins, veg_fruits, dairy],
    cta: "Explore Now",
    custom: true,
    bgClass: "from-green-300 via-lime-200 to-teal-300",
  },
];

const HeroSlider = () => {
   return (
    <div className="w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[90vh] xl:h-[95vh]">
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[Autoplay, Pagination]}
        className="w-full h-full"
      >
        {Slides.map((slide, index) => (
          <SwiperSlide key={index}>
            {slide.custom ? (
              <div className="w-full h-full relative overflow-hidden">
                {/* Animated Gradient Background */}
                <div className={`absolute inset-0 animate-wave bg-gradient-to-r ${slide.bgClass} bg-[length:400%_400%] z-0`} />

                {/* Slide Content */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 sm:px-6 lg:px-12 text-center text-gray-800">
                  <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold mb-2 drop-shadow">
                    {slide.title}
                  </h2>
                  <p className="text-sm sm:text-md md:text-lg lg:text-xl mb-6 drop-shadow">
                    {slide.description}
                  </p>

                  {/* Images Row */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8">
                    {slide.images.map((img, i) => (
                      <div key={i} className="animate-slide-in">
                        <Image
                          src={img}
                          alt={`Slide image ${i}`}
                          width={160}
                          height={160}
                          className="rounded-xl object-cover w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 shadow-md"
                        />
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Link href="/authentication/register">
                    <button className="animate-button flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black px-4 sm:px-6 py-2 rounded-full font-semibold mt-6 transition-all">
                      {slide.cta}
                      <IoArrowForwardOutline className="text-lg sm:text-xl" />
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              // Fallback if custom = false (not used here)
              <div
                className="w-full h-full bg-cover bg-center relative"
                style={{ backgroundImage: `url(${slide.images})` }}
              >
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white px-4 text-center">
                  <h2 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow">{slide.title}</h2>
                  <p className="text-lg md:text-xl mb-6 drop-shadow">{slide.description}</p>
                  <Link href="/authentication/register">
                    <button className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition">
                      {slide.cta}
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroSlider;
