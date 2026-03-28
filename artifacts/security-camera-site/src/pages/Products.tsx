import { useState } from "react";
import { Link } from "wouter";
import { useListProducts } from "@workspace/api-client-react";
import { PageTransition } from "@/components/layout/PageTransition";
import { Search, Loader2, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function Products() {
  const { data: products, isLoading, error } = useListProducts();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Alle");

  const categoryMap: Record<string, string> = {
    "Alle": "All",
    "Aussenkamera": "Outdoor Security Camera",
    "Innenkamera": "Indoor Smart Camera",
    "Nachtsichtkamera": "Night Vision Camera",
    "Drahtloses System": "Wireless Camera System",
  };

  const categories = Object.keys(categoryMap);

  const filteredProducts = products?.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.shortDescription.toLowerCase().includes(search.toLowerCase());
    const selectedEnglish = categoryMap[category] ?? category;
    const matchesCategory = category === "Alle" || p.category === selectedEnglish;
    return matchesSearch && matchesCategory;
  });

  return (
    <PageTransition>
      <div className="pt-32 pb-24 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Unsere <span className="text-gradient">Produkte</span></h1>
            <p className="text-xl text-muted-foreground max-w-2xl">Entdecken Sie unser professionelles Sortiment an Sicherheitskameras für maximale Zuverlässigkeit und Bildqualität.</p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-6 mb-12 items-start md:items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Produkte suchen..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-card border border-white/10 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto hide-scrollbar">
              {categories.map(c => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                    category === c 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-32">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-20 text-destructive bg-destructive/10 rounded-2xl">
              Produkte konnten nicht geladen werden. Bitte versuchen Sie es später erneut.
            </div>
          ) : filteredProducts?.length === 0 ? (
            <div className="text-center py-32 border border-white/5 rounded-2xl glass-panel">
              <h3 className="text-xl font-bold mb-2">Keine Produkte gefunden</h3>
              <p className="text-muted-foreground">Passen Sie Ihre Suche oder den Kategoriefilter an.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts?.map((product) => (
                <div key={product.id} className="group bg-card border border-white/5 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-[0_10px_40px_-10px_rgba(0,182,212,0.2)] flex flex-col">
                  <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                    <img 
                      src={product.imageUrl || "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800"} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {!product.inStock && (
                      <div className="absolute top-4 left-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-xs font-bold">
                        Ausverkauft
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border border-white/10">
                      {product.category}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">{product.name}</h3>
                    <p className="text-muted-foreground text-sm mb-6 flex-1 line-clamp-2">{product.shortDescription}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="text-2xl font-display font-bold text-foreground">
                        {formatPrice(product.price)}
                      </div>
                      <Link 
                        href={`/products/${product.id}`}
                        className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </PageTransition>
  );
}
