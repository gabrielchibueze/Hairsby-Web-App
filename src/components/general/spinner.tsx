import { cn } from "@/lib/utils";

type SpinnerProps = {
  plain?: boolean;
  size?: "default" | "xs" | "sm" | "lg" | "icon";
  className?: string;
};

const sizeClasses = {
  default: "h-6 w-6",
  xs: "h-4 w-4",
  sm: "h-8 w-8",
  lg: "h-10 w-10",
  icon: "h-9 w-9",
};

export default function Spinner({
  plain = false,
  size = "sm",
  className,
}: SpinnerProps) {
  const classes = plain
    ? cn(
        "animate-spin border-b-2  border-gray-50 rounded-full",
        className,
        sizeClasses[size]
      )
    : cn(
        "animate-spin border-b-2 rounded-full absolute border-hairsby-orange",
        className,
        sizeClasses[size]
      );

  return <span className={classes} />;
}
