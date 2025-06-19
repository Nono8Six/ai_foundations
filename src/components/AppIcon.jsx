import React from 'react';
import * as LucideIcons from 'lucide-react';

function Icon({
  name,
  size = 24,
  color = 'currentColor',
  className = '',
  strokeWidth = 2,
  ...props
}) {
  const IconComponent = LucideIcons[name];

  if (!IconComponent) {
    return (
      <LucideIcons.HelpCircle
        size={size}
        color='gray'
        strokeWidth={strokeWidth}
        className={className}
        {...props}
      />
    );
  }

  return (
    <IconComponent
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      className={className}
      {...props}
    />
  );
}
export default Icon;
