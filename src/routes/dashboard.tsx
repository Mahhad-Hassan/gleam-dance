import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { TopNav } from "@/components/dashboard/topnav";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Aether" },
      { name: "description", content: "Aether Admin — manage orders, products, customers and growth." },
    ],
  }),
  component: DashboardLayout,
});

function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile drawer on route change (best-effort via resize/escape)
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setMobileOpen(false); };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/3 h-[500px] w-[500px] rounded-full blur-[140px] opacity-25"
             style={{ background: "var(--glow)" }} />
        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full blur-[140px] opacity-20"
             style={{ background: "var(--glow-2)" }} />
        <div className="absolute inset-0 grid-pattern opacity-40" />
      </div>

      <div className="flex">
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(c => !c)}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />
        <div className="flex-1 min-w-0 flex flex-col min-h-screen">
          <TopNav onMobileOpen={() => setMobileOpen(true)} />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Floating AI Assistant */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 260, damping: 18 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-2xl bg-primary-gradient shadow-glow flex items-center justify-center animate-pulse-glow"
        aria-label="AI Assistant"
      >
        <Sparkles className="h-5 w-5 text-primary-foreground" />
        <span className="absolute inset-0 rounded-2xl bg-primary-gradient blur-xl opacity-50 -z-10" />
      </motion.button>
    </div>
  );
}
