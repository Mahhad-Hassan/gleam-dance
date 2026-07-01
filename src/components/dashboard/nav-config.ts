import {
  Home, ShoppingCart, FileText, ShoppingBasket, Package, Layers, Boxes,
  ClipboardList, ArrowRightLeft, Gift, Users, PieChart, Building2,
  TrendingUp, BadgePercent, FileStack, Database, Folder, MenuSquare,
  NotebookPen, BarChart3, FileBarChart, Activity, Store, File as FileIcon,
  Settings, Bot, Instagram, Puzzle, MessageCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  slug: string;      // "" = home (index)
  label: string;
  icon: LucideIcon;
  children?: NavItem[];
};

export type NavGroup = { title?: string; items: NavItem[] };

export const NAV: NavGroup[] = [
  {
    items: [
      { slug: "", label: "Home", icon: Home },
      { slug: "orders", label: "Orders", icon: ShoppingCart, children: [
        { slug: "orders/drafts", label: "Drafts", icon: FileText },
        { slug: "orders/abandoned", label: "Abandoned Checkouts", icon: ShoppingBasket },
      ]},
      { slug: "products", label: "Products", icon: Package, children: [
        { slug: "products/collections", label: "Collections", icon: Layers },
        { slug: "products/inventory", label: "Inventory", icon: Boxes },
        { slug: "products/purchase-orders", label: "Purchase Orders", icon: ClipboardList },
        { slug: "products/transfers", label: "Transfers", icon: ArrowRightLeft },
        { slug: "products/gift-cards", label: "Gift Cards", icon: Gift },
      ]},
      { slug: "customers", label: "Customers", icon: Users, children: [
        { slug: "customers/segments", label: "Segments", icon: PieChart },
        { slug: "customers/companies", label: "Companies", icon: Building2 },
      ]},
      { slug: "growth", label: "Growth", icon: TrendingUp },
      { slug: "discounts", label: "Discounts", icon: BadgePercent },
      { slug: "content", label: "Content", icon: FileStack, children: [
        { slug: "content/metaobjects", label: "Metaobjects", icon: Database },
        { slug: "content/files", label: "Files", icon: Folder },
        { slug: "content/menus", label: "Menus", icon: MenuSquare },
        { slug: "content/blog", label: "Blog Posts", icon: NotebookPen },
      ]},
      { slug: "analytics", label: "Analytics", icon: BarChart3, children: [
        { slug: "analytics/reports", label: "Reports", icon: FileBarChart },
        { slug: "analytics/live", label: "Live View", icon: Activity },
      ]},
    ],
  },
  {
    title: "Sales Channels",
    items: [
      { slug: "online-store", label: "Online Store", icon: Store, children: [
        { slug: "online-store/pages", label: "Pages", icon: FileIcon },
        { slug: "online-store/preferences", label: "Preferences", icon: Settings },
      ]},
      { slug: "agentic", label: "Agentic", icon: Bot },
      { slug: "facebook-instagram", label: "Facebook & Instagram", icon: Instagram },
    ],
  },
  {
    title: "Apps",
    items: [
      { slug: "apps/whatflow", label: "Whatflow Chat Auto", icon: MessageCircle, },
    ],
  },
];

export const APPS_ICON = Puzzle;

export function findItem(slug: string): NavItem | null {
  for (const g of NAV) for (const it of g.items) {
    if (it.slug === slug) return it;
    if (it.children) for (const c of it.children) if (c.slug === slug) return c;
  }
  return null;
}
