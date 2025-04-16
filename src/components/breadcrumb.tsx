import { ChevronRight } from "lucide-react";
import Link from "next/link";

export interface BreadcrumbItem {
  name: string;
  link?: string; // make link optional for current/last item
}

interface BreadcrumbProps {
  breadcrumb: BreadcrumbItem[];
}

export default function Breadcrumb({ breadcrumb }: BreadcrumbProps) {
  return (
    <div className="bg-gray-50 py-4">
      <div className="container px-4 sm:px-8 flex items-center text-sm text-gray-600">
        {breadcrumb.map((item, index) => {
          const isLast = index === breadcrumb.length - 1;
          return (
            <div key={index} className="flex items-center">
              {item.link && !isLast ? (
                <Link href={item.link} className="hover:text-gray-900">
                  {item.name}
                </Link>
              ) : (
                <span className="font-medium text-gray-900">{item.name}</span>
              )}
              {!isLast && <ChevronRight className="h-4 w-4 mx-2" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
