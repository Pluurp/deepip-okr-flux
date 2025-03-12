
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
};

const Logo = ({ className }: LogoProps) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 ease-in-out transform group-hover:rotate-6"
      >
        <rect width="40" height="40" rx="8" fill="#4B48FF" />
        <path
          d="M22.5 8.33334H30.8333V16.6667H22.5V8.33334Z"
          fill="white"
        />
        <path
          d="M13.3333 15.8333C13.3333 14.2681 14.6014 13 16.1667 13H23.3333C24.8986 13 26.1667 14.2681 26.1667 15.8333V23C26.1667 24.5652 24.8986 25.8333 23.3333 25.8333H16.1667C14.6014 25.8333 13.3333 24.5652 13.3333 23V15.8333Z"
          fill="white"
        />
        <path
          d="M8.33337 21.6667C8.33337 20.1014 9.60147 18.8333 11.1667 18.8333H18.3334C19.8986 18.8333 21.1667 20.1014 21.1667 21.6667V28.8333C21.1667 30.3986 19.8986 31.6667 18.3334 31.6667H11.1667C9.60147 31.6667 8.33337 30.3986 8.33337 28.8333V21.6667Z"
          fill="white"
        />
      </svg>
      <span className="text-xl font-bold text-deepip-primary">DeepIP</span>
    </div>
  );
};

export default Logo;
