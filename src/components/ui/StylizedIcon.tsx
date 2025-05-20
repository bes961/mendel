import React from 'react';
import '../../styles/icons.css';
import '../../styles/duotone.css';

interface StylizedIconProps {
  icon: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'default';
  effect?: 'glow' | 'gradient' | 'pulse' | 'outline' | 'bounce' | 'spin' | 'shake' | 'reflect' | 'dualtone' | 'none';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
  adaptive?: boolean;
  duotone?: boolean;
}

/**
 * StylizedIcon - Componente que adiciona efeitos visuais avançados aos ícones
 */
const StylizedIcon: React.FC<StylizedIconProps> = ({
  icon,
  variant = 'default',
  effect = 'none',
  className = '',
  size = 'md',
  onClick,
  adaptive = false,
  duotone = true
}) => {
  // Definir as classes CSS com base nas props
  const variantClass = variant !== 'default' ? `icon-${variant}` : '';
  const effectClass = effect !== 'none' ? `icon-${effect}` : '';
  const sizeClass = `icon-size-${size}`;
  const adaptiveClass = adaptive ? 'icon-adaptive' : '';
  const duotoneClass = duotone ? 'fa-duotone' : '';
  
  return (
    <span 
      className={`icon-wrapper ${sizeClass} ${variantClass} ${effectClass} ${adaptiveClass} ${duotoneClass} ${className}`}
      onClick={onClick}
    >
      {icon}
    </span>
  );
};

export default StylizedIcon; 