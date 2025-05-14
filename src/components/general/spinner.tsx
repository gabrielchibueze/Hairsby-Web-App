import { cn } from "@/lib/utils";

export default function Spinner({
  plain = false,
  className,
}: {
  plain?: boolean;
  className?: string;
}) {
  if (plain) {
    return (
      <span
        className={cn(
          "animate-spin border-b-2 h-6 w-6 border-gray-50 rounded-full",
          className
        )}
      ></span>
    );
  } else {
    return (
      <div className="animate-spin w-8 h-8 border-b-2 rounded-full absolute border-hairsby-orange"></div>
    );
  }
}
