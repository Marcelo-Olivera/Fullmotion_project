import React, { useState } from "react";
import styles from "./Carrossel.module.css";

interface Slide {
  id: number;
  text: string;
  image: string;
}

const slides: Slide[] = [
  {
    id: 1,
    text: "Texto do Slide 1",
    image: "src/components/Carrossel/back1.png",
  },
  {
    id: 2,
    text: "Texto do Slide 2",
    image: "src/components/Carrossel/back2.png",
  },
  {
    id: 3,
    text: "Texto do Slide 3",
    image: "src/components/Carrossel/back3.png",
  },
];

const Carrossel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      (prevIndex - 1 + slides.length) % slides.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className={styles.carouselContainer}>
      <div
        className={styles.slide}
        style={{ backgroundImage: `url(${slides[currentIndex].image})` }}
      >
        <p className={styles.textOverlay}>{slides[currentIndex].text}</p>
      </div>

      <button className={styles.prev} onClick={prevSlide}>
        &#10094;
      </button>
      <button className={styles.next} onClick={nextSlide}>
        &#10095;
      </button>

      <div className={styles.dots}>
        {slides.map((_, index) => (
          <span
            key={index}
            className={
              index === currentIndex ? styles.activeDot : styles.dot
            }
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carrossel;
