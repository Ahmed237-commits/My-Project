'use client'; 
import React, { useState, useEffect } from 'react'; 
import { FaArrowUp } from 'react-icons/fa'; 
 
const Scrolling = () => { 
  const [showButton, setShowButton] = useState(false); 
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => { 
    const handleScroll = () => { 
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (scrollTop / docHeight) * 100;

      setShowButton(scrollTop >= 250); 
      setScrollPercent(scrolled);
    }; 
 
    window.addEventListener('scroll', handleScroll); 
    return () => window.removeEventListener('scroll', handleScroll); 
  }, []); 
 
  const scrollToTop = () => { 
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth', 
    }); 
  }; 

  const progressColor = `hsl(${120 - (scrollPercent * 1.2)}, 100%, 50%)`;

  return ( 
    <> 
      {showButton && ( 
        <div 
          onClick={scrollToTop} 
          style={{ 
            position: 'fixed', 
            bottom: '20px', 
            right: '', 
            width: '45px',   // أصغر
            height: '45px',  // أصغر
            borderRadius: '50%', 
            cursor: 'pointer', 
            backgroundColor: 'black', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: '#fff',
          }} 
        > 
          {/* البوردر الدائري */} 
          <svg 
            style={{ position: 'absolute', top: 0, left: 0 }} 
            width="45" 
            height="45" 
            viewBox="0 0 36 36" 
          > 
            <circle
              cx="18" 
              cy="18" 
              r="16" 
              fill="none" 
              stroke="#ddd"  // الخلفية الرمادية للبوردر
              strokeWidth="3"
            />
            <circle
              cx="18" 
              cy="18" 
              r="16" 
              fill="none" 
              stroke={progressColor} 
              strokeWidth="3" 
              strokeDasharray={`${(scrollPercent/100) * (2 * Math.PI * 16)} , ${2 * Math.PI * 16}`} 
              strokeLinecap="round"
              transform="rotate(-90 18 18)" 
            /> 
          </svg> 

          <FaArrowUp size={16} /> 
        </div> 
      )} 
    </> 
  ); 
}; 
 
export default Scrolling;
