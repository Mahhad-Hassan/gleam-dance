import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  CreditCard, Download, Plus, Sparkles, Store as StoreIcon, Users, Database, Zap, Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Breadcrumb, Header, GlassCard } from "./dashboard.profile";

export const Route = createFileRoute("/dashboard/billing")({
  head: () => ({ meta: [{ title: "Billing — Aether" }] }),
  component: BillingPage,
});

const INVOICES = [
  { id: "INV-2026-0042", date: "Jun 1, 2026", amount: "$49.00", status: "Paid" },
  { id: "INV-2026-0038", date: "May 1, 2026", amount: "$49.00", status: "Paid" },
  { id: "INV-2026-0031", date: "Apr 1, 2026", amount: "$49.00", status: "Paid" },
  { id: "INV-2026-0025", date: "Mar 1, 2026", amount: "$49.00", status: "Paid" },
  { id: "INV-2026-0018", date: "Feb 1, 2026", amount: "$29.00", status: "Refunded" },
];

const USAGE = [
  { label: "Stores",    icon: StoreIcon, value: 4,      max: 10,   suffix: "" },
  { label: "Users",     icon: Users,     value: 12,     max: 25,   suffix: "" },
  { label: "Storage",   icon: Database,  value: 42,     max: 100,  suffix: " GB" },
  { label: "API usage", icon: Zap,       value: 128000, max: 250000, suffix: " req" },
];

const FEATURES = [
  "Unlimited AI-generated pages",
  "Up to 10 stores & 25 team seats",
  "Priority support",
  "Custom domain & SSL",
];

function BillingPage() {
  return (
    <div className="space-y-6">
      <Breadcrumb label="Billing" />
      <Header icon={CreditCard} title="Billing" subtitle="Manage your subscription, payment methods and invoices." />

      {/* Current plan */}
      <GlassCard>
        <div className="relative overflow-hidden">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full blur-3xl opacity-40" style={{ background: "var(--glow)" }} />
          <div className="relative flex flex-col lg:flex-row lg:items-center gap-6 justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active
                </span>
                <span className="text-xs text-muted-foreground">Renews Jul 1, 2026</span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <h2 className="font-display text-3xl font-semibold tracking-tight">Growth</h2>
                <span className="text-sm text-muted-foreground">/ current plan</span>
              </div>
              <div className="mt-1 font-display text-2xl">
                <span className="text-gradient">$49</span>
                <span className="text-sm text-muted-foreground font-sans"> / month</span>
              </div>
              <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {FEATURES.map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-emerald-400" /> {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap gap-2">
              <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-primary-gradient text-primary-foreground text-sm font-semibold shadow-glow hover:shadow-[0_0_60px_-10px_var(--glow)] transition-all">
                <Sparkles className="h-4 w-4" /> Upgrade plan
              </motion.button>
              <button className="h-10 px-4 rounded-xl glass hover:bg-white/10 text-sm font-medium transition-colors">Change plan</button>
              <button className="h-10 px-4 rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Usage */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {USAGE.map((u, i) => {
          const pct = Math.min(100, (u.value / u.max) * 100);
          return (
            <motion.div key={u.label}
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              whileHover={{ y: -3 }}
              className="relative rounded-2xl glass-strong border border-white/10 p-5 shadow-card hover:shadow-glow transition-shadow overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl glass"><u.icon className="h-4 w-4 text-primary" /></span>
                <span className="text-[11px] text-muted-foreground">{Math.round(pct)}%</span>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">{u.label}</div>
              <div className="mt-1 font-display text-xl font-semibold">
                {u.value.toLocaleString()}{u.suffix}
                <span className="text-xs text-muted-foreground font-sans"> / {u.max.toLocaleString()}{u.suffix}</span>
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                <motion.div initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }}
                  transition={{ duration: 1, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full bg-primary-gradient shadow-glow" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Payment method */}
      <GlassCard title="Payment method" desc="Cards used for your subscription and invoices.">
        <div className="space-y-3">
          <div className="flex items-center gap-4 p-4 rounded-xl glass border border-white/[0.08]">
            <div className="h-10 w-14 rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-glow flex items-center justify-center text-[10px] font-bold text-white tracking-wider">VISA</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">Visa •••• 4242</div>
              <div className="text-xs text-muted-foreground">Expires 08 / 2028</div>
            </div>
            <span className="hidden sm:inline text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/20">Default</span>
            <div className="flex items-center gap-1.5">
              <button className="h-8 px-3 rounded-lg glass hover:bg-white/10 text-xs font-medium transition-colors">Update</button>
              <button className="h-8 px-3 rounded-lg text-xs font-medium text-muted-foreground hover:text-destructive transition-colors">Remove</button>
            </div>
          </div>
          <button className="w-full inline-flex items-center justify-center gap-1.5 h-10 rounded-xl glass border border-dashed border-white/15 hover:border-white/30 hover:bg-white/5 text-xs font-medium transition-colors">
            <Plus className="h-3.5 w-3.5" /> Add payment method
          </button>
        </div>
      </GlassCard>

      {/* Billing history */}
      <GlassCard title="Billing history" desc="Download invoices for your records.">
        <div className="overflow-x-auto -mx-1">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="py-2.5 px-3 font-medium">Invoice</th>
                <th className="py-2.5 px-3 font-medium">Date</th>
                <th className="py-2.5 px-3 font-medium">Amount</th>
                <th className="py-2.5 px-3 font-medium">Status</th>
                <th className="py-2.5 px-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {INVOICES.map((inv, i) => (
                <motion.tr key={inv.id}
                  initial={{ opacity: 0, x: -6 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="hover:bg-white/[0.03] transition-colors"
                >
                  <td className="py-3 px-3 font-mono text-xs">{inv.id}</td>
                  <td className="py-3 px-3 text-muted-foreground">{inv.date}</td>
                  <td className="py-3 px-3 font-medium">{inv.amount}</td>
                  <td className="py-3 px-3">
                    <span className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-medium",
                      inv.status === "Paid"
                        ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/20"
                        : "bg-rose-500/15 text-rose-300 border-rose-500/20"
                    )}>
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />{inv.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg glass hover:bg-white/10 text-xs font-medium transition-colors">
                      <Download className="h-3.5 w-3.5" /> PDF
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
