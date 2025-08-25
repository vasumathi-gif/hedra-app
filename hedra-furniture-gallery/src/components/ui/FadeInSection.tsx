// src/components/animations/FadeInSection.tsx
import React, { useRef, useState, useEffect } from 'react';

type FadeInSectionProps = {
  children: React.ReactNode;
  delay?: number;
};

const FadeInSection: React.FC<FadeInSectionProps> = ({ children, delay = 0 }) => {
  const domRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect(); // Trigger only once
          }
        });
      },
      { threshold: 0.1 }
    );

    if (domRef.current) observer.observe(domRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-[\\[cubic-bezier(0.22,1,0.36,1)\\]] transform
        ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}
      `}
      style={{
        transitionDelay: `${delay}s`,
      }}
    >
      {children}
    </div>
  );
};

export default FadeInSection;
    