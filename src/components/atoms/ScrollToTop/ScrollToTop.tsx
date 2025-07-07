import { useState, useEffect } from 'react';
import { cn } from '@src/lib/utils';

type ScrollToTopProps = {
  children: React.ReactNode;
};

export const ScrollToTop = ({ children }: ScrollToTopProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 1500);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const handleClick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div
      className={cn(
        'fixed right-4 bottom-4 transition-opacity duration-300',
        isVisible ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
      onClick={handleClick}
      role="presentation"
    >
      {children}
    </div>
  );
};
