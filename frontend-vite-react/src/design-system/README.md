# AutoDiscovery Design System

> A comprehensive design system for building consistent, accessible, and branded UI components.

---

## 📚 Overview

The AutoDiscovery design system provides:

- **Design Tokens** — Centralized color, typography, and spacing constants
- **Branded Components** — Pre-built UI components following brand guidelines
- **Type Safety** — Full TypeScript support with exported types
- **Accessibility** — WCAG 2.1 AA compliant components
- **Consistency** — Unified visual language across the application

---

## 🎨 Design Tokens

Design tokens are the foundational design decisions expressed as code. They ensure visual consistency and make it easy to update designs system-wide.

### Colors

```typescript
import { colors } from '@/design-system/tokens/colors';

// Primary colors
colors.primary.deepNavy    // #1A2B4A
colors.primary.legalBlue   // #2E5C8A
colors.primary.slateGray   // #4A5568

// Accent colors
colors.accent.oracleGold       // #D4AF37
colors.accent.complianceGreen  // #10B981
colors.accent.alertRed         // #DC2626

// Neutral palette
colors.neutral.offWhite   // #F9FAFB
colors.neutral.lightGray  // #E5E7EB
colors.neutral.charcoal   // #1F2937

// Semantic colors
colors.semantic.success  // #10B981
colors.semantic.warning  // #F59E0B
colors.semantic.error    // #DC2626
colors.semantic.info     // #2E5C8A
```

### Typography

```typescript
import { typography } from '@/design-system/tokens/typography';

// Font families
typography.fontFamily.serif  // "IBM Plex Serif", Georgia, serif
typography.fontFamily.sans   // "Inter", -apple-system, sans-serif
typography.fontFamily.mono   // "JetBrains Mono", "Fira Code", monospace

// Font sizes
typography.fontSize.xs    // 0.75rem (12px)
typography.fontSize.base  // 1rem (16px)
typography.fontSize['2xl'] // 1.5rem (24px)

// Font weights
typography.fontWeight.regular   // 400
typography.fontWeight.semibold  // 600
typography.fontWeight.bold      // 700

// Line heights
typography.lineHeight.tight    // 1.25
typography.lineHeight.normal   // 1.5
typography.lineHeight.relaxed  // 1.75
```

### Spacing

```typescript
import { spacing } from '@/design-system/tokens/spacing';

spacing.xs   // 4px
spacing.sm   // 8px
spacing.md   // 16px
spacing.lg   // 24px
spacing.xl   // 32px
spacing['2xl'] // 48px
```

### Importing All Tokens

```typescript
import { colors, typography, spacing } from '@/design-system/tokens';
```

---

## 🧩 Components

### BrandedButton

Primary UI button with brand styling.

```typescript
import { BrandedButton } from '@/components/autodiscovery';

// Primary button
<BrandedButton variant="primary" size="md">
  Submit Request
</BrandedButton>

// Secondary button
<BrandedButton variant="secondary" size="lg">
  Save Draft
</BrandedButton>

// Outline button
<BrandedButton variant="outline" size="sm">
  Cancel
</BrandedButton>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline'
- `size`: 'sm' | 'md' | 'lg'
- All standard HTML button attributes

### ComplianceBadge

Traffic light indicator for compliance status.

```typescript
import { ComplianceBadge } from '@/components/autodiscovery';

// Compliant status (green)
<ComplianceBadge status="compliant" />

// Review status (yellow)
<ComplianceBadge status="review" label="Pending Review" />

// Non-compliant status (red)
<ComplianceBadge status="non-compliant" />
```

**Props:**
- `status`: 'compliant' | 'review' | 'non-compliant'
- `label?`: Optional custom label text

### JurisdictionBanner

Display active jurisdiction context.

```typescript
import { JurisdictionBanner } from '@/components/autodiscovery';

<JurisdictionBanner 
  jurisdiction="Idaho" 
  rules="IRCP" 
  status="active" 
/>
```

**Props:**
- `jurisdiction`: string (e.g., "Idaho", "Utah")
- `rules`: string (e.g., "IRCP", "FRCP")
- `status`: 'active' | 'inactive'

### PageHeader

Consistent page headers with branding.

```typescript
import { PageHeader } from '@/components/autodiscovery';

<PageHeader 
  title="Discovery Requests"
  subtitle="Manage and track discovery compliance"
/>
```

**Props:**
- `title`: string
- `subtitle?`: Optional subtitle text

### CaseCard

Card component for displaying case summaries.

```typescript
import { CaseCard } from '@/components/autodiscovery';

<CaseCard 
  caseNumber="CV-2024-001234"
  title="Smith v. Jones"
  jurisdiction="Idaho"
  status="compliant"
/>
```

**Props:**
- `caseNumber`: string
- `title`: string
- `jurisdiction`: string
- `status`: 'compliant' | 'review' | 'non-compliant'

### LegalFooter

Footer with legal disclaimers and privacy information.

```typescript
import { LegalFooter } from '@/components/autodiscovery';

<LegalFooter />
```

---

## 🎯 Usage Guidelines

### When to Use Design Tokens

✅ **Always use design tokens for:**
- Colors (never hardcode hex values)
- Font families
- Spacing and margins
- Font sizes and weights

❌ **Don't:**
- Create one-off color values
- Use arbitrary spacing (stick to the scale)
- Mix different type scales

### Component Composition

Components are designed to work together:

```typescript
<PageHeader title="Case Dashboard" />

<div style={{ padding: spacing.lg }}>
  <CaseCard 
    caseNumber="CV-2024-001234"
    title="Smith v. Jones"
    jurisdiction="Idaho"
    status="compliant"
  />
  
  <ComplianceBadge status="compliant" />
  
  <BrandedButton variant="primary">
    View Details
  </BrandedButton>
</div>

<LegalFooter />
```

### Dark Mode Support

All components support dark mode through CSS custom properties. The design system automatically adapts when the `.dark` class is applied to a parent element.

---

## 🔧 Configuration

### Tailwind CSS Integration

The design tokens are integrated into Tailwind CSS configuration for easy use in utility classes:

```jsx
// Use in className
<div className="text-brand-deep-navy bg-brand-oracle-gold">
  Branded content
</div>
```

### TypeScript Support

All tokens export TypeScript types:

```typescript
import type { ColorToken, TypographyToken, SpacingToken } from '@/design-system/tokens';

// Use for type-safe component props
interface BrandedComponentProps {
  color: keyof ColorToken['primary'];
}
```

---

## ♿ Accessibility

All components follow WCAG 2.1 AA guidelines:

- **Color Contrast:** Minimum 4.5:1 for normal text
- **Keyboard Navigation:** All interactive elements are keyboard accessible
- **Screen Readers:** Proper ARIA labels and semantic HTML
- **Focus States:** Visible focus indicators on all interactive elements

---

## 📖 Further Reading

- [Brand Guidelines](../../docs/BRAND_GUIDELINES.md) — Complete brand identity documentation
- [Project Overview](../../docs/PROJECT_OVERVIEW.md) — Design philosophy and principles

---

**Questions?** Refer to [BRAND_GUIDELINES.md](../../docs/BRAND_GUIDELINES.md) for detailed usage instructions.

*AutoDiscovery — Build Once. Comply Everywhere.*
