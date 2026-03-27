import { useRoute, Link } from "wouter";
import { useGetProduct } from "@workspace/api-client-react";
import { PageTransition } from "@/components/layout/PageTransition";
import { Loader2, CheckCircle2, ArrowLeft, ShieldCheck, AlertCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function ProductDetails() {
  const [, params] = useRoute("/products/:id");
  const productId = parseInt(params?.id || "0");
  
  const { data: product, isLoading, error } = useGetProduct(productId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 text-center px-4">
        <AlertCircle className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
        <p className="text-muted-foreground mb-6">The security camera you're looking for doesn't exist or was removed.</p>
        <Link href="/products" className="px-6 py-3 bg-primary text-primary-foreground rounded-xl">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="pt-32 pb-24 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Link href="/products" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-10 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to all products
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Image Section */}
            <div className="space-y-6">
              <div className="aspect-square bg-card rounded-3xl border border-white/5 overflow-hidden glass-panel p-2">
                <img 
                  src={product.imageUrl || "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1200"} 
                  alt={product.name}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
              <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground bg-card/50 p-4 rounded-xl border border-white/5">
                <ShieldCheck className="w-5 h-5 text-primary" />
                3-Year Standard Warranty Included
              </div>
            </div>

            {/* Details Section */}
            <div className="flex flex-col">
              <div className="mb-4 flex items-center gap-3">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {product.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${product.inStock ? "bg-green-500/10 text-green-400" : "bg-destructive/10 text-destructive"}`}>
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">{product.name}</h1>
              <p className="text-xl text-muted-foreground mb-8">{product.shortDescription}</p>
              
              <div className="text-4xl font-display font-bold text-foreground mb-10">
                {formatPrice(product.price)}
              </div>

              <div className="prose prose-invert max-w-none mb-10">
                <h3 className="text-xl font-bold mb-4">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              {product.features && product.features.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-xl font-bold mb-6">Key Features</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                        <span className="text-foreground/90">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-auto flex flex-col sm:flex-row gap-4 pt-8 border-t border-white/10">
                <Link 
                  href="/contact"
                  className="flex-1 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center glow-shadow-hover transition-all"
                >
                  Request Installation
                </Link>
                <Link 
                  href="/contact"
                  className="flex-1 px-8 py-4 rounded-xl bg-white/5 text-foreground font-semibold flex items-center justify-center hover:bg-white/10 transition-all border border-white/10"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
