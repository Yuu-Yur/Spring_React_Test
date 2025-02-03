import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

const ScrollToTopButton = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    showButton && (
      <Button
        variant="dark"
        onClick={scrollToTop}
        style={{
          position: 'fixed',
          bottom: '50px',
          right: '5px',
          zIndex: 1000,
          borderRadius: '50%',
          padding: '10px 15px',
        }}
      >
        ▲
      </Button>
    )
  );
};

export default ScrollToTopButton;
