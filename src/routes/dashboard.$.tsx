import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ChevronRight, Sparkles, Construction } from "lucide-react";
import { findItem, NAV } from "@/components/dashboard/nav-config";

export const Route = createFileRoute("/dashboard/$")({
  component: DashboardPage,
});

function DashboardPage() {
  const { _splat } = Route.useParams();
  const slug = _splat ?? "";
  const item = findItem(slug);

  // breadcrumb
  const parts = slug.split("/");
  const parent = parts.length > 1 ? NAV.flatMap(g => g.items).find(i => i.slug === parts[0]) : null;

  const Icon = item?.icon ?? Sparkles;
  const label = item?.label ?? "Page";

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <motion.nav
        initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
        className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
        {parent && (
          <>
            <ChevronRight className="h-3 w-3" />
            <Link to="/dashboard/$" params={{ _splat: parent.slug }} className="hover:text-foreground transition-colors">
              {parent.label}
            </Link>
          </>
        )}
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{label}</span>
      </motion.nav>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 220, damping: 18 }}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-gradient shadow-glow">
            <Icon className="h-5 w-5 text-primary-foreground" />
          </motion.span>
          <div className="min-w-0">
            <h1 className="font-display text-2xl md:text-3xl font-semibold tracking-tight truncate">{label}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">This page is active in your workspace.</p>
          </div>
        </div>
      </motion.div>

      {/* Empty state / placeholder card */}
      <motion.div
        initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative overflow-hidden rounded-3xl glass-strong border border-white/10 shadow-card p-10 md:p-14">
        <div className="absolute inset-0 bg-mesh-gradient opacity-20 animate-gradient" />
        <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full blur-3xl opacity-40" style={{ background: "var(--glow)" }} />
        <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full blur-3xl opacity-30" style={{ background: "var(--glow-2)" }} />

        <div className="relative flex flex-col items-center text-center max-w-md mx-auto">
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [0, 4, -4, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-gradient shadow-glow mb-5">
            <Construction className="h-7 w-7 text-primary-foreground" />
          </motion.div>
          <h2 className="font-display text-xl md:text-2xl font-semibold tracking-tight">
            {label} workspace
          </h2>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            You've navigated to <span className="text-foreground font-medium">{label}</span>. The full experience is being crafted — the sidebar reflects your current selection.
          </p>
          <div className="mt-6 flex items-center gap-2">
            <Link to="/dashboard" className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl glass hover:bg-white/10 text-xs font-medium transition-colors">
              Back to home
            </Link>
            <button className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl bg-primary-gradient text-primary-foreground text-xs font-medium shadow-glow hover:-translate-y-0.5 transition-all">
              <Sparkles className="h-3.5 w-3.5" /> Ask AI
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
