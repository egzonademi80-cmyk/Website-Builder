import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BLOG_QUERY_KEY = ["blog"] as const;

export function getListBlogPostsQueryKey() {
  return BLOG_QUERY_KEY;
}

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || res.statusText);
  }
  return res.json() as Promise<T>;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  author: string;
  category: string;
  published: boolean;
  createdAt: string;
}

export type CreateBlogPostData = Omit<BlogPost, "id" | "createdAt">;
export type UpdateBlogPostData = Partial<CreateBlogPostData>;

export function useListBlogPosts() {
  return useQuery({
    queryKey: getListBlogPostsQueryKey(),
    queryFn: () => apiFetch<BlogPost[]>("/api/blog"),
  });
}

export function useGetBlogPost(slug: string) {
  return useQuery({
    queryKey: [...BLOG_QUERY_KEY, slug],
    queryFn: () => apiFetch<BlogPost>(`/api/blog/${slug}`),
    enabled: !!slug,
  });
}

export function useCreateBlogPost(options?: { mutation?: { onSuccess?: () => void; onError?: () => void } }) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { data: CreateBlogPostData; headers?: Record<string, string> }) =>
      apiFetch<BlogPost>("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...data.headers },
        body: JSON.stringify(data.data),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: getListBlogPostsQueryKey() });
      options?.mutation?.onSuccess?.();
    },
    onError: options?.mutation?.onError,
  });
}

export function useUpdateBlogPost(options?: { mutation?: { onSuccess?: () => void; onError?: () => void } }) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: number; data: UpdateBlogPostData; headers?: Record<string, string> }) =>
      apiFetch<BlogPost>(`/api/blog/id/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...data.headers },
        body: JSON.stringify(data.data),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: getListBlogPostsQueryKey() });
      options?.mutation?.onSuccess?.();
    },
    onError: options?.mutation?.onError,
  });
}

export function useDeleteBlogPost(options?: { mutation?: { onSuccess?: () => void; onError?: () => void } }) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: number; headers?: Record<string, string> }) =>
      apiFetch<{ success: boolean }>(`/api/blog/id/${data.id}`, {
        method: "DELETE",
        headers: { ...data.headers },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: getListBlogPostsQueryKey() });
      options?.mutation?.onSuccess?.();
    },
    onError: options?.mutation?.onError,
  });
}
