# AutoDiscovery Brand Guidelines

> **Version 1.0** | February 2026 | Midnight Vegas Hackathon

---

## 🎨 Brand Identity Overview

**AutoDiscovery** is a cutting-edge, geographically compliant legal discovery platform powered by Midnight Network. Our brand identity balances **legal authority** with **technological innovation**, creating a visual language that speaks to both legal professionals and technical innovators.

### Brand Positioning

> *"Cutting-edge compliance automation that speaks the language of the courtroom"*

**Target Audience:** Legal professionals, litigation paralegals, law firms, corporate legal departments  
**Brand Personality:** Authoritative yet approachable, precise but never pompous  
**Design Aesthetic:** Legal Modernism (Bloomberg Terminal meets LexisNexis)

---

## 🎨 Color Palette

### Primary Colors

These colors form the foundation of our visual identity and should be used for primary UI elements, text, and branding.

| Color Name | HEX | Usage |
|------------|-----|-------|
| **Deep Navy** | `#1A2B4A` | Primary brand color, headings, main text |
| **Legal Blue** | `#2E5C8A` | Interactive elements, links, primary buttons |
| **Slate Gray** | `#4A5568` | Secondary text, subtle elements |

```typescript
primary: {
  deepNavy: '#1A2B4A',
  legalBlue: '#2E5C8A',
  slateGray: '#4A5568',
}
```

### Accent Colors

Accent colors provide visual interest and functional feedback.

| Color Name | HEX | Usage |
|------------|-----|-------|
| **Oracle Gold** | `#D4AF37` | Highlights, premium features, GeoOracle branding |
| **Compliance Green** | `#10B981` | Success states, compliance indicators |
| **Alert Red** | `#DC2626` | Errors, warnings, non-compliance alerts |

```typescript
accent: {
  oracleGold: '#D4AF37',
  complianceGreen: '#10B981',
  alertRed: '#DC2626',
}
```

### Neutral Palette

Neutrals provide balance and support content readability.

| Color Name | HEX | Usage |
|------------|-----|-------|
| **Off-White** | `#F9FAFB` | Light backgrounds, cards |
| **Light Gray** | `#E5E7EB` | Borders, dividers, subtle backgrounds |
| **Charcoal** | `#1F2937` | Dark mode backgrounds, deep contrast |

```typescript
neutral: {
  offWhite: '#F9FAFB',
  lightGray: '#E5E7EB',
  charcoal: '#1F2937',
}
```

### Semantic Colors

Semantic colors communicate state and feedback.

| Color Name | HEX | Usage |
|------------|-----|-------|
| **Success** | `#10B981` | Successful operations, compliant status |
| **Warning** | `#F59E0B` | Caution, review required |
| **Error** | `#DC2626` | Errors, critical issues |
| **Info** | `#2E5C8A` | Informational messages, tooltips |

```typescript
semantic: {
  success: '#10B981',
  warning: '#F59E0B',
  error: '#DC2626',
  info: '#2E5C8A',
}
```

---

## ✍️ Typography

### Font Families

Our typography system uses three carefully selected typefaces:

| Font | Purpose | Fallback |
|------|---------|----------|
| **IBM Plex Serif** | Headings, brand voice, legal authority | Georgia, serif |
| **Inter** | UI elements, body text, readability | -apple-system, sans-serif |
| **JetBrains Mono** | Code, technical data, monospace needs | Fira Code, monospace |

```typescript
fontFamily: {
  serif: '"IBM Plex Serif", Georgia, serif',
  sans: '"Inter", -apple-system, sans-serif',
  mono: '"JetBrains Mono", "Fira Code", monospace',
}
```

### Type Scale

| Size | rem | px | Usage |
|------|-----|-----|-------|
| xs | 0.75rem | 12px | Small labels, captions |
| sm | 0.875rem | 14px | Secondary text, metadata |
| base | 1rem | 16px | Body text (default) |
| lg | 1.125rem | 18px | Emphasized body text |
| xl | 1.25rem | 20px | Small headings |
| 2xl | 1.5rem | 24px | Section headings |
| 3xl | 1.875rem | 30px | Page headings |
| 4xl | 2.25rem | 36px | Major headings |
| 5xl | 3rem | 48px | Hero headings |

### Font Weights

| Weight | Value | Usage |
|--------|-------|-------|
| Regular | 400 | Body text, general content |
| Medium | 500 | Emphasis, subheadings |
| Semibold | 600 | UI elements, buttons |
| Bold | 700 | Headings, strong emphasis |

### Line Height

| Name | Value | Usage |
|------|-------|-------|
| Tight | 1.25 | Headings, compact layouts |
| Normal | 1.5 | Body text (default) |
| Relaxed | 1.75 | Long-form content, legal text |

---

## 🧩 Logo Usage

### Logo Variations

We provide 5 logo variations for different contexts:

1. **`logo-full-color.svg`** — Full wordmark with icon (primary usage)
2. **`logo-icon-only.svg`** — Icon only (favicons, avatars, tight spaces)
3. **`logo-light.svg`** — Light theme variant (dark text on light backgrounds)
4. **`logo-dark.svg`** — Dark theme variant (light text on dark backgrounds)
5. **`logo-geooracle.svg`** — GeoOracle sub-brand (compliance engine branding)

### Clear Space

Maintain a minimum clear space around the logo equal to the height of the compass icon.

### Minimum Size

- **Full logo:** Minimum width 200px
- **Icon only:** Minimum size 32x32px

### Logo Don'ts

❌ Don't stretch or distort the logo  
❌ Don't change logo colors outside approved variations  
❌ Don't add effects (shadows, gradients, outlines)  
❌ Don't place logo on busy backgrounds without sufficient contrast  
❌ Don't rotate the logo

---

## 🎭 Voice & Tone

### Brand Voice Characteristics

**Authoritative** — We speak with confidence about complex legal compliance  
**Approachable** — We make technical concepts accessible to legal professionals  
**Precise** — We use clear, unambiguous language befitting legal contexts  
**Modern** — We embrace innovation while respecting legal traditions

### Writing Examples

#### ✅ Good Examples

- "AutoDiscovery automatically applies jurisdiction-specific rules to ensure compliance."
- "Your discovery requests are validated against Idaho IRCP requirements."
- "Non-compliance detected. Review required before submission."

#### ❌ Avoid

- "Our AI will magically handle all your legal stuff!" (Too casual, imprecise)
- "Utilizing synergistic paradigms to optimize discovery workflows..." (Jargon-heavy)
- "URGENT! CRITICAL ERROR!" (Alarmist, unprofessional)

### UI Copy Guidelines

- Use title case for headings: "Jurisdiction Settings"
- Use sentence case for buttons: "Submit request"
- Be specific: "3 non-compliant items" not "Some issues found"
- Show confidence: "Compliant with Idaho IRCP" not "Seems to comply"

---

## 🧩 Component Design Principles

### Visual Hierarchy

1. **Primary actions** use Legal Blue with high contrast
2. **Secondary actions** use Oracle Gold or outlined buttons
3. **Destructive actions** use Alert Red with confirmation
4. **Disabled states** use 40% opacity

### Spacing System

Based on 4px increments:

```typescript
spacing: {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
}
```

### Border Radius

| Size | Value | Usage |
|------|-------|-------|
| sm | 4px | Small elements, badges |
| md | 6px | Buttons, inputs |
| lg | 10px | Cards, containers (default) |
| xl | 16px | Large panels, modals |

### Elevation (Shadows)

Use subtle shadows to create depth:

```css
/* Low elevation */
box-shadow: 0 1px 3px rgba(26, 43, 74, 0.1);

/* Medium elevation */
box-shadow: 0 4px 6px rgba(26, 43, 74, 0.15);

/* High elevation */
box-shadow: 0 10px 15px rgba(26, 43, 74, 0.2);
```

---

## ♿ Accessibility Guidelines

### Color Contrast

All text must meet **WCAG 2.1 AA standards**:

- Normal text (< 18px): Minimum 4.5:1 contrast ratio
- Large text (≥ 18px): Minimum 3:1 contrast ratio
- UI components: Minimum 3:1 contrast ratio

### Verified Combinations

✅ Deep Navy (#1A2B4A) on Off-White (#F9FAFB) — 12.8:1  
✅ Legal Blue (#2E5C8A) on Off-White (#F9FAFB) — 6.2:1  
✅ Off-White (#F9FAFB) on Deep Navy (#1A2B4A) — 12.8:1  
✅ Oracle Gold (#D4AF37) on Deep Navy (#1A2B4A) — 5.1:1

### Interactive States

Always provide visual feedback for interactive elements:

- **Hover:** Slight brightness change or underline
- **Focus:** Visible outline (Legal Blue, 2px)
- **Active:** Pressed state with slight scale or color shift
- **Disabled:** 40% opacity + cursor: not-allowed

### Screen Reader Support

- Use semantic HTML (`<nav>`, `<main>`, `<section>`)
- Provide `aria-label` for icon-only buttons
- Include descriptive alt text for images
- Ensure keyboard navigation works for all interactive elements

---

## 🎨 Component Usage Patterns

### Buttons

```tsx
// Primary action
<BrandedButton variant="primary">Submit Request</BrandedButton>

// Secondary action
<BrandedButton variant="secondary">Save Draft</BrandedButton>

// Outlined
<BrandedButton variant="outline">Cancel</BrandedButton>
```

### Compliance Indicators

Use traffic light colors for compliance status:

- 🟢 **Green:** Compliant, approved, validated
- 🟡 **Yellow:** Under review, pending verification
- 🔴 **Red:** Non-compliant, rejected, requires correction

```tsx
<ComplianceBadge status="compliant" />
<ComplianceBadge status="review" label="Pending Review" />
<ComplianceBadge status="non-compliant" />
```

### Jurisdiction Banners

Display active jurisdiction context prominently:

```tsx
<JurisdictionBanner 
  jurisdiction="Idaho" 
  rules="IRCP" 
  status="active" 
/>
```

---

## 📐 Grid & Layout

### Responsive Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| sm | 640px | Mobile landscape |
| md | 768px | Tablets |
| lg | 1024px | Desktop |
| xl | 1280px | Large desktop |
| 2xl | 1536px | Extra large screens |

### Container Widths

- **Narrow:** Max 640px (forms, focused content)
- **Medium:** Max 1024px (general pages)
- **Wide:** Max 1280px (dashboards, tables)
- **Full:** 100% (landing pages, immersive experiences)

---

## 🚀 Implementation

### Installing Design System

```bash
cd frontend-vite-react
npm install @fontsource/ibm-plex-serif @fontsource/inter @fontsource/jetbrains-mono
```

### Importing Tokens

```typescript
import { colors } from '@/design-system/tokens/colors';
import { typography } from '@/design-system/tokens/typography';
import { spacing } from '@/design-system/tokens/spacing';
```

### Using Components

```typescript
import { 
  BrandedButton, 
  ComplianceBadge, 
  JurisdictionBanner 
} from '@/components/autodiscovery';
```

---

## 📚 Reference Materials

### Design Inspiration

- **Clio** — Legal practice management
- **Ironclad** — Contract lifecycle management
- **Briefpoint.ai** — AI-powered legal drafting
- **Filevine** — Case management software
- **Bloomberg Terminal** — Professional data interface
- **LexisNexis** — Legal research authority

### Additional Resources

- [IBM Plex Typography](https://www.ibm.com/plex/)
- [Inter Font Family](https://rsms.me/inter/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design Elevation](https://material.io/design/environment/elevation.html)

---

## ✅ Brand Checklist

When creating new components or pages, verify:

- [ ] Uses approved color palette
- [ ] Typography follows scale and weight guidelines
- [ ] Meets WCAG 2.1 AA contrast requirements
- [ ] Responsive across all breakpoints
- [ ] Interactive states are clearly visible
- [ ] Spacing follows 4px increment system
- [ ] Voice and tone align with brand guidelines
- [ ] Logo usage follows clear space and sizing rules

---

**Last Updated:** February 11, 2026  
**Maintained By:** AutoDiscovery Design Team  
**Contact:** For questions about brand usage, consult this document or reach out to the team.

*AutoDiscovery — Build Once. Comply Everywhere.*
