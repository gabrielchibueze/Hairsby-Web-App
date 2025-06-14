import { Button } from "@/components/ui/button";
import { FileSearch, Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-hairsby-dark/5 to-white flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 bg-hairsby-orange/10 rounded-full blur-md"></div>
          <div className="relative flex items-center justify-center w-full h-full">
            <FileSearch
              className="h-16 w-16 text-hairsby-orange"
              strokeWidth={1.5}
            />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          Page Not Found
        </h2>

        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or may have been moved.
          Please check the URL or return to our homepage.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="brand">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Return Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/contact" className="flex items-center gap-2">
              Contact Support
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
