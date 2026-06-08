// components/Loader.jsx
'use client';
import React from 'react';

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="cyber-loader">
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="shadow"></div>
      </div>
      <p className="loading-text">جاري التحميل...</p>
      <style jsx>{`
        .loader-container {
          display: flex;
          flex-direction: column;
          justify-align: center;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .cyber-loader {
          position: relative;
          width: 120px;
          height: 120px;
          margin-bottom: 2rem;
        }

        .circle {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 4px solid transparent;
          border-top-color: #00d4ff;
          border-bottom-color: #ff2d75;
          animation: spin 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
        }

        .circle:nth-child(2) {
          width: 80%;
          height: 80%;
          top: 10%;
          left: 10%;
          border-top-color: #ffbf00;
          border-bottom-color: #00ff88;
          animation-duration: 1.2s;
          animation-direction: reverse;
        }

        .circle:nth-child(3) {
          width: 60%;
          height: 60%;
          top: 20%;
          left: 20%;
          border-top-color: #ff6b35;
          border-bottom-color: #a855f7;
          animation-duration: 1s;
        }

        .shadow {
          position: absolute;
          bottom: -20px;
          left: 10%;
          width: 80%;
          height: 12px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 50%;
          filter: blur(6px);
          animation: pulse 1.5s ease-in-out infinite;
        }

        .loading-text {
          color: #cbd5e1;
          font-size: 1.2rem;
          font-weight: 500;
          letter-spacing: 2px;
          margin-top: 1rem;
          animation: fadePulse 1.8s infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scaleX(0.8);
            opacity: 0.3;
          }
          50% {
            transform: scaleX(1.2);
            opacity: 0.6;
          }
        }

        @keyframes fadePulse {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }

        /* للتكيف مع الوضع المظلم/الفاتح إذا أردت */
        @media (prefers-color-scheme: light) {
          .loader-container {
            background: linear-gradient(135deg, #e2e8f0 0%, #f1f5f9 100%);
          }
          .loading-text {
            color: #1e293b;
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;