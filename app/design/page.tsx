import { SportBadge } from "@/components/events/sport-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SPORT_TYPES } from "@/lib/schemas/event";

// ---------------------------------------------------------------------------
// Section wrapper
// ---------------------------------------------------------------------------
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="font-heading text-2xl font-semibold tracking-wide uppercase text-foreground border-b border-border pb-2">
        {title}
      </h2>
      {children}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Color swatch
// ---------------------------------------------------------------------------
function Swatch({ token, label }: { token: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="h-14 w-14 rounded-md border border-border shadow-xs"
        style={{ background: `var(--${token})` }}
      />
      <span className="text-xs text-muted-foreground text-center leading-tight">
        {label}
        <br />
        <code className="text-[10px]">--{token}</code>
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function DesignPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-baseline gap-3">
            <h1 className="font-heading text-5xl font-bold tracking-wide uppercase text-foreground">
              Design System
            </h1>
            <span className="inline-flex items-center rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">
              Dev reference only
            </span>
          </div>
          <p className="mt-2 text-muted-foreground text-sm">
            Fastbreak UI component library — colours, typography, and patterns.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-14">

        {/* ── Typography ── */}
        <Section title="Typography">
          <div className="space-y-4 rounded-lg border border-border bg-card p-6">
            <div>
              <p className="text-xs text-muted-foreground mb-1">h1 — font-heading 48px / Bold</p>
              <h1 className="font-heading text-5xl font-bold tracking-wide uppercase leading-none">
                Match Day
              </h1>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">h2 — font-heading 36px / Semibold</p>
              <h2 className="font-heading text-4xl font-semibold tracking-wide uppercase leading-none">
                Premier League
              </h2>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">h3 — font-heading 24px / Semibold</p>
              <h3 className="font-heading text-2xl font-semibold tracking-wide uppercase leading-none">
                Group Stage
              </h3>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Body — font-sans 16px / Regular</p>
              <p className="text-base leading-relaxed">
                The quick brown fox jumps over the lazy dog. Fastbreak gives
                sports fans a clear, scannable view of every event — from kickoff
                time to venue details.
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Small / Muted — font-sans 14px / Regular</p>
              <p className="text-sm text-muted-foreground">
                Venue details · Secondary metadata · Helper text
              </p>
            </div>
          </div>
        </Section>

        {/* ── Colors ── */}
        <Section title="Color Tokens">
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex flex-wrap gap-6">
              <Swatch token="primary" label="Primary" />
              <Swatch token="secondary" label="Secondary" />
              <Swatch token="muted" label="Muted" />
              <Swatch token="accent" label="Accent" />
              <Swatch token="destructive" label="Destructive" />
              <Swatch token="background" label="Background" />
              <Swatch token="card" label="Card" />
              <Swatch token="border" label="Border" />
            </div>
          </div>
        </Section>

        {/* ── Buttons ── */}
        <Section title="Buttons">
          <div className="rounded-lg border border-border bg-card p-6 space-y-6">
            {/* Variants */}
            <div>
              <p className="text-xs text-muted-foreground mb-3">Variants (default size)</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="default">Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
            </div>
            {/* Sizes */}
            <div>
              <p className="text-xs text-muted-foreground mb-3">Sizes (default variant)</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon" aria-label="Icon button">
                  ⚽
                </Button>
              </div>
            </div>
            {/* States */}
            <div>
              <p className="text-xs text-muted-foreground mb-3">States</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="default" disabled>Disabled</Button>
                <Button variant="outline" disabled>Disabled Outline</Button>
              </div>
            </div>
          </div>
        </Section>

        {/* ── Badges ── */}
        <Section title="Badges & Sport Badges">
          <div className="rounded-lg border border-border bg-card p-6 space-y-6">
            <div>
              <p className="text-xs text-muted-foreground mb-3">Badge variants</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-3">Sport badges — all 8 sport types</p>
              <div className="flex flex-wrap gap-2">
                {SPORT_TYPES.map((sport) => (
                  <SportBadge key={sport} sport={sport} />
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ── Card ── */}
        <Section title="Card">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-xl uppercase tracking-wide">
                  Champions League
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <SportBadge sport="Soccer" />
                  <span className="text-sm text-muted-foreground">Sat 12 Apr · 19:45</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Quarter-final second leg. Wembley Stadium, London.
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  View Event
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-xl uppercase tracking-wide">
                  NBA Finals Game 3
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <SportBadge sport="Basketball" />
                  <span className="text-sm text-muted-foreground">Sun 13 Apr · 21:00</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Home court advantage. TD Garden, Boston.
                </p>
                <Button size="sm" className="w-full">
                  View Event
                </Button>
              </CardContent>
            </Card>
          </div>
        </Section>

        {/* ── Inputs ── */}
        <Section title="Form Inputs">
          <div className="rounded-lg border border-border bg-card p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="demo-input">
                  Text Input
                </label>
                <Input id="demo-input" placeholder="e.g. Champions League Final" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="demo-input-disabled">
                  Disabled Input
                </label>
                <Input id="demo-input-disabled" placeholder="Disabled state" disabled />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Select
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose sport type…" />
                  </SelectTrigger>
                  <SelectContent>
                    {SPORT_TYPES.map((sport) => (
                      <SelectItem key={sport} value={sport}>
                        {sport}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Date Input
                </label>
                <Input type="datetime-local" />
              </div>
            </div>
          </div>
        </Section>

      </div>
    </div>
  );
}
