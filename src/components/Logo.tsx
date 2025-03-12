
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
};

const Logo = ({ className }: LogoProps) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <img
        src="/lovable-uploads/a1b1f37d-61e7-4d54-87ac-5bbec4f53e4e.png"
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
