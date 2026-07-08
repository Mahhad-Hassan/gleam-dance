import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, Save, Eye, Rocket, Undo2, Redo2, Monitor, Tablet, Smartphone,
  Layers as LayersIcon, FileText, Image as ImageIcon, Component as ComponentIcon,
  Palette, Type as TypeIcon, Menu, Check, Sparkles, ChevronRight, X, Plus,
} from "lucide-react";
import { z } from "zod";
import { getTemplate, TEMPLATES, type Template } from "@/lib/templates-data";
import { THEME_COLORS, getThemeColor } from "@/lib/theme-colors";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  template: z.string().optional(),
  color: z.string().optional(),
});

export const Route = createFileRoute("/builder")({
  head: () => ({ meta: [{ title: "Website Builder — Aether" }] }),
  validateSearch: (s) => searchSchema.parse(s),
  component: Builder,
});

type Device = "desktop" | "tablet" | "mobile";
type Panel = "pages" | "layers" | "assets" | "components" | "theme" | "navigation";

const SECTIONS = ["Header","Hero","Features","Gallery","Pricing","Testimonials","Footer"] as const;

function Builder() {
  const { template: tid, color: colorId } = Route.useSearch();
  const t = tid ? getTemplate(tid) : TEMPLATES[0];
  const initialTheme = getThemeColor(colorId);
  const [device, setDevice] = useState<Device>("desktop");
  const [panel, setPanel] = useState<Panel>("pages");
  const [savedTs, setSavedTs] = useState<"idle" | "saving" | "saved">("idle");
  const [publishOpen, setPublishOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("Hero");
  const [theme, setTheme] = useState({
    accent: initialTheme.accent,
    colorId: initialTheme.id,
    display: t.fontDisplay,
    body: t.fontBody,
    density: 1,
    width: 1200,
    mode: "dark" as "dark" | "light",
  });

  const frameW = device === "desktop" ? Math.min(theme.width, 1180) : device === "tablet" ? 820 : 380;

  const save = () => {
    setSavedTs("saving");
    setTimeout(() => setSavedTs("saved"), 700);
    setTimeout(() => setSavedTs("idle"), 1800);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-background text-foreground flex flex-col">
      {/* Top bar */}
      <header className="shrink-0 h-14 border-b border-white/[0.06] bg-background/60 backdrop-blur-2xl flex items-center gap-2 px-3 md:px-4">
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 h-9 px-2.5 rounded-lg glass hover:bg-white/10 text-xs transition">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className={cn("hidden md:flex h-9 w-9 rounded-xl bg-gradient-to-br grid place-items-center shadow-glow", t.tint)}>
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div className="min-w-0 hidden md:block">
          <div className="text-sm font-semibold truncate">{t.name}</div>
          <div className="text-[10px] text-muted-foreground truncate">Draft · autosaved</div>
        </div>

        {/* Center: device */}
        <div className="mx-auto flex items-center gap-2">
          <DeviceSwitch value={device} onChange={setDevice} />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5">
          <IconAction icon={Undo2} label="Undo" />
          <IconAction icon={Redo2} label="Redo" />
          <button onClick={save}
            className={cn(
              "inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs transition",
              savedTs === "saved" ? "bg-emerald-400/20 text-emerald-200" : "glass hover:bg-white/10"
            )}>
            {savedTs === "saved" ? <Check className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{savedTs === "saving" ? "Saving…" : savedTs === "saved" ? "Saved" : "Save"}</span>
          </button>
          <button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg glass hover:bg-white/10 text-xs">
            <Eye className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Preview</span>
          </button>
          <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
            onClick={() => setPublishOpen(true)}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-primary-gradient text-primary-foreground text-xs font-semibold shadow-glow">
            <Rocket className="h-3.5 w-3.5" /> Publish
          </motion.button>
        </div>
      </header>

      {/* Main workspace */}
      <div className="flex-1 min-h-0 grid grid-cols-[56px_280px_1fr] md:grid-cols-[56px_280px_1fr_320px]">
        {/* Rail */}
        <nav className="border-r border-white/[0.06] bg-background/40 backdrop-blur-2xl flex flex-col items-center gap-1 py-3">
          {([
            { k: "pages", icon: FileText, label: "Pages" },
            { k: "layers", icon: LayersIcon, label: "Layers" },
            { k: "assets", icon: ImageIcon, label: "Assets" },
            { k: "components", icon: ComponentIcon, label: "Components" },
            { k: "navigation", icon: Menu, label: "Navigation" },
            { k: "theme", icon: Palette, label: "Theme" },
          ] as { k: Panel; icon: any; label: string }[]).map(it => (
            <button key={it.k} onClick={() => setPanel(it.k)} title={it.label}
              className={cn("h-10 w-10 rounded-xl grid place-items-center transition",
                panel === it.k ? "bg-primary-gradient text-primary-foreground shadow-glow" : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
              )}>
              <it.icon className="h-4 w-4" />
            </button>
          ))}
        </nav>

        {/* Left panel */}
        <aside className="border-r border-white/[0.06] bg-background/40 backdrop-blur-2xl overflow-y-auto">
          <LeftPanel panel={panel} template={t} activeSection={activeSection} onPick={setActiveSection} theme={theme} setTheme={setTheme} />
        </aside>

        {/* Canvas */}
        <main className="relative overflow-auto bg-[radial-gradient(ellipse_at_top,rgba(120,90,255,0.15),transparent_60%)]">
          <div className="min-h-full flex justify-center p-4 md:p-8">
            <motion.div
              key={device + t.id}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
              style={{ width: frameW }}
              className="w-full max-w-full"
            >
              <FakeCanvas t={t} device={device} activeSection={activeSection} onPick={setActiveSection} theme={theme} />
            </motion.div>
          </div>
        </main>

        {/* Inspector (desktop only) */}
        <aside className="hidden md:block border-l border-white/[0.06] bg-background/40 backdrop-blur-2xl overflow-y-auto">
          <Inspector section={activeSection} theme={theme} setTheme={setTheme} template={t} />
        </aside>
      </div>

      {/* Publish */}
      <AnimatePresence>
        {publishOpen && (
          <motion.div className="fixed inset-0 z-[100] grid place-items-center px-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-background/70 backdrop-blur-2xl" onClick={() => setPublishOpen(false)} />
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 w-full max-w-md rounded-3xl glass-strong border border-white/10 shadow-elegant p-6">
              <button onClick={() => setPublishOpen(false)} className="absolute right-4 top-4 h-8 w-8 rounded-full glass grid place-items-center hover:rotate-90 transition-all"><X className="h-4 w-4" /></button>
              <div className="h-12 w-12 rounded-2xl bg-primary-gradient shadow-glow grid place-items-center"><Rocket className="h-5 w-5 text-primary-foreground" /></div>
              <h3 className="mt-4 font-display text-xl font-semibold">Publish your website</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">This will make your changes visible at <span className="text-foreground font-medium">{t.id}.aether.co</span>.</p>
              <div className="mt-5 flex items-center justify-end gap-2">
                <button onClick={() => setPublishOpen(false)} className="h-10 px-4 rounded-xl glass hover:bg-white/10 text-sm">Cancel</button>
                <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setPublishOpen(false)}
                  className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-primary-gradient text-primary-foreground text-sm font-semibold shadow-glow">
                  <Rocket className="h-4 w-4" /> Publish now
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- Left panels ---------------- */

function LeftPanel({ panel, template, activeSection, onPick, theme, setTheme }: {
  panel: Panel; template: Template; activeSection: string; onPick: (s: string) => void;
  theme: any; setTheme: (fn: any) => void;
}) {
  return (
    <div className="p-4">
      <PanelTitle label={panel} />

      {panel === "pages" && (
        <div className="mt-3 space-y-1">
          {template.pages.map((p, i) => (
            <button key={p}
              className={cn("w-full flex items-center gap-2 h-9 px-2.5 rounded-lg text-xs transition",
                i === 0 ? "bg-primary-gradient text-primary-foreground shadow-glow" : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
              )}>
              <FileText className="h-3.5 w-3.5" /> {p}
              {i === 0 && <span className="ml-auto text-[10px] opacity-80">Home</span>}
            </button>
          ))}
          <button className="mt-2 w-full flex items-center gap-2 h-9 px-2.5 rounded-lg glass border border-dashed border-white/15 hover:border-white/25 text-xs text-muted-foreground">
            <Plus className="h-3.5 w-3.5" /> Add page
          </button>
        </div>
      )}

      {panel === "layers" && (
        <div className="mt-3 space-y-0.5">
          {SECTIONS.map(s => (
            <button key={s} onClick={() => onPick(s)}
              className={cn("w-full flex items-center gap-2 h-8 px-2 rounded-md text-[12px] transition",
                activeSection === s ? "bg-white/[0.06] text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
              )}>
              <ChevronRight className="h-3 w-3" /> {s}
            </button>
          ))}
        </div>
      )}

      {panel === "assets" && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={cn("aspect-square rounded-lg bg-gradient-to-br border border-white/10", template.tint)} />
          ))}
        </div>
      )}

      {panel === "components" && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {["Hero", "Feature grid", "CTA", "Pricing", "Testimonial", "FAQ", "Gallery", "Footer"].map(c => (
            <button key={c} className="rounded-lg glass border border-white/10 hover:border-white/20 hover:shadow-glow p-3 text-left transition">
              <div className="h-10 rounded-md bg-white/[0.06] mb-2" />
              <div className="text-[11px] font-medium">{c}</div>
            </button>
          ))}
        </div>
      )}

      {panel === "navigation" && (
        <div className="mt-3 space-y-1.5">
          {template.pages.map(p => (
            <div key={p} className="flex items-center gap-2 h-9 px-2.5 rounded-lg glass border border-white/10 text-xs">
              <Menu className="h-3.5 w-3.5 text-muted-foreground" /> {p}
              <span className="ml-auto text-[10px] text-muted-foreground">/{p.toLowerCase()}</span>
            </div>
          ))}
        </div>
      )}

      {panel === "theme" && (
        <ThemePanel theme={theme} setTheme={setTheme} template={template} />
      )}
    </div>
  );
}

function PanelTitle({ label }: { label: string }) {
  return <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{label}</div>;
}

/* ---------------- Canvas ---------------- */

function FakeCanvas({ t, device, activeSection, onPick, theme }: {
  t: Template; device: Device; activeSection: string; onPick: (s: string) => void; theme: any;
}) {
  const cols = device === "mobile" ? 1 : device === "tablet" ? 2 : 3;
  return (
    <div className={cn("rounded-3xl overflow-hidden shadow-elegant border border-white/10 bg-gradient-to-br", t.tint)}
      style={{ fontFamily: `"${theme.body}", ui-sans-serif` }}>
      <Section name="Header" active={activeSection === "Header"} onPick={onPick}>
        <div className="flex items-center justify-between px-6 md:px-10 py-4">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-md" style={{ background: theme.accent }} />
            <span className="text-white/90 text-xs font-semibold">{t.name}</span>
          </div>
          {device !== "mobile" && (
            <div className="flex items-center gap-4 text-[11px] text-white/70">
              {t.pages.slice(0, 5).map(p => <span key={p}>{p}</span>)}
            </div>
          )}
          <div className="h-7 px-3 inline-flex items-center rounded-md text-[11px] font-semibold" style={{ background: theme.accent, color: "#0a0a0a" }}>Shop</div>
        </div>
      </Section>

      <Section name="Hero" active={activeSection === "Hero"} onPick={onPick}>
        <div className="px-6 md:px-10 py-10 md:py-16">
          <div className="max-w-xl">
            <div className="text-white/60 text-[10px] uppercase tracking-widest">Featured drop</div>
            <div className="mt-2 text-white text-3xl md:text-5xl font-semibold leading-[1.05]" style={{ fontFamily: `"${theme.display}", ui-sans-serif` }}>
              A season made to move with you.
            </div>
            <div className="mt-3 text-white/70 text-sm md:text-base max-w-lg">Meticulously crafted pieces engineered for everyday motion — designed with intention, made to last.</div>
            <div className="mt-6 flex items-center gap-2">
              <div className="inline-flex h-10 px-5 items-center rounded-xl text-xs font-semibold" style={{ background: theme.accent, color: "#0a0a0a" }}>Shop the drop</div>
              <div className="inline-flex h-10 px-4 items-center rounded-xl bg-white/10 border border-white/15 text-white/90 text-xs">Watch film</div>
            </div>
          </div>
        </div>
      </Section>

      <Section name="Features" active={activeSection === "Features"} onPick={onPick}>
        <div className="px-6 md:px-10 py-8 grid grid-cols-1 md:grid-cols-3 gap-3">
          {["Recycled knit","Ship in 24h","Free returns"].map(f => (
            <div key={f} className="rounded-2xl bg-white/10 border border-white/10 p-4">
              <div className="h-7 w-7 rounded-md mb-2" style={{ background: theme.accent }} />
              <div className="text-white text-sm font-semibold">{f}</div>
              <div className="text-white/60 text-[11px] mt-1">Effortless, considered, delightful.</div>
            </div>
          ))}
        </div>
      </Section>

      <Section name="Gallery" active={activeSection === "Gallery"} onPick={onPick}>
        <div className="px-6 md:px-10 py-8">
          <div className={cn("grid gap-3", cols === 3 ? "grid-cols-3" : cols === 2 ? "grid-cols-2" : "grid-cols-1")}>
            {Array.from({ length: cols === 1 ? 3 : cols === 2 ? 4 : 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] rounded-2xl bg-white/15 relative overflow-hidden">
                <div className="absolute inset-x-3 bottom-3 flex items-center justify-between">
                  <span className="text-white text-xs font-semibold">Piece 0{i+1}</span>
                  <span className="text-white/80 text-xs">$49</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section name="Pricing" active={activeSection === "Pricing"} onPick={onPick}>
        <div className="px-6 md:px-10 py-8 grid grid-cols-1 md:grid-cols-3 gap-3">
          {["Essential","Signature","Atelier"].map((p, i) => (
            <div key={p} className={cn("rounded-2xl border p-5", i === 1 ? "bg-white text-black border-white" : "bg-white/10 text-white border-white/10")}>
              <div className={cn("text-xs uppercase tracking-widest", i === 1 ? "text-black/60" : "text-white/60")}>{p}</div>
              <div className="mt-1 text-3xl font-semibold" style={{ fontFamily: `"${theme.display}", ui-sans-serif` }}>${(i + 1) * 29}</div>
              <div className={cn("mt-4 h-9 rounded-xl grid place-items-center text-xs font-semibold",
                i === 1 ? "" : "border border-white/15"
              )} style={i === 1 ? { background: theme.accent, color: "#0a0a0a" } : {}}>
                Choose plan
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section name="Testimonials" active={activeSection === "Testimonials"} onPick={onPick}>
        <div className="px-6 md:px-10 py-8 grid grid-cols-1 md:grid-cols-2 gap-3">
          {[0,1].map(i => (
            <div key={i} className="rounded-2xl bg-white/10 border border-white/10 p-5 text-white/90 text-sm">
              "The most considered brand I've come across this year. Everything feels intentional."
              <div className="mt-3 text-[11px] text-white/60">— Reviewer 0{i+1}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section name="Footer" active={activeSection === "Footer"} onPick={onPick}>
        <div className="px-6 md:px-10 py-8 flex items-center justify-between text-white/60 text-[11px]">
          <div>© {new Date().getFullYear()} {t.name}</div>
          <div className="flex items-center gap-3">Privacy · Terms · Careers</div>
        </div>
      </Section>
    </div>
  );
}

function Section({ name, active, onPick, children }: { name: string; active: boolean; onPick: (s: string) => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => onPick(name)}
      className={cn(
        "block w-full text-left relative transition",
        active ? "ring-2 ring-primary/60 ring-offset-0" : "hover:ring-1 hover:ring-white/20"
      )}
    >
      {active && (
        <span className="absolute -top-3 left-3 z-10 h-6 px-2 inline-flex items-center rounded-md bg-primary-gradient text-primary-foreground text-[10px] font-semibold shadow-glow">
          {name}
        </span>
      )}
      {children}
    </button>
  );
}

/* ---------------- Inspector ---------------- */

function Inspector({ section, theme, setTheme, template }: { section: string; theme: any; setTheme: (fn: any) => void; template: Template }) {
  return (
    <div className="p-4 space-y-5">
      <div>
        <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Selected</div>
        <div className="mt-1 text-sm font-semibold">{section} section</div>
      </div>

      <InspectorGroup title="Layout">
        <Slider label="Padding" min={16} max={160} value={80} />
        <Slider label="Max width" min={720} max={1440} value={theme.width}
          onChange={v => setTheme((s: any) => ({ ...s, width: v }))} />
        <ToggleRow label="Full width" />
      </InspectorGroup>

      <InspectorGroup title="Typography">
        <Row label="Display font">
          <select value={theme.display} onChange={e => setTheme((s: any) => ({ ...s, display: e.target.value }))}
            className="w-full h-8 px-2 rounded-md bg-white/[0.04] border border-white/10 text-xs outline-none">
            {[template.fontDisplay,"Inter","Space Grotesk","Fraunces","Playfair Display","DM Serif Display"].map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </Row>
        <Row label="Body font">
          <select value={theme.body} onChange={e => setTheme((s: any) => ({ ...s, body: e.target.value }))}
            className="w-full h-8 px-2 rounded-md bg-white/[0.04] border border-white/10 text-xs outline-none">
            {["Inter","Space Grotesk","IBM Plex Sans","Manrope"].map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </Row>
      </InspectorGroup>

      <InspectorGroup title="Colors">
        <div className="flex flex-wrap gap-1.5">
          {template.palette.map((c, i) => (
            <button key={i} onClick={() => setTheme((s: any) => ({ ...s, accent: c }))}
              className={cn("h-7 w-7 rounded-md border transition",
                theme.accent === c ? "border-white ring-2 ring-primary/50" : "border-white/10"
              )} style={{ background: c }} />
          ))}
          <label className="h-7 w-7 rounded-md border border-white/10 grid place-items-center cursor-pointer relative overflow-hidden">
            <input type="color" value={theme.accent}
              onChange={e => setTheme((s: any) => ({ ...s, accent: e.target.value }))}
              className="absolute inset-0 opacity-0 cursor-pointer" />
            <Plus className="h-3.5 w-3.5" />
          </label>
        </div>
      </InspectorGroup>

      <InspectorGroup title="Effects">
        <Slider label="Density" min={0.75} max={1.25} step={0.05} value={theme.density}
          onChange={v => setTheme((s: any) => ({ ...s, density: v }))} />
        <ToggleRow label="Animations" checked />
        <ToggleRow label="Glass blur" checked />
      </InspectorGroup>
    </div>
  );
}

function ThemePanel({ theme, setTheme, template }: { theme: any; setTheme: (fn: any) => void; template: Template }) {
  return (
    <div className="mt-3 space-y-4">
      <InspectorGroup title="Mode">
        <div className="grid grid-cols-3 gap-1.5">
          {(["dark","light","system"] as const).map(m => (
            <button key={m} onClick={() => setTheme((s: any) => ({ ...s, mode: m === "system" ? s.mode : m }))}
              className={cn("h-8 rounded-md text-[11px] capitalize border transition",
                theme.mode === m ? "bg-primary-gradient text-primary-foreground border-transparent shadow-glow" : "glass border-white/10 text-muted-foreground"
              )}>{m}</button>
          ))}
        </div>
      </InspectorGroup>
      <InspectorGroup title="Theme color">
        <div className="grid grid-cols-6 gap-1.5">
          {THEME_COLORS.map(c => (
            <button key={c.id} title={c.name}
              onClick={() => setTheme((s: any) => ({ ...s, accent: c.accent, colorId: c.id }))}
              className={cn("h-7 w-7 rounded-md border transition hover:scale-110",
                theme.colorId === c.id ? "border-white ring-2 ring-primary/60" : "border-white/10"
              )} style={{ background: c.accent }} />
          ))}
        </div>
        <div className="mt-1 text-[10px] text-muted-foreground">
          {THEME_COLORS.find(c => c.id === theme.colorId)?.name ?? "Custom"}
        </div>
      </InspectorGroup>
      <InspectorGroup title="Palette">
        <div className="flex flex-wrap gap-1.5">
          {template.palette.map((c, i) => (
            <button key={i} onClick={() => setTheme((s: any) => ({ ...s, accent: c, colorId: "custom" }))}
              className={cn("h-7 w-7 rounded-md border transition",
                theme.accent === c ? "border-white ring-2 ring-primary/50" : "border-white/10"
              )} style={{ background: c }} />
          ))}
        </div>
      </InspectorGroup>
      <InspectorGroup title="Typography">
        <Row label="Display"><span className="text-xs text-muted-foreground">{theme.display}</span></Row>
        <Row label="Body"><span className="text-xs text-muted-foreground">{theme.body}</span></Row>
      </InspectorGroup>
      <InspectorGroup title="Header style">
        <div className="grid grid-cols-3 gap-1.5">
          {["Minimal","Sticky","Split"].map(l => <button key={l} className="h-8 rounded-md text-[11px] glass border border-white/10 text-muted-foreground hover:text-foreground">{l}</button>)}
        </div>
      </InspectorGroup>
      <InspectorGroup title="Footer style">
        <div className="grid grid-cols-3 gap-1.5">
          {["Simple","Rich","Newsletter"].map(l => <button key={l} className="h-8 rounded-md text-[11px] glass border border-white/10 text-muted-foreground hover:text-foreground">{l}</button>)}
        </div>
      </InspectorGroup>
      <button onClick={() => setTheme({
        accent: template.accent, display: template.fontDisplay, body: template.fontBody,
        density: 1, width: 1200, mode: "dark",
      })}
        className="w-full h-9 rounded-xl glass border border-white/10 text-xs text-muted-foreground hover:text-foreground hover:bg-white/10 transition">
        Reset theme
      </button>
    </div>
  );
}

function InspectorGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{title}</div>
      <div className="rounded-xl glass border border-white/10 p-3 space-y-2.5">{children}</div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[80px_1fr] items-center gap-2">
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div>{children}</div>
    </div>
  );
}

function Slider({ label, min, max, step = 1, value, onChange }: { label: string; min: number; max: number; step?: number; value: number; onChange?: (v: number) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
        <span>{label}</span><span className="text-foreground">{typeof value === "number" ? Number(value).toFixed(step < 1 ? 2 : 0) : value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange?.(Number(e.target.value))}
        className="w-full accent-[oklch(0.68_0.24_295)]"
      />
    </div>
  );
}

function ToggleRow({ label, checked = false }: { label: string; checked?: boolean }) {
  const [on, setOn] = useState(checked);
  return (
    <button onClick={() => setOn(v => !v)} className="w-full flex items-center justify-between">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className={cn("h-5 w-9 rounded-full border transition relative",
        on ? "bg-primary-gradient border-transparent shadow-glow" : "bg-white/[0.04] border-white/10"
      )}>
        <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all", on ? "left-4" : "left-0.5")} />
      </span>
    </button>
  );
}

/* ---------------- Chrome ---------------- */

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

function IconAction({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <button aria-label={label}
      className="h-9 w-9 rounded-lg glass border border-white/10 grid place-items-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition">
      <Icon className="h-4 w-4" />
    </button>
  );
}
// keep TypeIcon referenced for potential future use
void TypeIcon;
