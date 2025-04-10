// // "use client";

// // import React, { useState, useEffect } from "react";
// // import { Search } from "lucide-react";
// // import { useRouter } from "next/navigation";
// // import Link from "next/link";
// // import { useDebounce } from "@/hooks/use-debounce";
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogHeader,
// //   DialogTitle,
// // } from "@/components/ui/dialog";
// // import { Input } from "@/components/ui/input";
// // import { Button } from "@/components/ui/button";
// // import { ScrollArea } from "@/components/ui/scroll-area";
// // import { getServices, getServiceCategories } from "@/lib/api/services/service";
// // import {
// //   getProducts,
// //   getAllProductCategories,
// // } from "@/lib/api/products/product";

// // interface Service {
// //   id: string;
// //   name: string;
// //   category: string;
// // }

// // interface Product {
// //   id: string;
// //   name: string;
// //   brand: string;
// // }

// // interface Category {
// //   id: string;
// //   name: string;
// // }

// // export default function SearchDialog({
// //   open,
// //   onOpenChange,
// // }: {
// //   open: boolean;
// //   onOpenChange: (open: boolean) => void;
// // }) {
// //   const [searchQuery, setSearchQuery] = useState("");
// //   const [searchResults, setSearchResults] = useState<{
// //     services: Service[];
// //     products: Product[];
// //     categories: Category[];
// //   }>({
// //     services: [],
// //     products: [],
// //     categories: [],
// //   });
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [selectedCategory, setSelectedCategory] = useState("all");
// //   const router = useRouter();
// //   const debouncedQuery = useDebounce(searchQuery, 500);

// //   useEffect(() => {
// //     if (debouncedQuery.length > 0 && open) {
// //       fetchSearchResults();
// //     } else {
// //       setSearchResults({ services: [], products: [], categories: [] });
// //     }
// //   }, [debouncedQuery, selectedCategory, open]);

// //   const fetchSearchResults = async () => {
// //     setIsLoading(true);
// //     try {
// //       const [services, serviceCategories, products, productCategories] =
// //         await Promise.all([
// //           getServices({
// //             query: debouncedQuery,
// //             category: selectedCategory !== "all" ? selectedCategory : undefined,
// //             page: 1,
// //             limit: 5,
// //           }),
// //           getServiceCategories(),
// //           getProducts({
// //             query: debouncedQuery,
// //             category: selectedCategory !== "all" ? selectedCategory : undefined,
// //             page: 1,
// //             limit: 5,
// //           }),
// //           getAllProductCategories(),
// //         ]);

// //       setSearchResults({
// //         services: services?.services || [],
// //         products: products || [],
// //         categories: [
// //           ...(serviceCategories || []),
// //           ...(productCategories || []),
// //         ],
// //       });
// //     } catch (error) {
// //       console.error("Search error:", error);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const handleSearch = (e: React.FormEvent) => {
// //     e.preventDefault();
// //     if (searchQuery.trim()) {
// //       router.push(
// //         `/search?q=${encodeURIComponent(searchQuery)}&category=${selectedCategory}`
// //       );
// //       onOpenChange(false);
// //     }
// //   };

// //   const handleQuickSearch = (query: string) => {
// //     setSearchQuery(query);
// //     router.push(`/services?category=${encodeURIComponent(query)}`);
// //     onOpenChange(false);
// //   };

// //   return (
// //     <Dialog open={open} onOpenChange={onOpenChange}>
// //       <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-hidden">
// //         <DialogHeader>
// //           <DialogTitle>Search Hairsby</DialogTitle>
// //         </DialogHeader>

// //         <form onSubmit={handleSearch} className="relative">
// //           <div className="flex gap-2 mb-4">
// //             <select
// //               value={selectedCategory}
// //               onChange={(e) => setSelectedCategory(e.target.value)}
// //               className="bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-hairsby-orange"
// //             >
// //               <option value="all">All Categories</option>
// //               {searchResults.categories.map((category) => (
// //                 <option key={category.id} value={category.name}>
// //                   {category.name}
// //                 </option>
// //               ))}
// //             </select>
// //             <Input
// //               type="text"
// //               placeholder="Search for salons, products..."
// //               value={searchQuery}
// //               onChange={(e) => setSearchQuery(e.target.value)}
// //               className="flex-grow"
// //               autoFocus
// //             />
// //             <Button
// //               type="submit"
// //               className="bg-hairsby-orange hover:bg-orange-600"
// //             >
// //               <Search size={18} />
// //             </Button>
// //           </div>
// //         </form>

// //         <div className="mb-4">
// //           <h3 className="text-sm font-medium mb-2">Quick Searches</h3>
// //           <div className="flex flex-wrap gap-2">
// //             {["Hair Salons", "Nail Salons", "Hair Products", "Stylists"].map(
// //               (item) => (
// //                 <Button
// //                   key={item}
// //                   variant="outline"
// //                   size="sm"
// //                   onClick={() => handleQuickSearch(item)}
// //                   className="text-xs"
// //                 >
// //                   {item}
// //                 </Button>
// //               )
// //             )}
// //           </div>
// //         </div>

// //         <ScrollArea className="h-[40vh] pr-4">
// //           {isLoading ? (
// //             <div className="flex justify-center py-8">
// //               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hairsby-orange"></div>
// //             </div>
// //           ) : (
// //             <>
// //               {searchResults.services.length > 0 && (
// //                 <div className="mb-6">
// //                   <h3 className="text-sm font-medium mb-2">Services</h3>
// //                   <div className="space-y-2">
// //                     {searchResults.services.map((service) => (
// //                       <Link
// //                         key={service.id}
// //                         href={`/services/${service.id}`}
// //                         className="block p-2 hover:bg-gray-50 rounded-md transition-colors duration-200"
// //                         onClick={() => onOpenChange(false)}
// //                       >
// //                         <p className="font-medium">{service.name}</p>
// //                         <p className="text-sm text-gray-500">
// //                           {service.category}
// //                         </p>
// //                       </Link>
// //                     ))}
// //                   </div>
// //                 </div>
// //               )}

// //               {searchResults.products.length > 0 && (
// //                 <div className="mb-6">
// //                   <h3 className="text-sm font-medium mb-2">Products</h3>
// //                   <div className="space-y-2">
// //                     {searchResults.products.map((product) => (
// //                       <Link
// //                         key={product.id}
// //                         href={`/products/${product.id}`}
// //                         className="block p-2 hover:bg-gray-50 rounded-md transition-colors duration-200"
// //                         onClick={() => onOpenChange(false)}
// //                       >
// //                         <p className="font-medium">{product.name}</p>
// //                         <p className="text-sm text-gray-500">{product.brand}</p>
// //                       </Link>
// //                     ))}
// //                   </div>
// //                 </div>
// //               )}

// //               {!isLoading &&
// //                 searchResults.services.length === 0 &&
// //                 searchResults.products.length === 0 &&
// //                 searchQuery.length > 0 && (
// //                   <div className="text-center py-8 text-gray-500">
// //                     No results found for "{searchQuery}"
// //                   </div>
// //                 )}
// //             </>
// //           )}
// //         </ScrollArea>
// //       </DialogContent>
// //     </Dialog>
// //   );
// // }

// "use client";

// import React, { useState, useEffect } from "react";
// import { Search, X } from "lucide-react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { useDebounce } from "@/hooks/use-debounce";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { getServices, getServiceCategories } from "@/lib/api/services/service";
// import {
//   getProducts,
//   getAllProductCategories,
// } from "@/lib/api/products/product";

// interface Service {
//   id: string;
//   name: string;
//   category: string;
// }

// interface Product {
//   id: string;
//   name: string;
//   brand: string;
// }

// interface Category {
//   id: string;
//   name: string;
// }

// export default function SearchDialog({
//   open,
//   onOpenChange,
// }: {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }) {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchResults, setSearchResults] = useState<{
//     services: Service[];
//     products: Product[];
//     categories: Category[];
//   }>({
//     services: [],
//     products: [],
//     categories: [],
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const router = useRouter();
//   const debouncedQuery = useDebounce(searchQuery, 500);

//   useEffect(() => {
//     if (debouncedQuery.length > 0 && open) {
//       fetchSearchResults();
//     } else {
//       setSearchResults((prev) => ({ ...prev, services: [], products: [] }));
//     }
//   }, [debouncedQuery, selectedCategory, open]);

//   const fetchSearchResults = async () => {
//     setIsLoading(true);
//     try {
//       const [services, serviceCategories, products, productCategories] =
//         await Promise.all([
//           getServices({
//             query: debouncedQuery,
//             category: selectedCategory !== "all" ? selectedCategory : undefined,
//             page: 1,
//             limit: 5,
//           }),
//           getServiceCategories(),
//           getProducts({
//             query: debouncedQuery,
//             category: selectedCategory !== "all" ? selectedCategory : undefined,
//             page: 1,
//             limit: 5,
//           }),
//           getAllProductCategories(),
//         ]);

//       setSearchResults({
//         services: services?.services || [],
//         products: products || [],
//         categories: [
//           ...(serviceCategories || []),
//           ...(productCategories || []),
//         ],
//       });
//     } catch (error) {
//       console.error("Search error:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       router.push(
//         `/search?q=${encodeURIComponent(searchQuery)}&category=${selectedCategory}`
//       );
//       onOpenChange(false);
//     }
//   };

//   const handleQuickSearch = (query: string) => {
//     setSearchQuery(query);
//     router.push(`/search?q=${encodeURIComponent(query)}`);
//     onOpenChange(false);
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="fixed inset-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-2xl sm:max-h-[80vh] w-full h-full sm:rounded-lg overflow-hidden bg-white p-0 border-0">
//         {/* Semi-transparent backdrop (mobile only) */}
//         <div className="fixed inset-0 bg-black/20 sm:hidden" />

//         {/* Dialog content */}
//         <div className="relative flex flex-col h-full bg-white">
//           {/* Header */}
//           <DialogHeader className="sticky top-0 bg-white z-10 p-4 border-b">
//             <div className="flex items-center justify-between">
//               <DialogTitle className="text-lg font-semibold">
//                 Search
//               </DialogTitle>
//               <button
//                 onClick={() => onOpenChange(false)}
//                 className="p-1 rounded-full hover:bg-gray-100"
//                 aria-label="Close search"
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </div>
//           </DialogHeader>

//           {/* Search form */}
//           <form onSubmit={handleSearch} className="p-4 pb-2">
//             <div className="relative">
//               <Input
//                 type="text"
//                 placeholder="Search for salons, products..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 text-base"
//                 autoFocus
//               />
//               <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
//             </div>
//           </form>

//           {/* Category filter */}
//           <div className="px-4 pb-2 overflow-x-auto">
//             <div className="flex space-x-2 min-w-max">
//               <button
//                 type="button"
//                 onClick={() => setSelectedCategory("all")}
//                 className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
//                   selectedCategory === "all"
//                     ? "bg-hairsby-orange text-white"
//                     : "bg-gray-100 hover:bg-gray-200"
//                 }`}
//               >
//                 All
//               </button>
//               {searchResults.categories.map((category) => (
//                 <button
//                   key={category.id}
//                   type="button"
//                   onClick={() => setSelectedCategory(category.name)}
//                   className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
//                     selectedCategory === category.name
//                       ? "bg-hairsby-orange text-white"
//                       : "bg-gray-100 hover:bg-gray-200"
//                   }`}
//                 >
//                   {category.name}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Quick search suggestions */}
//           {!searchQuery && (
//             <div className="px-4 py-2">
//               <h3 className="text-sm font-medium mb-2">Popular Searches</h3>
//               <div className="flex flex-wrap gap-2">
//                 {["Haircut", "Manicure", "Hair Color", "Facial"].map((item) => (
//                   <Button
//                     key={item}
//                     variant="outline"
//                     size="sm"
//                     onClick={() => handleQuickSearch(item)}
//                     className="text-xs"
//                   >
//                     {item}
//                   </Button>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Search results */}
//           <ScrollArea className="flex-1 px-4 pb-4">
//             {isLoading ? (
//               <div className="flex justify-center py-8">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hairsby-orange"></div>
//               </div>
//             ) : (
//               <>
//                 {searchResults.services.length > 0 && (
//                   <div className="mb-6">
//                     <h3 className="text-sm font-medium mb-2">Services</h3>
//                     <div className="space-y-2">
//                       {searchResults.services.map((service) => (
//                         <Link
//                           key={service.id}
//                           href={`/services/${service.id}`}
//                           className="block p-3 hover:bg-gray-50 rounded-md transition-colors duration-200 border"
//                           onClick={() => onOpenChange(false)}
//                         >
//                           <p className="font-medium">{service.name}</p>
//                           <p className="text-sm text-gray-500">
//                             {service.category}
//                           </p>
//                         </Link>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {searchResults.products.length > 0 && (
//                   <div className="mb-6">
//                     <h3 className="text-sm font-medium mb-2">Products</h3>
//                     <div className="space-y-2">
//                       {searchResults.products.map((product) => (
//                         <Link
//                           key={product.id}
//                           href={`/products/${product.id}`}
//                           className="block p-3 hover:bg-gray-50 rounded-md transition-colors duration-200 border"
//                           onClick={() => onOpenChange(false)}
//                         >
//                           <p className="font-medium">{product.name}</p>
//                           <p className="text-sm text-gray-500">
//                             {product.brand}
//                           </p>
//                         </Link>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {searchQuery &&
//                   !isLoading &&
//                   searchResults.services.length === 0 &&
//                   searchResults.products.length === 0 && (
//                     <div className="text-center py-8 text-gray-500">
//                       No results found for "{searchQuery}"
//                     </div>
//                   )}
//               </>
//             )}
//           </ScrollArea>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDebounce } from "@/hooks/use-debounce";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getServices, getServiceCategories } from "@/lib/api/services/service";
import {
  getProducts,
  getAllProductCategories,
} from "@/lib/api/products/product";

interface Service {
  id: string;
  name: string;
  category: string;
}

interface Product {
  id: string;
  name: string;
  brand: string;
}

interface Category {
  id: string;
  name: string;
}

export default function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    services: Service[];
    products: Product[];
    categories: Category[];
  }>({
    services: [],
    products: [],
    categories: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const router = useRouter();
  const debouncedQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (debouncedQuery.length > 0 && open) {
      fetchSearchResults();
    } else {
      setSearchResults((prev) => ({ ...prev, services: [], products: [] }));
    }
  }, [debouncedQuery, selectedCategory, open]);

  const fetchSearchResults = async () => {
    setIsLoading(true);
    try {
      const [services, serviceCategories, products, productCategories] =
        await Promise.all([
          getServices({
            query: debouncedQuery,
            category: selectedCategory !== "all" ? selectedCategory : undefined,
            page: 1,
            limit: 5,
          }),
          getServiceCategories(),
          getProducts({
            query: debouncedQuery,
            category: selectedCategory !== "all" ? selectedCategory : undefined,
            page: 1,
            limit: 5,
          }),
          getAllProductCategories(),
        ]);

      setSearchResults({
        services: services?.services || [],
        products: products || [],
        categories: [
          ...(serviceCategories || []),
          ...(productCategories || []),
        ],
      });
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(
        `/search?q=${encodeURIComponent(searchQuery)}&category=${selectedCategory}`
      );
      onOpenChange(false);
    }
  };

  const handleQuickSearch = (query: string) => {
    setSearchQuery(query);
    router.push(`/search?q=${encodeURIComponent(query)}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Custom backdrop with lighter transparency */}
      <div className="fixed inset-0 bg-black/10 backdrop-blur-sm" />

      {/* Dialog content with proper responsive sizing */}
      <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] sm:w-[32rem] max-h-[80vh] rounded-lg bg-white shadow-xl overflow-hidden border-0 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="sticky top-0 bg-white z-10 p-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold">
                Search
              </DialogTitle>
              <button
                onClick={() => onOpenChange(false)}
                className="p-1 rounded-full hover:bg-gray-100"
                aria-label="Close search"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </DialogHeader>

          {/* Search form */}
          <form onSubmit={handleSearch} className="p-4 pb-2">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search for salons, products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-base"
                autoFocus
              />
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
            </div>
          </form>

          {/* Category filter */}
          <div className="px-4 pb-2 overflow-x-auto">
            <div className="flex space-x-2 min-w-max">
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                  selectedCategory === "all"
                    ? "bg-hairsby-orange text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              {searchResults.categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                    selectedCategory === category.name
                      ? "bg-hairsby-orange text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Quick search suggestions */}
          {!searchQuery && (
            <div className="px-4 py-2">
              <h3 className="text-sm font-medium mb-2">Popular Searches</h3>
              <div className="flex flex-wrap gap-2">
                {["Haircut", "Manicure", "Hair Color", "Facial"].map((item) => (
                  <Button
                    key={item}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickSearch(item)}
                    className="text-xs"
                  >
                    {item}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Search results */}
          <ScrollArea className="flex-1 px-4 pb-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hairsby-orange"></div>
              </div>
            ) : (
              <>
                {searchResults.services.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-2">Services</h3>
                    <div className="space-y-2">
                      {searchResults.services.map((service) => (
                        <Link
                          key={service.id}
                          href={`/services/${service.id}`}
                          className="block p-3 hover:bg-gray-50 rounded-md transition-colors duration-200 border"
                          onClick={() => onOpenChange(false)}
                        >
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-gray-500">
                            {service.category}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.products.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-2">Products</h3>
                    <div className="space-y-2">
                      {searchResults.products.map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.id}`}
                          className="block p-3 hover:bg-gray-50 rounded-md transition-colors duration-200 border"
                          onClick={() => onOpenChange(false)}
                        >
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500">
                            {product.brand}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {searchQuery &&
                  !isLoading &&
                  searchResults.services.length === 0 &&
                  searchResults.products.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No results found for "{searchQuery}"
                    </div>
                  )}
              </>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
