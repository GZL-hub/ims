import React from 'react';

interface JapaneseLogoProps {
  className?: string;
  size?: number;
}

const JapaneseLogo: React.FC<JapaneseLogoProps> = ({ className = '', size = 40 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer circle - traditional mon style */}
      <circle
        cx="50"
        cy="50"
        r="45"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />

      {/* Inner geometric pattern - represents storage/inventory */}
      {/* Three stacked rectangles symbolizing inventory levels */}
      <rect
        x="25"
        y="60"
        width="50"
        height="8"
        fill="currentColor"
        rx="1"
      />
      <rect
        x="30"
        y="48"
        width="40"
        height="8"
        fill="currentColor"
        rx="1"
      />
      <rect
        x="35"
        y="36"
        width="30"
        height="8"
        fill="currentColor"
        rx="1"
      />

      {/* Vertical line - pillar/support */}
      <rect
        x="48"
        y="24"
        width="4"
        height="50"
        fill="currentColor"
        rx="1"
      />

      {/* Top accent - roof-like element inspired by torii gates */}
      <path
        d="M 35 28 L 50 22 L 65 28"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Small circles at corners - traditional Japanese design element */}
      <circle cx="50" cy="20" r="3" fill="currentColor" />
      <circle cx="50" cy="76" r="3" fill="currentColor" />
    </svg>
  );
};

export default JapaneseLogo;
