# Design Brief: Digital Healthcare Wellness Tracker

## Purpose & Tone
Premium health-tech platform for wellness management. Tone: trustworthy, calm, optimistic—inspires confidence without clinical coldness. Users manage personal health data with actionable AI insights.

## Color Palette
| Token | OKLCH | Hex | Usage |
|-------|-------|-----|-------|
| Primary | 0.50 0.15 252 | #0077B6 | Ocean blue—trust, calm, primary CTAs, headers |
| Secondary | 0.68 0.14 261 | #00B4D8 | Bright sky—active states, hover, secondary actions |
| Accent | 0.68 0.10 142 | #52B788 | Wellness green—success, health gains, positive metrics |
| Foreground | 0.20 0 0 | #1a1a1a | Text on light backgrounds—deep grey |
| Background | 0.98 0 0 | #fafafa | Off-white—main surface |
| Card | 1.0 0 0 | #ffffff | Pure white—elevated content zones |
| Muted | 0.93 0.02 262 | #e6f0ff | Subtle blue tint—secondary surfaces, dividers |
| Border | 0.88 0.02 252 | #d4e0f0 | Light blue-grey—card/section dividers |

## Typography
| Layer | Font | Weight | Size | Usage |
|-------|------|--------|------|-------|
| Display | Bricolage Grotesque | 600 | 28–48px | Page titles, health scores, key metrics |
| Body | DM Sans | 400 | 14–16px | Content, descriptions, UI copy |
| Mono | JetBrains Mono | 400 | 12–14px | Calorie values, numeric metrics, timestamps |

## Structural Zones
| Zone | Background | Border | Elevation | Purpose |
|------|-----------|--------|-----------|---------|
| Header | `oklch(var(--primary))` | None | Solid | Navigation, user context, primary CTA |
| Main Content | `oklch(var(--background))` | None | Flat | Page scaffold, breathing room |
| Card Sections | `oklch(var(--card))` | `1px solid oklch(var(--border))` | `shadow-md` | Content containers, modular layout |
| Alternate Rows | `oklch(var(--muted))` | None | None | Rhythm, visual scanning aid |
| Footer | `oklch(var(--muted))`  | `1px solid oklch(var(--border))` | None | Legal, secondary nav |

## Shape Language
| Element | Radius | Intent |
|---------|--------|--------|
| Cards | 12px (`--radius: 0.75rem`) | Modern, approachable |
| Buttons | 8px | Touch-friendly, scannable |
| Inputs | 8px | Clear affordance |
| Badges | 4px | Compact, tight |
| Full-width panels | 0px | Structural anchor |

## Motion & Animation
- **Transition Base**: All interactive elements use `cubic-bezier(0.4, 0, 0.2, 1)` over 0.3s
- **Card Interactions**: Hover state lifts shadow (shadow-md → shadow-lg), 2px scale-up
- **Progress Rings**: Gentle pulse animation (2s cycle, 0.8–1.0 opacity)
- **Chart Reveals**: Fade-in + slide-up-from-bottom (0.3s staggered)
- **Emoji Icons**: No movement on load; hover: subtle scale (1.0 → 1.1)

## Spacing & Rhythm
- **Component gap**: 16px (card-to-card, section-to-section)
- **Internal padding**: 24px (card body), 32px (page sections)
- **Icon + text spacing**: 8px horizontal, 12px vertical
- **Dense rhythm** in charts (8px bar gaps); **spacious rhythm** in dashboard cards (24px between metric cards)

## Component Patterns
- **Health Metric Card**: Icon (emoji) + value (display font 24px) + label (body 12px) + trend indicator (✓/⚠️ accent/destructive)
- **Food Item Card**: Food image/thumbnail + name + calories + macro breakdown + portion selector + delete button
- **Progress Ring**: Circular SVG, arc-based, color-coded (green ≥80% goal, yellow 50–80%, red <50%)
- **Chart Container**: Muted background, soft border, no external shadow, clean axes/labels
- **CTA Button**: Solid primary bg, white text, hover opacity, active scale-down (active:scale-95)

## Emoji Icon System
Each feature area marked with emoji for visual scanning: 🥗 Food Scanner, 😊 Mood Tracker, 📊 Health Score, 💪 Exercise, 🩺 Symptoms, 🏥 Medical Analysis, 🧘 Yoga, ⏰ Reminders, 📱 Mobile-ready

## Differentiator
Emoji-first visual language paired with smooth micro-interactions (card lift on hover, progress ring pulse, chart reveal animation) creates a modern yet approachable health interface that feels premium without clinical coldness. Ocean blue palette conveys medical trust; green accent celebrates positive health outcomes.

## Accessibility & Constraints
- Minimum text contrast: AA+ (WCAG 2.1)
- Avoid color-only information (always pair with icon/label)
- Touch targets ≥48px for mobile
- Reduced-motion: Remove animations for `prefers-reduced-motion`
- Dark mode tuned for readability (higher L values for text, lower for backgrounds)

## Medical Disclaimer Placement
All AI analysis results display: "⚠️ This is AI-assisted analysis only—not a medical diagnosis. Please consult a healthcare provider." Styled with destructive-foreground on muted background, placed above result cards.
