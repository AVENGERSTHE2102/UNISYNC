import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1400&q=80',
    alt: 'Students studying together on campus'
  },
  {
    src: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1400&q=80',
    alt: 'Students collaborating around a table'
  },
  {
    src: 'https://images.unsplash.com/photo-1638029202288-451a89e0d55f?auto=format&fit=crop&w=1400&q=80',
    alt: 'Students collaborating at a campus hackathon'
  },
  {
    src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1400&q=80',
    alt: 'Students working together at a hackathon event'
  }
];

function HeroImageSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentSlide((current) => (current + 1) % slides.length);
    }, 3800);

    return () => window.clearInterval(intervalId);
  }, []);

  function goToPrevious() {
    setCurrentSlide((current) => (current - 1 + slides.length) % slides.length);
  }

  function goToNext() {
    setCurrentSlide((current) => (current + 1) % slides.length);
  }

  return (
    <div className="hero-slider" aria-roledescription="carousel" aria-label="Campus life image slider">
      <div
        className="hero-slider__track"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div className="hero-slider__slide" key={slide.src}>
            <img alt={slide.alt} src={slide.src} />
          </div>
        ))}
      </div>

      <button
        aria-label="Show previous campus image"
        className="hero-slider__arrow hero-slider__arrow--prev"
        onClick={goToPrevious}
        type="button"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        aria-label="Show next campus image"
        className="hero-slider__arrow hero-slider__arrow--next"
        onClick={goToNext}
        type="button"
      >
        <ChevronRight size={18} />
      </button>

      <div className="hero-slider__dots" aria-label="Choose campus image">
        {slides.map((slide, index) => (
          <button
            aria-label={`Show slide ${index + 1}: ${slide.alt}`}
            aria-current={index === currentSlide ? 'true' : undefined}
            className={index === currentSlide ? 'active' : ''}
            key={slide.src}
            onClick={() => setCurrentSlide(index)}
            type="button"
          />
        ))}
      </div>
    </div>
  );
}

export default HeroImageSlider;
