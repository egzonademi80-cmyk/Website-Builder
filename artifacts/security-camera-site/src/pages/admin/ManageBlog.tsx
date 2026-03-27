import { useState } from "react";
import { AdminLayout } from "./AdminLayout";
import { useListBlogPosts, useCreateBlogPost, useUpdateBlogPost, useDeleteBlogPost, getListBlogPostsQueryKey, type BlogPost } from "@/hooks/useBlogApi";
import { auth } from "@/lib/auth";
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  imageUrl: z.string().url("Must be valid URL").or(z.literal("")),
  author: z.string().min(1, "Author is required"),
  category: z.string().min(1, "Category is required"),
  published: z.boolean()
});

type BlogFormData = z.infer<typeof blogSchema>;

export default function ManageBlog() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const { data: posts, isLoading } = useListBlogPosts();

  const { mutate: createPost, isPending: isCreating } = useCreateBlogPost({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListBlogPostsQueryKey() });
        toast({ title: "Post Created" });
        closeModal();
      }
    }
  });

  const { mutate: updatePost, isPending: isUpdating } = useUpdateBlogPost({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListBlogPostsQueryKey() });
        toast({ title: "Post Updated" });
        closeModal();
      }
    }
  });

  const { mutate: deletePost } = useDeleteBlogPost({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListBlogPostsQueryKey() });
        toast({ title: "Post Deleted" });
      }
    }
  });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: { published: true, category: "Security News" }
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue("title", val);
    if (!editingPost) {
      setValue("slug", val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const openAddModal = () => {
    setEditingPost(null);
    reset({
      title: "", slug: "", excerpt: "", content: "",
      imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800",
      author: "Admin", category: "Security News", published: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (post: BlogPost) => {
    setEditingPost(post);
    reset({ ...post });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    reset();
  };

  const onSubmit = (data: BlogFormData) => {
    const headers = auth.getHeaders();
    if (editingPost) {
      updatePost({ id: editingPost.id, data, headers });
    } else {
      createPost({ data, headers });
    }
  };

  const handleDelete = (post: BlogPost) => {
    if (confirm("Are you sure you want to delete this post?")) {
      deletePost({ id: post.id, headers: auth.getHeaders() });
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold">Manage Blog</h1>
          <p className="text-muted-foreground mt-2">Create and edit articles and news.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" /> New Post
        </button>
      </div>

      <div className="bg-card border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="p-4 font-medium text-muted-foreground">Post</th>
                <th className="p-4 font-medium text-muted-foreground">Category</th>
                <th className="p-4 font-medium text-muted-foreground">Author</th>
                <th className="p-4 font-medium text-muted-foreground">Status</th>
                <th className="p-4 font-medium text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr><td colSpan={5} className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></td></tr>
              ) : posts?.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No posts found.</td></tr>
              ) : posts?.map(p => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <div className="font-semibold text-foreground">{p.title}</div>
                    <div className="text-xs text-muted-foreground">{format(new Date(p.createdAt), 'MMM d, yyyy')}</div>
                  </td>
                  <td className="p-4 text-muted-foreground">{p.category}</td>
                  <td className="p-4 text-muted-foreground">{p.author}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${p.published ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-500"}`}>
                      {p.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEditModal(p)} className="p-2 hover:bg-white/10 rounded-lg text-blue-400 transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(p)} className="p-2 hover:bg-destructive/20 rounded-lg text-destructive transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingPost ? "Edit Post" : "Create New Post"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title *</label>
              <input {...register("title")} onChange={handleTitleChange} className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 focus:border-primary focus:outline-none" />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Slug *</label>
              <input {...register("slug")} className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 focus:border-primary focus:outline-none" />
              {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category *</label>
              <select {...register("category")} className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 focus:border-primary focus:outline-none text-foreground appearance-none">
                <option value="Installation Tips">Installation Tips</option>
                <option value="Security News">Security News</option>
                <option value="Product Updates">Product Updates</option>
                <option value="How-To Guides">How-To Guides</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Author *</label>
              <input {...register("author")} className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 focus:border-primary focus:outline-none" />
              {errors.author && <p className="text-xs text-destructive">{errors.author.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Excerpt *</label>
            <input {...register("excerpt")} className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 focus:border-primary focus:outline-none" placeholder="Brief summary..." />
            {errors.excerpt && <p className="text-xs text-destructive">{errors.excerpt.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Content *</label>
            <textarea {...register("content")} rows={6} className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 focus:border-primary focus:outline-none resize-none" placeholder="Write your post here..." />
            {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Image URL</label>
            <input {...register("imageUrl")} className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 focus:border-primary focus:outline-none" placeholder="https://..." />
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" {...register("published")} id="published" className="w-5 h-5 accent-primary bg-background border-white/10 rounded" />
            <label htmlFor="published" className="font-medium cursor-pointer">Published</label>
          </div>

          <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
            <button type="button" onClick={closeModal} className="px-6 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 font-medium transition-colors">Cancel</button>
            <button type="submit" disabled={isCreating || isUpdating} className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2">
              {(isCreating || isUpdating) && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingPost ? "Save Changes" : "Create Post"}
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}
