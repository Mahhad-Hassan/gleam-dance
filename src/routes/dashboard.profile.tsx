import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { ChevronRight, UserCircle, Upload, Trash2, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/profile")({
  head: () => ({ meta: [{ title: "Profile — Aether" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const [status, setStatus] = useState<"idle" | "loading" | "saved">("idle");
  const [avatar, setAvatar] = useState<string | null>(null);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setTimeout(() => {
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 1600);
    }, 900);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <Breadcrumb label="Profile" />
      <Header
        icon={UserCircle}
        title="Profile"
        subtitle="Manage your personal information and how others see you."
      />

      <form onSubmit={save} className="space-y-6">
        {/* Avatar card */}
        <GlassCard title="Profile picture" desc="PNG or JPG, up to 4MB.">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="relative inline-flex h-24 w-24 items-center justify-center rounded-3xl overflow-hidden bg-accent-gradient text-primary-foreground font-display text-2xl font-semibold shadow-glow"
            >
              {avatar ? (
                <img src={avatar} alt="" className="h-full w-full object-cover" />
              ) : "AL"}
            </motion.div>
            <div className="flex flex-wrap gap-2">
              <label className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl glass hover:bg-white/10 text-xs font-medium cursor-pointer transition-colors">
                <Upload className="h-3.5 w-3.5" /> Upload avatar
                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setAvatar(URL.createObjectURL(f));
                }} />
              </label>
              <button
                type="button"
                onClick={() => setAvatar(null)}
                className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl glass hover:bg-destructive/15 text-xs font-medium text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" /> Remove
              </button>
            </div>
          </div>
        </GlassCard>

        <GlassCard title="Personal information" desc="Update your name and contact details.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldGroup label="Full name">
              <Input defaultValue="Ada Lovelace" placeholder="Full name" />
            </FieldGroup>
            <FieldGroup label="Email address">
              <Input type="email" defaultValue="ada@aether.co" placeholder="you@company.com" />
            </FieldGroup>
            <FieldGroup label="Phone number">
              <Input defaultValue="+1 (415) 555 0132" placeholder="+1 555 000 0000" />
            </FieldGroup>
            <FieldGroup label="Job title">
              <Input defaultValue="Founder" placeholder="e.g. Head of Growth" />
            </FieldGroup>
            <FieldGroup label="Company">
              <Input defaultValue="Aether Inc." placeholder="Company name" />
            </FieldGroup>
            <FieldGroup label="Country">
              <Select defaultValue="United States">
                <option>United States</option><option>United Kingdom</option><option>Germany</option>
                <option>France</option><option>Japan</option><option>India</option><option>Brazil</option>
              </Select>
            </FieldGroup>
            <FieldGroup label="Time zone" className="sm:col-span-2">
              <Select defaultValue="(UTC-08:00) Pacific Time">
                <option>(UTC-08:00) Pacific Time</option>
                <option>(UTC-05:00) Eastern Time</option>
                <option>(UTC+00:00) UTC</option>
                <option>(UTC+01:00) Central European Time</option>
                <option>(UTC+05:30) India Standard Time</option>
                <option>(UTC+09:00) Japan Standard Time</option>
              </Select>
            </FieldGroup>
          </div>
        </GlassCard>

        <div className="flex items-center justify-end gap-2">
          <button type="button" className="h-10 px-4 rounded-xl glass hover:bg-white/10 text-sm font-medium transition-colors">
            Cancel
          </button>
          <SaveButton status={status} />
        </div>
      </form>
    </div>
  );
}

/* ============ Shared bits — reused across settings & billing ============ */
export function Breadcrumb({ label, parent }: { label: string; parent?: { label: string; slug: string } }) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
      className="flex items-center gap-1.5 text-xs text-muted-foreground"
    >
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
  );
}

export function Header({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      className="flex items-center gap-3 min-w-0"
    >
      <motion.span
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 220, damping: 18 }}
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-gradient shadow-glow"
      >
        <Icon className="h-5 w-5 text-primary-foreground" />
      </motion.span>
      <div className="min-w-0">
        <h1 className="font-display text-2xl md:text-3xl font-semibold tracking-tight truncate">{title}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
      </div>
    </motion.div>
  );
}

export function GlassCard({ title, desc, children, className }: { title?: string; desc?: string; children: React.ReactNode; className?: string }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn("relative overflow-hidden rounded-2xl glass-strong border border-white/10 shadow-card p-5 md:p-6", className)}
    >
      {title && (
        <div className="mb-5">
          <div className="text-sm font-medium">{title}</div>
          {desc && <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>}
        </div>
      )}
      {children}
    </motion.section>
  );
}

export function FieldGroup({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</span>
      {children}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full h-10 px-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm",
        "placeholder:text-muted-foreground/60 outline-none",
        "focus:border-primary/40 focus:bg-white/[0.05] focus:shadow-glow transition-all duration-300",
        props.className,
      )}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "w-full h-10 px-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm outline-none",
        "focus:border-primary/40 focus:bg-white/[0.05] focus:shadow-glow transition-all duration-300",
        props.className,
      )}
    />
  );
}

export function SaveButton({ status, label = "Save changes" }: { status: "idle" | "loading" | "saved"; label?: string }) {
  return (
    <motion.button
      type="submit"
      whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
      disabled={status !== "idle"}
      className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-primary-gradient text-primary-foreground text-sm font-semibold shadow-glow hover:shadow-[0_0_60px_-10px_var(--glow)] transition-all disabled:opacity-90"
    >
      {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
      {status === "saved" && <Check className="h-4 w-4" />}
      {status === "loading" ? "Saving…" : status === "saved" ? "Saved" : label}
    </motion.button>
  );
}
