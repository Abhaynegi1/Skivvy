'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import HeroSection from '../_components/HeroSection';
import HowItWorksSection from '../_components/HowItWorksSection';
import ExploreMoreAISection from '../_components/ExploreMoreAISection';

const MiyazArtLanding = () => {
  const heroRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    // Animate hero section on mount
    const hero = heroRef.current as HTMLElement | null;
    if (hero) {
      hero.style.opacity = '0';
      hero.style.transform = 'translateY(30px)';
      setTimeout(() => {
        hero.style.transition = 'all 0.8s ease-out';
        hero.style.opacity = '1';
        hero.style.transform = 'translateY(0)';
      }, 100);
    }
    // Animate features on scroll
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).style.opacity = '1';
          (entry.target as HTMLElement).style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach((el) => {
      (el as HTMLElement).style.opacity = '0';
      (el as HTMLElement).style.transform = 'translateY(30px)';
      (el as HTMLElement).style.transition = 'all 0.6s ease-out';
      observer.observe(el);
    });
    // Animate main card on mount with GSAP
    const card = cardRef.current as HTMLElement | null;
    if (card) {
      gsap.fromTo(
        card,
        { opacity: 0, scale: 0.7 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.1,
          ease: 'elastic.out(1, 0.6)',
          delay: 0.2,
        }
      );
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF4E8' }}>
      <HeroSection />
      <HowItWorksSection />
      <ExploreMoreAISection />
    </div>
  );
};

export default MiyazArtLanding;