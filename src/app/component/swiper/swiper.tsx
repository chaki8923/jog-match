'use client'
import React from 'react';
// Import Swiper React components
import { Autoplay, Navigation, Pagination, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import styles from "./index.module.scss";


const images = [
  { img: "/jog1.jpg", text: "素晴らしい" },
  { img: "/jog2.jpg", text: "健康" },
  { img: "/jog3.jpg", text: "ジョギングマッチング" },
  { img: "/jog3.jpg", text: "健康に出会いを" },
];


export default function TopSwiper() {
 
  return (
    <>
      <Swiper
        direction="vertical" // 縦スライド
        slidesPerView={1}
        speed={1000} // スライドが切り替わる時の速度
        spaceBetween={30}
        navigation
        pagination={{ clickable: true }}
        loop={false}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }} // スライド表示時間
        modules={[Navigation, Pagination, EffectFade]}
        style={{ height: '100vh' }} // スライダーの高さを調整
      >

        {images.map((item, index: number) => (
          <SwiperSlide key={index} className={styles.relative}>
            <p className={styles.slideMessage}>{item.text}</p>
            <Image
              src={item.img}
              width={1920}
              height={1038}
              alt="Slider Image"
              sizes="(min-width: 1024px) 100vw, 100vw"
              loading="eager"
              className={styles.slideImage}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className={styles.scrollDown}>
        <div className={styles.mousey}>
          <div className={styles.scroller}></div>
        </div>
      </div>
    </>
  );
}
