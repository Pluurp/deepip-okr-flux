
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
};

const Logo = ({ className }: LogoProps) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <img 
        src="/lovable-uploads/04f0f225-3594-4337-972a-5b5c9a55a699.png" 
        alt="PRIOR LABS Logo" 
        width="40" 
        height="40" 
        className="transition-transform duration-300 ease-in-out transform group-hover:rotate-6"
      />
      <span className="text-xl font-bold text-deepip-primary">PRIOR LABS</span>
    </div>
  );
};

export default Logo;
