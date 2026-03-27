import { useState } from "react";
import { Link } from "wouter";
import { useListBlogPosts } from "@/hooks/useBlogApi";
import { PageTransition } from "@/components/layout/PageTransition";
import { Loader2, ArrowRight, Calendar, User } from "lucide-react";
import { format } from "date-fns";

export default function Blog() {
  const { data: posts, isLoading, error } = useListBlogPosts();
  const [category, setCategory] = useState("All");

  const categories = ["All", "Installation Tips", "Security News", "Product Updates", "How-To Guides"];

  const filteredPosts = posts?.filter(p => p.published && (category === "All" || p.category === category));

  return (
    <PageTransition>
      <div className="pt-32 pb-24 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Security <span className="text-gradient">Insights & News</span></h1>
            <p className="text-xl text-muted-foreground max-w-2xl">Expert advice, industry news, and guides to help you secure what matters most.</p>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-6 mb-8 hide-scrollbar">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                  category === c 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-card border border-white/5 text-muted-foreground hover:bg-white/5 hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-32">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-20 text-destructive bg-destructive/10 rounded-2xl">
              Failed to load articles.
            </div>
          ) : filteredPosts?.length === 0 ? (
            <div className="text-center py-32 border border-white/5 rounded-2xl glass-panel">
              <h3 className="text-xl font-bold mb-2">No articles found</h3>
              <p className="text-muted-foreground">Check back later for new content.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts?.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group bg-card border border-white/5 rounded-3xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-[0_10px_40px_-10px_rgba(0,182,212,0.15)] flex flex-col h-full">
                  <div className="aspect-[16/10] overflow-hidden relative bg-muted">
                    <img 
                      src={post.imageUrl || "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800"} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary border border-white/10">
                      {post.category}
                    </div>
                  </div>
                  <div className="p-6 md:p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {format(new Date(post.createdAt), 'MMM d, yyyy')}</div>
                      <div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {post.author}</div>
                    </div>
                    <h2 className="text-xl font-display font-bold mb-3 group-hover:text-primary transition-colors leading-snug">{post.title}</h2>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">{post.excerpt}</p>
                    <div className="flex items-center text-primary font-medium text-sm mt-auto group-hover:translate-x-1 transition-transform">
                      Read Article <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}