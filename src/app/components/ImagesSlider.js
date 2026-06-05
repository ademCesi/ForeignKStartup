import React, { useState, useEffect, useCallback } from "react";
import "../styles/ImagesSlider.scss";
import slide1 from "../assets/images/slide1.jpg";
import slide2 from "../assets/images/slide2.jpg";
import slide3 from "../assets/images/slide3.jpg";
import slide4 from "../assets/images/slide4.jpg";
import slide5 from "../assets/images/slide5.jpg";
import { useTranslation } from "react-i18next";

const SLIDES = [
  { id: 1, url: slide1 },
  { id: 2, url: slide2 },
  { id: 3, url: slide3 },
  { id: 4, url: slide4 },
  { id: 5, url: slide5 },
];

const ImageSlider = () => {
    const { t } = useTranslation();
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const goTo = useCallback((index) => {
    if (index === current) return;
    setPrev(current);
    setCurrent(index);
    setTimeout(() => {
      setPrev(null);
    }, 900);
  }, [current]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => {
        const next = (c + 1) % SLIDES.length;
        setPrev(c);
        setTimeout(() => {
          setPrev(null);
        }, 900);
        return next;
      });
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="slider">
      {/* Images */}
      <div className="slider__track">
        {SLIDES.map((slide, i) => (
          <div
            key={slide.id}
            className={`slider__slide
              ${i === current ? "slider__slide--current" : ""}
              ${i === prev ? "slider__slide--prev" : ""}
            `}
            style={{ backgroundImage: `url(${slide.url})` }}
          />
        ))}
      </div>

      {/* Overlay */}
      <div className="slider__overlay" />

      {/* Static text */}
      <div className="slider__content">
        <h1 className="slider__title">{t("title_home")}</h1>
        <p className="slider__subtitle">{t("subtitle_home")}</p>
        <div className="slider__cta">
          <button className="slider__btn">{t("start_journey")}</button>
        </div>
      </div>

      {/* Dots */}
      <div className="slider__dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`slider__dot ${i === current ? "slider__dot--active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="slider__progress">
        <div
          key={current}
          className="slider__progress-bar"
          style={{ animationDuration: `6000ms` }}
        />
      </div>
    </div>
  );
};

export default ImageSlider;