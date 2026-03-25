import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAdminLogin } from "@workspace/api-client-react";
import { auth } from "@/lib/auth";
import { ShieldCheck, Lock, User, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginData = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>({
    resolver: zodResolver(loginSchema)
  });

  const { mutate: login, isPending } = useAdminLogin({
    mutation: {
      onSuccess: (data) => {
        auth.setToken(data.token);
        toast({ title: "Login Successful" });
        setLocation("/admin/dashboard");
      },
      onError: (err: any) => {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: err?.message || "Invalid credentials",
        });
      }
    }
  });

  const onSubmit = (data: LoginData) => {
    login({ data });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-background">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-md bg-card/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mb-6">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-display font-bold">Admin Access</h1>
          <p className="text-muted-foreground mt-2">Secure restricted area.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input 
                {...register("username")}
                type="text"
                className="w-full bg-background border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-primary transition-colors"
                placeholder="Enter username"
              />
            </div>
            {errors.username && <p className="text-xs text-destructive">{errors.username.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input 
                {...register("password")}
                type="password"
                className="w-full bg-background border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-primary transition-colors"
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>

          <button 
            type="submit"
            disabled={isPending}
            className="w-full py-4 mt-4 rounded-xl bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 glow-shadow-hover transition-all disabled:opacity-50"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Authenticate"}
          </button>
        </form>
      </div>
    </div>
  );
}
