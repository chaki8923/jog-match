'use client'
import React, { useRef, useState } from 'react';
import { signIn } from "next-auth/react";
// Import Swiper React components
import { Navigation, Pagination, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import styles from "./index.module.scss";

const images = [
  { img: "/jog1.jpg", text: "走ることで、出会いが始まる" },
  { img: "/jog2.jpg", text: "あなたのペースや興味に合わせて最適なジョギングパートナーを見つける" },
  { img: "/jog4.jpg", text: "ジョギングを通じて、新しい友達や仲間をつくりませんか？" },
  { img: "/jog3.jpg", text: "さぁ、出会いと健康を掴みにに行こう" },
];

interface SwiperInstance {
  slideNext: () => void;
  // 必要な他のメソッドを追加
}

export default function TopSwiper() {
  const swiperRef = useRef<SwiperInstance | null>(null); // Swiper インスタンスを保持
  const [activeIndex, setActiveIndex] = useState(0);
  const changeSlide = () => {
    swiperRef.current?.slideNext()
  };


  const handleSaveData = async () => {
    try {
      await signIn('google', { redirectTo: "/profile" });
    } catch (error) {
      console.error("ログインエラー:", error);
      throw error;
    }
  };


  return (
    <>
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)} // Swiper インスタンスを取得
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.activeIndex); // スライド変更時にインデックスを更新
        }}
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
            <p className={`${styles.slideMessage} ${activeIndex == 3 ? styles.fadeIn : ''}`}>{item.text}</p>
            {activeIndex == 3 && (
              <button onClick={() => handleSaveData()}
                className={styles.googleLoginBtn}>
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Logo" />
                <span>Get started with Google</span>
              </button>
            )}
            <Image
              src={item.img}
              width={1920}
              height={1038}
              alt={item.text}
              sizes="(min-width: 1024px) 100vw, 100vw"
              loading="eager"
              className={styles.slideImage}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      {activeIndex < 3 && (
      <div className={`${styles.scrollDown}`}
        onClick={() => changeSlide()}>
        <div className={styles.mousey}>
          <div className={styles.scroller}></div>
        </div>
      </div>
      )}
    </>
  );
}
