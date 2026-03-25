import { useRoute, Link } from "wouter";
import { useGetBlogPost } from "@workspace/api-client-react";
import { PageTransition } from "@/components/layout/PageTransition";
import { Loader2, ArrowLeft, Calendar, User } from "lucide-react";
import { format } from "date-fns";

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug || "";

  const { data: post, isLoading, error } = useGetBlogPost(slug, {
    query: { enabled: !!slug, queryKey: ["blog", slug] }
  });

  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center pt-20">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      </PageTransition>
    );
  }

  if (error || !post) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
            <Link href="/blog" className="text-primary hover:underline flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="pt-32 pb-24 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Articles
          </Link>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6 font-medium">
            <span className="text-primary bg-primary/10 px-3 py-1 rounded-full">{post.category}</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {format(new Date(post.createdAt), 'MMMM d, yyyy')}</span>
            <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {post.author}</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold mb-8 leading-tight">
            {post.title}
          </h1>

          {post.imageUrl && (
            <div className="w-full aspect-video rounded-3xl overflow-hidden mb-12 border border-white/10 shadow-2xl">
              <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="prose prose-invert prose-lg max-w-none text-foreground/90 whitespace-pre-line leading-relaxed">
            {post.content}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}