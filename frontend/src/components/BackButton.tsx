import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function BackButton({ onClick, className = '' }: { onClick?: () => void, className?: string }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`group relative w-[76px] h-[76px] m-0 overflow-hidden outline-none bg-transparent cursor-pointer border-0 rounded-full focus:outline-none ${className}`}
      aria-label="Go back"
    >
      {/* Initial Border */}
      <div className="absolute inset-[7px] rounded-full border-[3px] border-foreground 
        transition-all duration-500 ease-[cubic-bezier(0.455,0.03,0.515,0.955)] delay-[80ms] 
        group-hover:opacity-0 group-hover:scale-75 group-hover:transition-all group-hover:duration-400 group-hover:ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:delay-0" />
      
      {/* Hover Border (Primary color) */}
      <div className="absolute inset-[7px] rounded-full border-[4px] border-primary scale-125 opacity-0 
        transition-all duration-400 ease-[cubic-bezier(0.165,0.84,0.44,1)] 
        group-hover:opacity-100 group-hover:scale-100 group-hover:transition-all group-hover:duration-500 group-hover:ease-[cubic-bezier(0.455,0.03,0.515,0.955)] group-hover:delay-[80ms]" />
      
      {/* Sliding icons container */}
      <div className="absolute top-0 left-0 flex transition-transform duration-400 ease-in-out group-hover:-translate-x-[76px]">
         <div className="w-[76px] h-[76px] flex items-center justify-center shrink-0">
            <ChevronLeft className="w-8 h-8 text-foreground transition-colors" strokeWidth={2.5} />
         </div>
         <div className="w-[76px] h-[76px] flex items-center justify-center shrink-0">
            <ChevronLeft className="w-8 h-8 text-primary" strokeWidth={3} />
         </div>
      </div>
    </button>
  );
}
