import { useState } from "react";
import { AdminLayout } from "./AdminLayout";
import { useListProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, getListProductsQueryKey } from "@workspace/api-client-react";
import { auth } from "@/lib/auth";
import { Plus, Edit2, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().min(0, "Must be positive"),
  description: z.string().min(1, "Required"),
  shortDescription: z.string().min(1, "Required"),
  imageUrl: z.string().url("Must be valid URL").or(z.literal("")),
  category: z.string().min(1, "Required"),
  features: z.string(), // We'll split this by comma
  inStock: z.boolean()
});

type ProductFormData = z.infer<typeof productSchema>;

export default function ManageProducts() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data: products, isLoading } = useListProducts({ request: { headers: auth.getHeaders() } });

  const { mutate: createProd, isPending: isCreating } = useCreateProduct({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
        toast({ title: "Product Created" });
        closeModal();
      }
    }
  });

  const { mutate: updateProd, isPending: isUpdating } = useUpdateProduct({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
        toast({ title: "Product Updated" });
        closeModal();
      }
    }
  });

  const { mutate: deleteProd } = useDeleteProduct({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
        toast({ title: "Product Deleted" });
      }
    }
  });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: { inStock: true }
  });

  const openAddModal = () => {
    setEditingId(null);
    reset({
      name: "", price: 0, description: "", shortDescription: "", 
      imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800", 
      category: "Outdoor Security Camera", features: "", inStock: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setEditingId(product.id);
    reset({
      ...product,
      features: product.features.join(", ")
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    reset();
  };

  const onSubmit = (data: ProductFormData) => {
    const payload = {
      ...data,
      features: data.features.split(",").map(f => f.trim()).filter(Boolean)
    };
    
    if (editingId) {
      updateProd({ id: editingId, data: payload });
    } else {
      createProd({ data: payload });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProd({ id });
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold">Manage Products</h1>
          <p className="text-muted-foreground mt-2">Add, edit, or remove inventory items.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" /> Add Product
        </button>
      </div>

      <div className="bg-card border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="p-4 font-medium text-muted-foreground">Product</th>
                <th className="p-4 font-medium text-muted-foreground">Category</th>
                <th className="p-4 font-medium text-muted-foreground">Price</th>
                <th className="p-4 font-medium text-muted-foreground">Status</th>
                <th className="p-4 font-medium text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr><td colSpan={5} className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></td></tr>
              ) : products?.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No products found.</td></tr>
              ) : products?.map(p => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-background border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                        {p.imageUrl ? <img src={p.imageUrl} alt="" className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6 text-muted-foreground" />}
                      </div>
                      <span className="font-semibold text-foreground">{p.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{p.category}</td>
                  <td className="p-4 font-display font-bold">{formatPrice(p.price)}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${p.inStock ? "bg-green-500/10 text-green-400" : "bg-destructive/10 text-destructive"}`}>
                      {p.inStock ? "In Stock" : "Out"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEditModal(p)} className="p-2 hover:bg-white/10 rounded-lg text-blue-400 transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-destructive/20 rounded-lg text-destructive transition-colors" title="Delete">
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
        title={editingId ? "Edit Product" : "Create New Product"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name *</label>
              <input {...register("name")} className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 focus:border-primary focus:outline-none" />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Price (USD) *</label>
              <input type="number" step="0.01" {...register("price")} className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 focus:border-primary focus:outline-none" />
              {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Category *</label>
            <select {...register("category")} className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 focus:border-primary focus:outline-none text-foreground appearance-none">
              <option value="Outdoor Security Camera">Outdoor Security Camera</option>
              <option value="Indoor Smart Camera">Indoor Smart Camera</option>
              <option value="Night Vision Camera">Night Vision Camera</option>
              <option value="Wireless Camera System">Wireless Camera System</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Short Description *</label>
            <input {...register("shortDescription")} className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 focus:border-primary focus:outline-none" placeholder="Brief summary..." />
            {errors.shortDescription && <p className="text-xs text-destructive">{errors.shortDescription.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Full Description *</label>
            <textarea {...register("description")} rows={4} className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 focus:border-primary focus:outline-none resize-none" />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Image URL</label>
            <input {...register("imageUrl")} className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 focus:border-primary focus:outline-none" placeholder="https://..." />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Features (comma separated)</label>
            <input {...register("features")} className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 focus:border-primary focus:outline-none" placeholder="4K HD, Night Vision, 2-Way Audio" />
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" {...register("inStock")} id="inStock" className="w-5 h-5 accent-primary bg-background border-white/10 rounded" />
            <label htmlFor="inStock" className="font-medium cursor-pointer">Product is in stock</label>
          </div>

          <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
            <button type="button" onClick={closeModal} className="px-6 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 font-medium transition-colors">Cancel</button>
            <button type="submit" disabled={isCreating || isUpdating} className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2">
              {(isCreating || isUpdating) && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingId ? "Save Changes" : "Create Product"}
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}
