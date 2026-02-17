import { useState } from 'react';
import {
  Scale, ChevronDown, ChevronRight, Globe, Clock, AlertTriangle,
  ArrowLeftRight, BookOpen, X, Maximize2, Minimize2,
} from 'lucide-react';
import {
  jurisdictions,
  type Jurisdiction,
  type JurisdictionRule,
  type JurisdictionCode,
} from '@/providers/demoland/data/jurisdictions';

const categories: { key: JurisdictionRule['category']; label: string }[] = [
  { key: 'general', label: 'Scope & Planning' },
  { key: 'disclosure', label: 'Initial Disclosures' },
  { key: 'interrogatories', label: 'Interrogatories' },
  { key: 'rfp', label: 'Document Requests' },
  { key: 'rfa', label: 'Requests for Admission' },
  { key: 'depositions', label: 'Depositions' },
  { key: 'expert', label: 'Expert Discovery' },
  { key: 'esi', label: 'ESI / E-Discovery' },
  { key: 'privilege', label: 'Privilege' },
  { key: 'sanctions', label: 'Sanctions' },
];

function RuleBadge({ jurisdiction }: { jurisdiction: Jurisdiction }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
      style={{ backgroundColor: `${jurisdiction.color}15`, color: jurisdiction.color }}
    >
      {jurisdiction.ruleSetName}
    </span>
  );
}

function RuleCard({ rule, jurisdiction, isPrimary }: {
  rule: JurisdictionRule;
  jurisdiction: Jurisdiction;
  isPrimary?: boolean;
}) {
  return (
    <div className={`rounded-lg p-3 text-xs ${
      isPrimary
        ? 'ad-glass border border-ad-gold/20 ad-glow-gold'
        : 'bg-muted/50 border border-border/50'
    }`}>
      <div className="flex items-center gap-2 mb-1.5">
        <RuleBadge jurisdiction={jurisdiction} />
        <span className="font-mono text-muted-foreground">{rule.ruleNumber}</span>
        {isPrimary && (
          <span className="ml-auto text-[9px] uppercase tracking-wider text-ad-gold font-bold">Active</span>
        )}
      </div>
      <p className="text-foreground/90 leading-relaxed">{rule.summary}</p>
      <div className="flex flex-wrap gap-2 mt-2">
        {rule.deadline && (
          <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
            <Clock className="w-3 h-3" /> {rule.deadline}
          </span>
        )}
        {rule.keyDifference && (
          <span className="inline-flex items-center gap-1 text-[10px] text-amber-500">
            <AlertTriangle className="w-2.5 h-2.5" /> {rule.keyDifference}
          </span>
        )}
      </div>
    </div>
  );
}

interface JurisdictionPanelProps {
  primaryJurisdiction?: JurisdictionCode;
  onClose?: () => void;
}

export function JurisdictionPanel({ primaryJurisdiction = 'ID', onClose }: JurisdictionPanelProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('interrogatories');
  const [compareWith, setCompareWith] = useState<JurisdictionCode[]>(['WA', 'UT']);
  const [expanded, setExpanded] = useState(false);

  const primary = jurisdictions[primaryJurisdiction];
  const availableJurisdictions = Object.keys(jurisdictions).filter(
    (k) => k !== primaryJurisdiction,
  ) as JurisdictionCode[];

  const toggleCompare = (code: JurisdictionCode) => {
    setCompareWith((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
  };

  return (
    <div
      className={`flex flex-col bg-card border-l border-border h-full transition-all duration-300 ${
        expanded ? 'w-[480px]' : 'w-[340px]'
      }`}
    >
      {/* Panel Header */}
      <div className="p-4 border-b border-border shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-ad-gold/10">
              <Scale className="w-4 h-4 text-ad-gold" />
            </div>
            <h3 className="text-sm font-bold tracking-tight">Jurisdiction Rules</h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              {expanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Primary Jurisdiction */}
        <div className="flex items-center gap-2 mb-3">
          <Globe className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Primary:</span>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `${primary.color}20`, color: primary.color }}
          >
            {primary.name} — {primary.ruleSetName}
          </span>
        </div>

        {/* Compare With Selector */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <ArrowLeftRight className="w-3 h-3 text-muted-foreground" />
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Compare with</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {availableJurisdictions.map((code) => {
              const j = jurisdictions[code];
              const isActive = compareWith.includes(code);
              return (
                <button
                  key={code}
                  onClick={() => toggleCompare(code)}
                  className={`text-[10px] font-bold px-2 py-1 rounded-full transition-all ${
                    isActive
                      ? 'ring-1 ring-offset-1 ring-offset-background'
                      : 'opacity-40 hover:opacity-70'
                  }`}
                  style={{
                    backgroundColor: `${j.color}${isActive ? '25' : '10'}`,
                    color: j.color,
                    ...(isActive ? { ringColor: j.color } : {}),
                  }}
                >
                  {j.code} — {j.ruleSetName}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Rules List */}
      <div className="flex-1 overflow-y-auto ad-scrollbar p-3 space-y-1">
        {categories.map((cat) => {
          const primaryRule = primary.rules.find((r) => r.category === cat.key);
          const comparisonRules = compareWith
            .map((code) => ({
              jurisdiction: jurisdictions[code],
              rule: jurisdictions[code].rules.find((r) => r.category === cat.key),
            }))
            .filter((c) => c.rule) as { jurisdiction: Jurisdiction; rule: JurisdictionRule }[];

          if (!primaryRule && comparisonRules.length === 0) return null;

          const isExpanded = expandedCategory === cat.key;
          const hasDifferences = comparisonRules.some((c) => c.rule.keyDifference);

          return (
            <div key={cat.key} className="rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedCategory(isExpanded ? null : cat.key)}
                className={`w-full flex items-center gap-2 px-3 py-2.5 text-left transition-colors ${
                  isExpanded ? 'bg-accent' : 'hover:bg-muted/50'
                }`}
              >
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                )}
                <BookOpen className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span className="text-xs font-semibold flex-1">{cat.label}</span>
                {hasDifferences && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" title="Has jurisdictional differences" />
                )}
                <span className="text-[10px] text-muted-foreground">
                  {(primaryRule ? 1 : 0) + comparisonRules.length}
                </span>
              </button>

              {isExpanded && (
                <div className="px-3 pb-3 space-y-2 ad-animate-fade-up">
                  {/* Primary Rule */}
                  {primaryRule && (
                    <RuleCard rule={primaryRule} jurisdiction={primary} isPrimary />
                  )}

                  {/* Comparison Rules */}
                  {comparisonRules.map((c) => (
                    <RuleCard key={c.jurisdiction.code} rule={c.rule} jurisdiction={c.jurisdiction} />
                  ))}

                  {/* Quick Comparison Table (when expanded panel) */}
                  {expanded && primaryRule && comparisonRules.length > 0 && (
                    <div className="mt-2 rounded-lg border border-border overflow-hidden">
                      <table className="w-full text-[10px]">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="text-left p-2 font-medium text-muted-foreground">Jurisdiction</th>
                            <th className="text-left p-2 font-medium text-muted-foreground">Deadline</th>
                            <th className="text-left p-2 font-medium text-muted-foreground">Key Diff</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-t border-border/50">
                            <td className="p-2 font-bold" style={{ color: primary.color }}>{primary.code}</td>
                            <td className="p-2">{primaryRule.deadline || '—'}</td>
                            <td className="p-2 text-muted-foreground">Baseline</td>
                          </tr>
                          {comparisonRules.map((c) => (
                            <tr key={c.jurisdiction.code} className="border-t border-border/50">
                              <td className="p-2 font-bold" style={{ color: c.jurisdiction.color }}>
                                {c.jurisdiction.code}
                              </td>
                              <td className="p-2">{c.rule.deadline || '—'}</td>
                              <td className="p-2 text-amber-500">{c.rule.keyDifference || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Panel Footer */}
      <div className="p-3 border-t border-border shrink-0">
        <p className="text-[10px] text-muted-foreground text-center">
          Comparative data for demonstration only — verify with current statutes
        </p>
      </div>
    </div>
  );
}
