
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
};

const Logo = ({ className }: LogoProps) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <img 
        src="/lovable-uploads/00ac3caa-0c36-4e61-9c69-ad4ae95223ff.png" 
        alt="DeepIP Logo" 
        width="40" 
        height="40" 
        className="transition-transform duration-300 ease-in-out transform group-hover:rotate-6"
      />
      <span className="text-xl font-bold text-deepip-primary">DeepIP</span>
    </div>
  );
};

export default Logo;
