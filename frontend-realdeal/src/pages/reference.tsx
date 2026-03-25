import { BookOpen } from 'lucide-react';
import { JurisdictionPanel } from '@/components/jurisdiction-panel';

export function ReferencePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-6 h-6 text-ad-gold" />
          <h1 className="text-2xl font-bold tracking-tight">Jurisdiction Reference</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Global reference for jurisdiction-specific discovery rules. This registry applies across all cases
          and reflects the governing procedural rules for each jurisdiction — it is not case-specific context.
        </p>
      </div>

      <div className="w-full">
        <JurisdictionPanel primaryJurisdiction="ID" />
      </div>
    </div>
  );
}
