import React from 'react';
import { MeshGradient } from '@paper-design/shaders-react';

interface ShaderBackgroundProps {
  children: React.ReactNode;
}

const ShaderBackground: React.FC<ShaderBackgroundProps> = ({ children }) => {
  return (
    <div className="w-full h-full relative overflow-hidden bg-primary-800">
      {/* SVG Filters */}
      <svg className="absolute inset-0 w-0 h-0">
        <defs>
          <filter id="glass-effect" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence baseFrequency="0.005" numOctaves="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.3" />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0.02
                      0 1 0 0 0.02
                      0 0 1 0 0.05
                      0 0 0 0.9 0"
              result="tint"
            />
          </filter>
          <filter id="gooey-filter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="gooey"
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Background Shaders - Using theme colors */}
      <MeshGradient
        className="absolute inset-0 w-full h-full"
        colors={['#01213dff', '#3b84c4', '#042138ff', '#234f76', '#c8e6faff']}
        speed={0.3}
      />
      <MeshGradient
        className="absolute inset-0 w-full h-full opacity-50"
        colors={['#234f76', '#5b9fd7', '#4e80afff', '#132e46ff']}
        speed={0.2}
      />

      {/* Full panel backdrop blur to reduce white intensity */}
      <div className="absolute inset-0 w-full h-full backdrop-blur-sm bg-background-900/30"></div>

      {/* Content overlay */}
      <div className="absolute inset-0">{children}</div>
    </div>
  );
};

export default ShaderBackground;
