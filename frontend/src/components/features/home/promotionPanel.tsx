import pp from '@styles/features/promotionpanel.module.scss';
import React, { useEffect, useRef, useState } from "react";

const PromotionPanel: React.FC = () => {
    const images = ["/stock-images/promo1.png", "/stock-images/promo2.png", "/stock-images/promo3.png"];
    
    const [currentIndex, setCurrentIndex] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const slides = [images[images.length - 1], ...images, images[0]];
    const totalSlides = slides.length;

    const handleNext = () => {
        if (currentIndex >= totalSlides - 1) return;
        setIsTransitioning(true);
        setCurrentIndex(prev => prev + 1);
    };

    const handlePrev = () => {
        if (currentIndex <= 0) return;
        setIsTransitioning(true);
        setCurrentIndex(prev => prev - 1);
    };

    const handleTransitionEnd = () => {
        if (currentIndex === totalSlides - 1) {
            setIsTransitioning(false);
            setCurrentIndex(1);
        } else if (currentIndex === 0) {
            setIsTransitioning(false);
            setCurrentIndex(totalSlides - 2);
        }
    };

    
    useEffect(() => {
        if (!isPaused) {
            timeoutRef.current = setInterval(handleNext, 5000);
        }
        return () => { if (timeoutRef.current) clearInterval(timeoutRef.current); };
    }, [isPaused, currentIndex]);

    return (
        <div 
            className={pp.panelsContainer}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            role="region"
            aria-roledescription="carousel"
        >
            <div className={pp.controller}>
                <button onClick={handlePrev}>Prev</button>
                <button onClick={handleNext}>Next</button>
            </div>

            <div className={pp.carouselContainer}>
                <ol
                    className={pp.carouselList}
                    onTransitionEnd={handleTransitionEnd}
                    style={{
                        transform: `translateX(-${currentIndex * 100}%)`,
                        transition: isTransitioning ? 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
                    }}
                >
                    {slides.map((src, index) => {
                        const isClone = index === 0 || index === totalSlides - 1;
                        const actualPos = index === 0 ? images.length : index === totalSlides - 1 ? 1 : index;

                        return (
                            <li
                                key={`${index}-${src}`}
                                className={pp.slide}
                                role="group"
                                aria-roledescription="slide"
                                aria-hidden={isClone || index !== currentIndex}
                                aria-posinset={actualPos}
                                aria-setsize={images.length}
                            >
                                <a href="#" className={pp.promoLink}>
                                    <img src={src} alt={`Promotion ${actualPos}`} />
                                </a>
                            </li>
                        );
                    })}
                </ol>
            </div>
        </div>
    );
};

export default PromotionPanel;