import React from 'react';
import { Flag } from 'lucide-react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative">
        <Flag className="h-10 w-10 text-red-600" />
        <div className="absolute top-0 right-0 h-10 w-5 overflow-hidden">
          <div className="h-10 w-10 bg-blue-800 rounded-full translate-x-2"></div>
        </div>
      </div>
      <div className="ml-2">
        <div className="text-blue-900 font-bold text-lg leading-none">NATIONAL</div>
        <div className="text-blue-900 font-bold text-xs">DEBT RELIEF</div>
      </div>
    </div>
  );
};

export default Logo;