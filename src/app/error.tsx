"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
    // You can also log to an error reporting service here
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-hairsby-dark/5 to-white flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 bg-red-100 rounded-full blur-md"></div>
          <div className="relative flex items-center justify-center w-full h-full">
            <AlertTriangle
              className="h-16 w-16 text-red-500"
              strokeWidth={1.5}
            />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">Error</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          Something went wrong!
        </h2>

        {process.env.NODE_ENV === "production" ? (
          <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6">
            <p className="text-red-600 font-medium">
              An unexpected error occurred
            </p>
          </div>
        ) : (
          <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6">
            <p className="text-red-600 font-medium">
              {error.message || "An unexpected error occurred"}
            </p>
            {error.digest && (
              <p className="text-xs text-red-400 mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          <Button variant="outline" asChild>
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Return Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
