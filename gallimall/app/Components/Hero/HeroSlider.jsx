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
import kirana from "../../../public/images/Category/Local Kirana store.jpg";
import tiffins from "../../../public/images/Category/Tiffin.jpg";
import veg_fruits from "../../../public/images/Fresh Fruits.jpg";
import dairy from "../../../public/images/Category/dairy $ Bakery.jpg";

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
    <div className="w-full h-[350px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="w-full h-full"
      >
        {Slides.map((slide, index) => (
          <SwiperSlide key={index}>
            {slide.custom ? (
              // Custom animated first slide
              <div className="w-full h-full relative overflow-hidden">
                {/* Animated Background */}
<div className={`absolute inset-0 animate-wave bg-gradient-to-r ${slide.bgClass} bg-[length:400%_400%] z-0 rounded-xl`} />

                {/* Content */}
    <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center text-gray-800">
      <h2 className="text-2xl md:text-5xl font-bold mb-2 drop-shadow">{slide.title}</h2>
      <p className="text-md md:text-xl mb-6 drop-shadow">{slide.description}</p>

      {/* Images */}
      <div className="flex flex-wrap md:flex-nowrap items-center justify-center gap-4 md:gap-6">
        {slide.images.map((img, i) => (
          <div key={i} className="animate-slide-in">
            <Image
              src={img}
              alt={`Slide image ${i}`}
              width={150}
              height={150}
              className="rounded-xl object-cover w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 shadow-lg"
            />
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <Link href="/authentication/register">
        <button className="animate-button flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black px-5 py-2 rounded-full font-semibold mt-6 transition">
          {slide.cta}
          <IoArrowForwardOutline className="text-xl" />
        </button>
      </Link>
    </div>
  </div>
            ) : (
              // Other regular slides
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
