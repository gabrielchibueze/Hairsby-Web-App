import { Button } from "@/components/ui/button";

interface BlogCategoriesProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function BlogCategories({
  categories,
  selectedCategory,
  onCategoryChange,
}: BlogCategoriesProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <Button
        variant={!selectedCategory ? "default" : "outline"}
        onClick={() => onCategoryChange("")}
        className={`rounded-full ${!selectedCategory ? "bg-hairsby-orange hover:bg-hairsby-orange/90" : ""}`}
      >
        All
      </Button>
      {categories.length &&
        categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => onCategoryChange(category)}
            className={`rounded-full capitalize ${selectedCategory === category ? "bg-hairsby-orange hover:bg-hairsby-orange/90" : ""}`}
          >
            {category}
          </Button>
        ))}
    </div>
  );
}
