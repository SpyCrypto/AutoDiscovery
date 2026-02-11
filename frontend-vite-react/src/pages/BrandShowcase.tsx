import React from 'react';
import {
  BrandedButton,
  ComplianceBadge,
  JurisdictionBanner,
  PageHeader,
  CaseCard,
  LegalFooter,
} from '@/components/autodiscovery';

/**
 * Brand Showcase Page
 * Demonstrates all branded components with the AutoDiscovery design system
 */
export default function BrandShowcase() {
  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <PageHeader
        title="AutoDiscovery Brand Showcase"
        subtitle="Demonstrating the complete branded component library"
      />

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        {/* Buttons Section */}
        <section>
          <h2 className="text-2xl font-serif font-bold mb-4" style={{ fontFamily: '"IBM Plex Serif", Georgia, serif' }}>
            Branded Buttons
          </h2>
          <div className="flex gap-4 flex-wrap">
            <BrandedButton variant="primary" size="sm">Small Primary</BrandedButton>
            <BrandedButton variant="primary" size="md">Medium Primary</BrandedButton>
            <BrandedButton variant="primary" size="lg">Large Primary</BrandedButton>
          </div>
          <div className="flex gap-4 flex-wrap mt-4">
            <BrandedButton variant="secondary" size="md">Secondary Button</BrandedButton>
            <BrandedButton variant="outline" size="md">Outline Button</BrandedButton>
            <BrandedButton variant="primary" size="md" disabled>Disabled Button</BrandedButton>
          </div>
        </section>

        {/* Compliance Badges Section */}
        <section>
          <h2 className="text-2xl font-serif font-bold mb-4" style={{ fontFamily: '"IBM Plex Serif", Georgia, serif' }}>
            Compliance Badges
          </h2>
          <div className="flex gap-4 flex-wrap">
            <ComplianceBadge status="compliant" />
            <ComplianceBadge status="review" />
            <ComplianceBadge status="non-compliant" />
            <ComplianceBadge status="compliant" label="Idaho IRCP Compliant" />
          </div>
        </section>

        {/* Jurisdiction Banners Section */}
        <section>
          <h2 className="text-2xl font-serif font-bold mb-4" style={{ fontFamily: '"IBM Plex Serif", Georgia, serif' }}>
            Jurisdiction Banners
          </h2>
          <div className="space-y-4">
            <JurisdictionBanner jurisdiction="Idaho" rules="IRCP" status="active" />
            <JurisdictionBanner jurisdiction="Utah" rules="URCP" status="inactive" />
            <JurisdictionBanner jurisdiction="Federal" rules="FRCP" status="active" />
          </div>
        </section>

        {/* Case Cards Section */}
        <section>
          <h2 className="text-2xl font-serif font-bold mb-4" style={{ fontFamily: '"IBM Plex Serif", Georgia, serif' }}>
            Case Cards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CaseCard
              caseNumber="CV-2024-001234"
              title="Smith v. Jones"
              jurisdiction="Idaho"
              status="compliant"
              onClick={() => console.log('Clicked case 1')}
            />
            <CaseCard
              caseNumber="CV-2024-005678"
              title="Doe v. Corporation Inc."
              jurisdiction="Utah"
              status="review"
              onClick={() => console.log('Clicked case 2')}
            />
            <CaseCard
              caseNumber="CV-2024-009999"
              title="United States v. Defendant"
              jurisdiction="Federal - District of Idaho"
              status="non-compliant"
              onClick={() => console.log('Clicked case 3')}
            />
          </div>
        </section>

        {/* Design Tokens Display */}
        <section>
          <h2 className="text-2xl font-serif font-bold mb-4" style={{ fontFamily: '"IBM Plex Serif", Georgia, serif' }}>
            Design Tokens
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Colors */}
            <div>
              <h3 className="font-semibold mb-3">Primary Colors</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded" style={{ backgroundColor: '#1A2B4A' }}></div>
                  <div className="text-sm">
                    <div className="font-medium">Deep Navy</div>
                    <div className="text-gray-500">#1A2B4A</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded" style={{ backgroundColor: '#2E5C8A' }}></div>
                  <div className="text-sm">
                    <div className="font-medium">Legal Blue</div>
                    <div className="text-gray-500">#2E5C8A</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded" style={{ backgroundColor: '#D4AF37' }}></div>
                  <div className="text-sm">
                    <div className="font-medium">Oracle Gold</div>
                    <div className="text-gray-500">#D4AF37</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Typography */}
            <div>
              <h3 className="font-semibold mb-3">Typography</h3>
              <div className="space-y-2 text-sm">
                <div style={{ fontFamily: '"IBM Plex Serif", Georgia, serif' }}>
                  IBM Plex Serif (Headings)
                </div>
                <div style={{ fontFamily: '"Inter", -apple-system, sans-serif' }}>
                  Inter (Body & UI)
                </div>
                <div style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                  JetBrains Mono (Code)
                </div>
              </div>
            </div>

            {/* Spacing */}
            <div>
              <h3 className="font-semibold mb-3">Spacing Scale</h3>
              <div className="space-y-1 text-sm">
                <div>xs: 4px</div>
                <div>sm: 8px</div>
                <div>md: 16px</div>
                <div>lg: 24px</div>
                <div>xl: 32px</div>
                <div>2xl: 48px</div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <LegalFooter />
    </div>
  );
}
