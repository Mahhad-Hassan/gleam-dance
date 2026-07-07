import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, Heart, Share2, Monitor, Tablet, Smartphone, Star, Download,
  Sparkles, Zap, Search as SearchIcon, Check, Layers, Palette, Type, X,
} from "lucide-react";
import { getTemplate } from "@/lib/templates-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/templates/$id")({
  head: ({ params }) => {
    const t = getTemplate(params.id);
    return {
      meta: [
        { title: `${t.name} — Template preview` },
        { name: "description", content: t.description },
      ],
    };
  },
  component: TemplatePreview,
});

type Device = "desktop" | "tablet" | "mobile";

function TemplatePreview() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const t = getTemplate(id);
  const [device, setDevice] = useState<Device>("desktop");
  const [fav, setFav] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const frameW = device === "desktop" ? "100%" : device === "tablet" ? 820 : 380;

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/3 h-[420px] w-[420px] rounded-full blur-3xl opacity-30" style={{ background: "var(--glow)" }} />
      </div>

      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-background/60 backdrop-blur-2xl">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8 h-16 flex items-center gap-3">
          <Link to="/templates" className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl glass hover:bg-white/10 text-sm transition">
            <ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">Back to templates</span>
          </Link>
          <div className="ml-2 min-w-0">
            <div className="text-sm font-semibold truncate">{t.name}</div>
            <div className="text-[11px] text-muted-foreground truncate">by {t.author} · {t.category}</div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <DeviceSwitch value={device} onChange={setDevice} />
            <button onClick={() => setFav(v => !v)}
              aria-label="Favorite"
              className={cn("h-9 w-9 rounded-xl glass border border-white/10 grid place-items-center transition",
                fav ? "text-rose-400" : "text-muted-foreground hover:text-foreground"
              )}>
              <Heart className={cn("h-4 w-4", fav && "fill-current")} />
            </button>
            <button aria-label="Share" className="h-9 w-9 rounded-xl glass border border-white/10 grid place-items-center text-muted-foreground hover:text-foreground transition">
              <Share2 className="h-4 w-4" />
            </button>
            <motion.button
              whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
              onClick={() => setConfirmOpen(true)}
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl bg-primary-gradient text-primary-foreground text-sm font-semibold shadow-glow"
            >
              <Sparkles className="h-4 w-4" /> Use this template
            </motion.button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-8 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        {/* Live preview */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="rounded-3xl glass-strong border border-white/10 shadow-elegant overflow-hidden"
          >
            {/* Browser chrome */}
            <div className="h-10 flex items-center gap-2 px-4 border-b border-white/[0.06] bg-white/[0.02]">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
              <span className="ml-3 text-[11px] text-muted-foreground truncate">{t.id}.aether.co</span>
            </div>
            <div className="p-4 md:p-8 bg-black/20 min-h-[560px] flex justify-center">
              <motion.div
                key={device}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
                style={{ width: frameW as any }}
                className="w-full max-w-full transition-all"
              >
                <FakeSite t={t} device={device} />
              </motion.div>
            </div>
          </motion.div>

          {/* Description */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}
            className="mt-6 rounded-2xl glass border border-white/10 p-6">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">About this template</div>
            <div className="mt-2 text-sm text-foreground/90 leading-relaxed">{t.description}</div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {t.tags.map(tag => (
                <span key={tag} className="text-[11px] px-2 py-1 rounded-full glass border border-white/10 text-muted-foreground">{tag}</span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right rail */}
        <aside className="space-y-4">
          <SidePanel>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-sm"><Star className="h-4 w-4 fill-amber-300 text-amber-300" /> <span className="font-semibold">{t.rating.toFixed(1)}</span></div>
              <span className="text-xs text-muted-foreground">·</span>
              <div className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Download className="h-3.5 w-3.5" /> {t.downloads.toLocaleString()}</div>
              <span className="ml-auto text-[10px] px-2 py-1 rounded-md bg-primary-gradient text-primary-foreground font-semibold">{t.price}</span>
            </div>
          </SidePanel>

          <SidePanel title="Scorecard">
            <div className="grid grid-cols-2 gap-2">
              <ScoreTile icon={Zap} label="Performance" value={t.perfScore} />
              <ScoreTile icon={SearchIcon} label="SEO" value={t.seoScore} />
            </div>
          </SidePanel>

          <SidePanel title="Pages included">
            <div className="grid grid-cols-2 gap-1.5">
              {t.pages.map(p => (
                <div key={p} className="flex items-center gap-1.5 h-8 px-2.5 rounded-lg glass border border-white/10 text-xs">
                  <Check className="h-3 w-3 text-emerald-400" /> {p}
                </div>
              ))}
            </div>
          </SidePanel>

          <SidePanel title="Design tokens">
            <div className="space-y-3">
              <Row icon={Palette} label="Color palette">
                <div className="flex items-center gap-1.5">
                  {t.palette.map((c, k) => (
                    <span key={k} className="h-5 w-5 rounded-md border border-white/10" style={{ background: c }} title={c} />
                  ))}
                </div>
              </Row>
              <Row icon={Type} label="Typography">
                <div className="text-xs text-muted-foreground truncate">{t.fontDisplay} · {t.fontBody}</div>
              </Row>
              <Row icon={Layers} label="Style">
                <span className="text-xs">{t.style}</span>
              </Row>
              <Row icon={Monitor} label="Responsive">
                <span className="text-xs text-emerald-300">Yes</span>
              </Row>
            </div>
          </SidePanel>

          <motion.button
            whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
            onClick={() => setConfirmOpen(true)}
            className="w-full inline-flex items-center justify-center gap-1.5 h-11 rounded-xl bg-primary-gradient text-primary-foreground text-sm font-semibold shadow-glow"
          >
            <Sparkles className="h-4 w-4" /> Use this template
          </motion.button>
        </aside>
      </div>

      {/* Confirm modal */}
      <AnimatePresence>
        {confirmOpen && (
          <motion.div className="fixed inset-0 z-[100] flex items-center justify-center px-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-background/70 backdrop-blur-2xl" onClick={() => setConfirmOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 w-full md:w-[min(480px,calc(100%-2rem))] glass-strong border border-white/10 rounded-3xl p-6 md:p-7 shadow-elegant"
              role="dialog" aria-modal="true"
            >
              <button onClick={() => setConfirmOpen(false)}
                className="absolute right-4 top-4 h-8 w-8 rounded-full glass grid place-items-center hover:rotate-90 transition-all duration-300">
                <X className="h-4 w-4" />
              </button>
              <div className={cn("h-14 w-14 rounded-2xl bg-gradient-to-br shadow-glow grid place-items-center", t.tint)}>
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold">Apply this template?</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                <span className="text-foreground font-medium">{t.name}</span> will become the starting point for your website. You can customize everything after.
              </p>
              <div className="mt-5 flex items-center justify-end gap-2">
                <button onClick={() => setConfirmOpen(false)} className="h-10 px-4 rounded-xl glass hover:bg-white/10 text-sm">Cancel</button>
                <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
                  onClick={() => navigate({ to: "/templates/$id/apply", params: { id: t.id } })}
                  className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-primary-gradient text-primary-foreground text-sm font-semibold shadow-glow"
                >
                  Apply template <Sparkles className="h-4 w-4" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- Bits ---------------- */

function DeviceSwitch({ value, onChange }: { value: Device; onChange: (d: Device) => void }) {
  const items: { v: Device; icon: any; label: string }[] = [
    { v: "desktop", icon: Monitor, label: "Desktop" },
    { v: "tablet", icon: Tablet, label: "Tablet" },
    { v: "mobile", icon: Smartphone, label: "Mobile" },
  ];
  return (
    <div className="inline-flex h-9 rounded-xl glass border border-white/10 p-0.5">
      {items.map(it => (
        <button key={it.v} onClick={() => onChange(it.v)} aria-label={it.label}
          className={cn("relative h-8 w-9 rounded-lg grid place-items-center transition",
            value === it.v ? "bg-primary-gradient text-primary-foreground shadow-glow" : "text-muted-foreground hover:text-foreground"
          )}>
          <it.icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}

function SidePanel({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
      className="rounded-2xl glass border border-white/10 p-4">
      {title && <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground mb-3">{title}</div>}
      {children}
    </motion.div>
  );
}

function ScoreTile({ icon: Icon, label, value }: { icon: any; label: string; value: number }) {
  return (
    <div className="rounded-xl glass border border-white/10 p-3">
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground"><Icon className="h-3.5 w-3.5 text-primary" /> {label}</div>
      <div className="mt-1.5 flex items-end gap-1">
        <span className="font-display text-2xl font-semibold">{value}</span>
        <span className="text-[11px] text-muted-foreground mb-1">/100</span>
      </div>
      <div className="mt-2 h-1 rounded-full bg-white/[0.06] overflow-hidden">
        <motion.div className="h-full bg-primary-gradient shadow-glow" initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.8 }} />
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, children }: { icon: any; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground"><Icon className="h-3.5 w-3.5 text-primary" /> {label}</div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function FakeSite({ t, device }: { t: ReturnType<typeof getTemplate>; device: Device }) {
  const pad = device === "mobile" ? "p-4" : "p-8";
  const cols = device === "mobile" ? 2 : 3;
  return (
    <div className={cn("rounded-2xl overflow-hidden bg-gradient-to-br border border-white/10", t.tint)}>
      {/* Header */}
      <div className={cn("flex items-center justify-between", pad)}>
        <div className="flex items-center gap-2">
          <span className="h-6 w-6 rounded-md" style={{ background: t.accent }} />
          <span className="text-white/90 text-xs font-semibold">{t.name}</span>
        </div>
        {device !== "mobile" && (
          <div className="flex items-center gap-3 text-[10px] text-white/70">
            {t.pages.slice(0,4).map(p => <span key={p}>{p}</span>)}
          </div>
        )}
        <div className="h-6 px-2 inline-flex items-center rounded-md text-[10px] font-semibold" style={{ background: t.accent, color: "#0a0a0a" }}>Shop</div>
      </div>
      {/* Hero */}
      <div className={cn("pt-2", pad)}>
        <div className="max-w-md">
          <div className="text-white/60 text-[10px] uppercase tracking-widest">New drop</div>
          <div className="mt-2 text-white text-2xl md:text-4xl font-semibold leading-tight" style={{ fontFamily: `"${t.fontDisplay}", ui-sans-serif` }}>
            Made for a new season.
          </div>
          <div className="mt-2 text-white/70 text-xs md:text-sm max-w-sm">Curated pieces engineered for everyday movement — designed with intention, made to last.</div>
          <div className="mt-4 inline-flex h-9 px-4 items-center rounded-xl text-xs font-semibold" style={{ background: t.accent, color: "#0a0a0a" }}>Shop the drop</div>
        </div>
      </div>
      {/* Grid */}
      <div className={cn("pt-2", pad)}>
        <div className={cn("grid gap-2", cols === 3 ? "grid-cols-3" : "grid-cols-2")}>
          {Array.from({ length: cols }).map((_, i) => (
            <div key={i} className="aspect-[4/5] rounded-xl bg-white/15 relative overflow-hidden">
              <div className="absolute inset-x-2 bottom-2 text-[10px] text-white/90">Piece 0{i+1}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Footer */}
      <div className={cn("pt-3 pb-6 flex items-center justify-between", pad)}>
        <div className="text-[10px] text-white/50">© {t.name}</div>
        <div className="flex items-center gap-3 text-[10px] text-white/50">Privacy · Terms</div>
      </div>
    </div>
  );
}
