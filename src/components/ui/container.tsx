import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const Container = ({ children, className }: ContainerProps) => {
  return <div className={cn("mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-16", className)}>{children}</div>;
};
