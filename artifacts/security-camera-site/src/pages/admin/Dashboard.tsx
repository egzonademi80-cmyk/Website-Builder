import { AdminLayout } from "./AdminLayout";
import { useListProducts, useListContacts } from "@workspace/api-client-react";
import { auth } from "@/lib/auth";
import { Package, Users, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const { data: products } = useListProducts({ request: { headers: auth.getHeaders() } });
  const { data: contacts } = useListContacts({ request: { headers: auth.getHeaders() } });

  const stats = [
    { label: "Total Products", value: products?.length || 0, icon: Package, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Contact Submissions", value: contacts?.length || 0, icon: Users, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "System Status", value: "Healthy", icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">Welcome back to the SwissCam Security admin panel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((s, i) => (
          <div key={i} className="bg-card border border-white/5 p-6 rounded-2xl flex items-center gap-6">
            <div className={`w-14 h-14 rounded-xl ${s.bg} ${s.color} flex items-center justify-center shrink-0`}>
              <s.icon className="w-7 h-7" />
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">{s.label}</div>
              <div className="text-3xl font-display font-bold">{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6">Recent Contact Submissions</h2>
          <div className="space-y-4">
            {contacts?.slice(0, 5).map(c => (
              <div key={c.id} className="p-4 rounded-xl bg-background border border-white/5 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div className="font-medium text-foreground">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="text-sm text-muted-foreground line-clamp-1">{c.message}</div>
              </div>
            ))}
            {!contacts?.length && <div className="text-muted-foreground text-sm">No submissions yet.</div>}
          </div>
        </div>

        <div className="bg-card border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6">Product Inventory Status</h2>
          <div className="space-y-4">
            {products?.slice(0, 5).map(p => (
              <div key={p.id} className="flex items-center justify-between p-4 rounded-xl bg-background border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden shrink-0">
                    <img src={p.imageUrl || "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=100"} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.category}</div>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.inStock ? "bg-green-500/10 text-green-400" : "bg-destructive/10 text-destructive"}`}>
                  {p.inStock ? "In Stock" : "Out"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
