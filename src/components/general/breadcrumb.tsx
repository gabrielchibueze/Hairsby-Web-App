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
      <div className="container px-4 sm:px-8 flex items-center text-sm text-gray-600 truncate">
        {breadcrumb.map((item, index) => {
          const isLast = index === breadcrumb.length - 1;

          const abbrevatedName = (name:string)=>{
            return name.length > 10 ? name.substring(0, 7) + "..." : name
          }
          return (
            <div key={index} className="flex items-center truncate ">
              {item.link && !isLast ? (
                <Link href={item.link} className="hover:text-gray-900 ">
                  {item.name}
                </Link>
              ) : (
                <span className="font-medium text-gray-900 truncate">{item.name}</span>
              )}
              {!isLast && <ChevronRight className="h-4 w-4 mx-2" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
