import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface LogoProps {
  className?: string;
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 32 }) => {
  const { theme } = useTheme();

  // Determine which logo to use based on theme
  const logoSrc = theme === 'dark'
    ? '/logo(darkmode).png'
    : '/logo(lightmode).png';

  return (
    <img
      src={logoSrc}
      alt="i-IMS Logo"
      className={className}
      style={{ height: size, width: 'auto' }}
    />
  );
};

export default Logo;
