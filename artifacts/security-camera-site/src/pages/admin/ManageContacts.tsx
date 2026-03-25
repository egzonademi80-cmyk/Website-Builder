import { AdminLayout } from "./AdminLayout";
import { useListContacts } from "@workspace/api-client-react";
import { auth } from "@/lib/auth";
import { Mail, Phone, Clock, Loader2 } from "lucide-react";

export default function ManageContacts() {
  const { data: contacts, isLoading } = useListContacts({ request: { headers: auth.getHeaders() } });

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold">Contact Submissions</h1>
        <p className="text-muted-foreground mt-2">View inquiries from potential customers.</p>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : contacts?.length === 0 ? (
          <div className="text-center py-20 bg-card border border-white/5 rounded-2xl text-muted-foreground">
            No contact submissions found.
          </div>
        ) : (
          contacts?.map(contact => (
            <div key={contact.id} className="bg-card border border-white/5 rounded-2xl p-6 shadow-lg">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-1">{contact.name}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> <a href={`mailto:${contact.email}`} className="hover:text-primary transition-colors">{contact.email}</a></div>
                    {contact.phone && <div className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> <a href={`tel:${contact.phone}`} className="hover:text-primary transition-colors">{contact.phone}</a></div>}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-background px-3 py-1.5 rounded-lg border border-white/5 shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(contact.createdAt).toLocaleString()}
                </div>
              </div>
              
              <div className="bg-background rounded-xl p-5 border border-white/5">
                <p className="whitespace-pre-wrap leading-relaxed text-foreground/90">{contact.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}
