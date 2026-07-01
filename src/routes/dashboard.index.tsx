import { createFileRoute } from "@tanstack/react-router";
import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  DollarSign, ShoppingCart, Users, Package, TrendingUp, TrendingDown,
  ArrowUpRight, Sparkles, Zap, Plus, ArrowRight, Activity, Bot,
  CheckCircle2, Clock, AlertCircle, Truck,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
});

/* ---------- Counter ---------- */
function useCountUp(target: number, dur = 1200) {
  const [v, setV] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(target * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, dur]);
  return { ref, value: v };
}

function Counter({ value, prefix = "", suffix = "", decimals = 0 }: { value: number; prefix?: string; suffix?: string; decimals?: number }) {
  const { ref, value: v } = useCountUp(value);
  return <span ref={ref}>{prefix}{v.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>;
}

/* ---------- Stat card ---------- */
type Stat = { label: string; value: number; prefix?: string; suffix?: string; change: number; icon: any; tint: string; spark: number[] };
const STATS: Stat[] = [
  { label: "Revenue",   value: 128450, prefix: "$", change: 12.4, icon: DollarSign,   tint: "from-violet-500/30 to-fuchsia-500/10", spark: [12,14,13,18,17,22,20,26,24,30,28,34] },
  { label: "Orders",    value: 3821,             change: 8.1,  icon: ShoppingCart, tint: "from-cyan-500/30 to-sky-500/10",       spark: [8,9,11,10,13,12,16,15,18,17,20,22] },
  { label: "Customers", value: 12480,            change: 4.7,  icon: Users,        tint: "from-emerald-500/30 to-teal-500/10",   spark: [5,6,6,7,8,8,9,10,10,11,12,12] },
  { label: "Products",  value: 946,              change: -2.1, icon: Package,      tint: "from-rose-500/30 to-orange-500/10",    spark: [22,20,21,19,18,20,17,18,16,17,15,14] },
];

function Sparkline({ data, positive }: { data: number[]; positive: boolean }) {
  const max = Math.max(...data), min = Math.min(...data);
  const w = 100, h = 32;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((d - min) / (max - min || 1)) * h;
    return `${x},${y}`;
  }).join(" ");
  const stroke = positive ? "var(--glow-2)" : "oklch(0.65 0.24 25)";
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-8">
      <defs>
        <linearGradient id={`g-${positive}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.4" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.polyline
        fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        points={pts}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, ease: "easeOut" }}
      />
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={`url(#g-${positive})`} />
    </svg>
  );
}

function StatCard({ s, i }: { s: Stat; i: number }) {
  const positive = s.change >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="group relative rounded-2xl glass-strong p-5 overflow-hidden shadow-card hover:shadow-glow transition-shadow duration-300"
    >
      <div className={cn("absolute -top-16 -right-16 h-40 w-40 rounded-full blur-3xl opacity-70 bg-gradient-to-br", s.tint)} />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="text-xs text-muted-foreground font-medium tracking-wide">{s.label}</div>
          <div className="mt-1.5 font-display text-2xl md:text-3xl font-semibold tracking-tight">
            <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
          </div>
        </div>
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl glass border border-white/10 group-hover:scale-110 group-hover:rotate-[-6deg] transition-transform duration-300">
          <s.icon className="h-4 w-4 text-primary" />
        </span>
      </div>
      <div className="relative mt-3 flex items-center gap-2">
        <span className={cn("inline-flex items-center gap-0.5 text-xs font-medium",
          positive ? "text-emerald-400" : "text-rose-400")}>
          {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {positive ? "+" : ""}{s.change}%
        </span>
        <span className="text-xs text-muted-foreground">vs last week</span>
      </div>
      <div className="relative mt-3"><Sparkline data={s.spark} positive={positive} /></div>
    </motion.div>
  );
}

/* ---------- Sales chart ---------- */
function SalesChart() {
  const data = [42, 55, 48, 63, 58, 72, 68, 84, 78, 92, 88, 105];
  const labels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const max = Math.max(...data);
  const w = 600, h = 220, pad = 24;
  const step = (w - pad * 2) / (data.length - 1);
  const pts = data.map((d, i) => [pad + i * step, h - pad - (d / max) * (h - pad * 2)] as const);
  const path = pts.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(" ");
  const area = `${path} L ${pts[pts.length-1][0]} ${h - pad} L ${pad} ${h - pad} Z`;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="rounded-2xl glass-strong p-5 md:p-6 shadow-card lg:col-span-2">
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="text-sm font-medium">Sales performance</div>
          <div className="text-xs text-muted-foreground mt-0.5">Revenue over the last 12 months</div>
        </div>
        <div className="flex items-center gap-1 text-xs">
          {["1M","3M","12M","All"].map((t, i) => (
            <button key={t} className={cn(
              "px-2.5 py-1 rounded-lg transition-colors",
              i === 2 ? "bg-white/10 text-foreground" : "text-muted-foreground hover:bg-white/5"
            )}>{t}</button>
          ))}
        </div>
      </div>
      <div className="relative">
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-56">
          <defs>
            <linearGradient id="area-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--glow)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="var(--glow)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="stroke-grad" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="var(--glow)" />
              <stop offset="100%" stopColor="var(--glow-2)" />
            </linearGradient>
          </defs>
          {[0,1,2,3].map(i => (
            <line key={i} x1={pad} x2={w - pad} y1={pad + i * ((h - pad*2)/3)} y2={pad + i * ((h - pad*2)/3)}
              stroke="oklch(1 0 0 / 0.05)" strokeDasharray="3 5" />
          ))}
          <motion.path d={area} fill="url(#area-fill)"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.6, duration: 0.8 }} />
          <motion.path d={path} fill="none" stroke="url(#stroke-grad)" strokeWidth="2.5" strokeLinecap="round"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.6, ease: "easeOut" }} />
          {pts.map((p, i) => (
            <motion.circle key={i} cx={p[0]} cy={p[1]} r="3" fill="var(--background)" stroke="url(#stroke-grad)" strokeWidth="2"
              initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.8 + i * 0.05 }} />
          ))}
        </svg>
        <div className="grid grid-cols-12 mt-1 px-6 text-[10px] text-muted-foreground/70">
          {labels.map(l => <div key={l} className="text-center">{l}</div>)}
        </div>
      </div>
    </motion.div>
  );
}

/* ---------- AI insights ---------- */
function AIInsights() {
  const insights = [
    { icon: Zap, text: "Peak sales expected Fri 6–9 PM — schedule an email blast.", accent: "text-amber-300" },
    { icon: TrendingUp, text: '"Aurora Hoodie" sales up 34% — restock recommended.', accent: "text-emerald-300" },
    { icon: AlertCircle, text: "Checkout drop-off spiked on mobile in Germany.", accent: "text-rose-300" },
  ];
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="relative rounded-2xl p-5 md:p-6 overflow-hidden border border-white/10 shadow-card">
      <div className="absolute inset-0 bg-mesh-gradient opacity-30 animate-gradient" />
      <div className="absolute inset-0 glass-strong" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary-gradient shadow-glow">
            <Bot className="h-4 w-4 text-primary-foreground" />
          </span>
          <div>
            <div className="text-sm font-medium">AI Insights</div>
            <div className="text-[11px] text-muted-foreground">Updated just now</div>
          </div>
        </div>
        <ul className="space-y-2.5">
          {insights.map((i, idx) => (
            <motion.li key={idx}
              initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.2 + idx * 0.08 }}
              className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-colors">
              <i.icon className={cn("h-4 w-4 mt-0.5 shrink-0", i.accent)} />
              <span className="text-xs leading-relaxed text-foreground/90">{i.text}</span>
            </motion.li>
          ))}
        </ul>
        <button className="mt-4 w-full inline-flex items-center justify-center gap-1.5 h-9 rounded-xl glass hover:bg-white/[0.08] text-xs font-medium transition-colors">
          Open AI Assistant <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

/* ---------- Recent orders ---------- */
const ORDERS = [
  { id: "#1042", customer: "Isabella Chen",  total: "$248.00", status: "Fulfilled", tone: "emerald" },
  { id: "#1041", customer: "Marcus Rivera",  total: "$92.50",  status: "Processing", tone: "amber" },
  { id: "#1040", customer: "Amara Okafor",   total: "$1,204.00", status: "Fulfilled", tone: "emerald" },
  { id: "#1039", customer: "Kenji Tanaka",   total: "$56.00",  status: "Refunded",   tone: "rose" },
  { id: "#1038", customer: "Elena Rossi",    total: "$389.90", status: "Shipped",    tone: "cyan" },
];
function RecentOrders() {
  const toneMap: Record<string, string> = {
    emerald: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
    amber:   "bg-amber-500/15 text-amber-300 border-amber-500/20",
    rose:    "bg-rose-500/15 text-rose-300 border-rose-500/20",
    cyan:    "bg-cyan-500/15 text-cyan-300 border-cyan-500/20",
  };
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl glass-strong p-5 md:p-6 shadow-card lg:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm font-medium">Recent orders</div>
          <div className="text-xs text-muted-foreground mt-0.5">Latest transactions across your store</div>
        </div>
        <button className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors">
          View all <ArrowUpRight className="h-3 w-3" />
        </button>
      </div>
      <div className="divide-y divide-white/[0.05]">
        {ORDERS.map((o, i) => (
          <motion.div key={o.id}
            initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[80px_1fr_120px_120px] items-center gap-3 py-3 group">
            <div className="text-xs font-mono text-muted-foreground">{o.id}</div>
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-gradient text-primary-foreground text-[11px] font-semibold">
                {o.customer.split(" ").map(n => n[0]).join("")}
              </span>
              <span className="text-sm truncate">{o.customer}</span>
            </div>
            <span className={cn("hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-medium", toneMap[o.tone])}>
              <span className="h-1.5 w-1.5 rounded-full bg-current" />{o.status}
            </span>
            <div className="text-sm font-medium text-right">{o.total}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ---------- Top products / inventory ---------- */
const TOP_PRODUCTS = [
  { name: "Aurora Hoodie",  sold: 342, pct: 92 },
  { name: "Nimbus Sneakers", sold: 289, pct: 78 },
  { name: "Vertex Backpack", sold: 214, pct: 62 },
  { name: "Halo Cap",         sold: 168, pct: 48 },
];
function TopProducts() {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl glass-strong p-5 md:p-6 shadow-card">
      <div className="text-sm font-medium mb-4">Top products</div>
      <ul className="space-y-3.5">
        {TOP_PRODUCTS.map((p, i) => (
          <li key={p.name}>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="truncate">{p.name}</span>
              <span className="text-muted-foreground">{p.sold} sold</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
              <motion.div initial={{ width: 0 }} whileInView={{ width: `${p.pct}%` }} viewport={{ once: true }}
                transition={{ duration: 1, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="h-full bg-primary-gradient shadow-glow" />
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/* ---------- Inventory status ---------- */
function InventoryStatus() {
  const items = [
    { label: "In stock",     count: 812, pct: 86, tint: "text-emerald-300", bar: "bg-emerald-400" },
    { label: "Low stock",    count: 87,  pct: 9,  tint: "text-amber-300",   bar: "bg-amber-400" },
    { label: "Out of stock", count: 47,  pct: 5,  tint: "text-rose-300",    bar: "bg-rose-400" },
  ];
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl glass-strong p-5 md:p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-medium">Inventory status</div>
        <span className="text-[11px] text-muted-foreground">946 total</span>
      </div>
      <div className="flex h-3 rounded-full overflow-hidden mb-4">
        {items.map(i => (
          <motion.div key={i.label} initial={{ width: 0 }} whileInView={{ width: `${i.pct}%` }} viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} className={i.bar} />
        ))}
      </div>
      <ul className="space-y-2.5">
        {items.map(i => (
          <li key={i.label} className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2"><span className={cn("h-2 w-2 rounded-full", i.bar)} /> {i.label}</span>
            <span className={i.tint}>{i.count}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/* ---------- Quick actions ---------- */
function QuickActions() {
  const actions = [
    { icon: Plus, label: "Add product" },
    { icon: Users, label: "Invite team" },
    { icon: ShoppingCart, label: "New order" },
    { icon: Sparkles, label: "AI campaign" },
  ];
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl glass-strong p-5 md:p-6 shadow-card">
      <div className="text-sm font-medium mb-4">Quick actions</div>
      <div className="grid grid-cols-2 gap-2.5">
        {actions.map((a, i) => (
          <motion.button key={a.label}
            whileHover={{ y: -2 }}
            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="group flex flex-col items-start gap-2 rounded-xl p-3 bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/15 hover:shadow-glow transition-all">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary-gradient/20 group-hover:bg-primary-gradient transition-colors">
              <a.icon className="h-4 w-4 text-primary group-hover:text-primary-foreground transition-colors" />
            </span>
            <span className="text-xs font-medium">{a.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

/* ---------- Activity feed ---------- */
function ActivityFeed() {
  const items = [
    { icon: CheckCircle2, tone: "text-emerald-300", text: "Order #1042 was fulfilled", time: "2m ago" },
    { icon: Users,        tone: "text-cyan-300",   text: "New customer signup: Elena Rossi", time: "14m ago" },
    { icon: Truck,        tone: "text-violet-300", text: "Shipment #S-208 handed to carrier", time: "38m ago" },
    { icon: AlertCircle,  tone: "text-amber-300",  text: "Low stock: Nimbus Sneakers (5 left)", time: "1h ago" },
    { icon: Clock,        tone: "text-muted-foreground", text: "Draft order saved by Marcus", time: "2h ago" },
  ];
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl glass-strong p-5 md:p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-medium flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" /> Latest activity
        </div>
        <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-emerald-300">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span> Live
        </span>
      </div>
      <ul className="space-y-3">
        {items.map((it, i) => (
          <motion.li key={i}
            initial={{ opacity: 0, x: -6 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="flex items-start gap-3">
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.06]">
              <it.icon className={cn("h-3.5 w-3.5", it.tone)} />
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-xs">{it.text}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{it.time}</div>
            </div>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

/* ---------- Page ---------- */
function DashboardHome() {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <div className="text-xs text-muted-foreground">Wednesday, Jul 1</div>
          <h1 className="mt-1 font-display text-2xl md:text-3xl font-semibold tracking-tight">
            Welcome back, <span className="text-gradient">Ada</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Here's what's happening in your store today.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl glass hover:bg-white/10 text-xs font-medium transition-colors">
            <Activity className="h-3.5 w-3.5" /> Live view
          </button>
          <button className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-primary-gradient text-primary-foreground text-xs font-medium shadow-glow hover:-translate-y-0.5 transition-all">
            <Plus className="h-3.5 w-3.5" /> Create
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((s, i) => <StatCard key={s.label} s={s} i={i} />)}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SalesChart />
        <AIInsights />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <RecentOrders />
        <TopProducts />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InventoryStatus />
        <QuickActions />
        <ActivityFeed />
      </div>
    </div>
  );
}
