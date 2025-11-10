
import React from 'react';

const TrophyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
    <path d="M4 22h16"></path>
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21A2.48 2.48 0 0 1 8 22"></path>
    <path d="M14 14.66V17c0 .55.47.98.97 1.21A2.48 2.48 0 0 0 16 22"></path>
    <path d="M8 4h8"></path>
    <path d="M8 2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2H8V2Z"></path>
    <path d="M12 18v-3.34"></path>
    <path d="M12 14.66c.33 0 .66.02 1 .05"></path>
    <path d="M12 14.66a2.5 2.5 0 0 0-1 .05"></path>
  </svg>
);

export default TrophyIcon;
