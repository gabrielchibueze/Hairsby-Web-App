"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/contexts/auth.context";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Grid, List, Package, Filter, Box } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@/lib/api/products/product";
import { useToast } from "@/components/ui/use-toast";
import { getProviderProducts } from "@/lib/api/accounts/provider";
import { ProductGrid } from "./components/product-grid";
import { ProductFilters } from "./components/product-filter";
import { ProductTable } from "./components/product-table";
import { ProductDialog } from "./components/product-dialog";
import { ProductDetails } from "./components/product-details";
import { ProductMetrics } from "./components/product-metrics";
import Link from "next/link";

export default function ProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProviderProducts();
        setProducts(data.products || []);
        setFilteredProducts(data.products || []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user?.id, toast]);

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailsOpen(true);
  };

  const handleNewProduct = () => {
    setSelectedProduct(null);
    setIsDialogOpen(true);
  };

  const handleSuccess = () => {
    setIsDialogOpen(false);
    setIsDetailsOpen(false);
    // Refresh products after successful operation
    const fetchProducts = async () => {
      try {
        const data = await getProviderProducts();
        setProducts(data.products);
        setFilteredProducts(data.products);
      } catch (err) {
        console.error("Failed to refresh products:", err);
      }
    };
    fetchProducts();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-10 w-[150px]" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)]?.map((_, i) => (
            <Skeleton key={i} className="h-[350px] w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <Link href="/provider/products/new">
          <Button
            // onClick={handleNewProduct}
            variant="brand"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Product
          </Button>
        </Link>
      </div>
      <ProductMetrics products={products} />
      <Tabs defaultValue="grid" className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center items-start justify-between">
          <TabsList className="w-full flex justify-between sm:w-fit">
            <TabsTrigger value="grid">
              <Grid className="mr-2 h-4 w-4" />
              Grid
            </TabsTrigger>
            <TabsTrigger value="list">
              <List className="mr-2 h-4 w-4" />
              List
            </TabsTrigger>
            <TabsTrigger value="categories">
              <Package className="mr-2 h-4 w-4" />
              Categories
            </TabsTrigger>
          </TabsList>
          <div className="w-full sm:w-fit">
            <ProductFilters
              products={products}
              onFilterChange={setFilteredProducts}
            />
          </div>
        </div>

        <TabsContent value="grid" className="space-y-4">
          <ProductGrid
            products={filteredProducts}
            onEditProduct={handleEditProduct}
            onViewDetails={handleViewDetails}
          />
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <ProductTable
            products={filteredProducts}
            onEditProduct={handleEditProduct}
            onViewDetails={handleViewDetails}
          />
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="border rounded-lg p-6 flex items-center justify-center h-64">
            <div className="text-center space-y-2">
              <Box className="h-10 w-10 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">
                Product categories coming soon
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <ProductDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        product={selectedProduct}
        providerId={user?.id || ""}
        onSuccess={handleSuccess}
      />

      <ProductDetails
        product={selectedProduct}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onEditProduct={() => {
          setIsDetailsOpen(false);
          setIsDialogOpen(true);
        }}
      />
    </div>
  );
}
