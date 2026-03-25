import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, FileText, Filter, X, CheckCircle2, Link2, Shield,
  AlertTriangle, Sparkles, ChevronDown,
} from 'lucide-react';
import { useProviders, useAuth } from '@/providers/context';
import { useVitalsLogger, useVitalsInteraction } from '@/vitals';
import type { Document, DocumentCategory, ProtectiveOrderTier, SearchFilters } from '@/providers/types';

const categoryOptions: { value: DocumentCategory; label: string }[] = [
  { value: 'pleading', label: 'Pleading' },
  { value: 'motion', label: 'Motion' },
  { value: 'order', label: 'Order' },
  { value: 'medical_record', label: 'Medical Record' },
  { value: 'financial_record', label: 'Financial Record' },
  { value: 'communication', label: 'Communication' },
  { value: 'expert_report', label: 'Expert Report' },
  { value: 'deposition', label: 'Deposition' },
  { value: 'court_transcript', label: 'Court Transcript' },
  { value: 'insurance', label: 'Insurance' },
];

const protectiveOrderOptions: { value: ProtectiveOrderTier; label: string }[] = [
  { value: 'none', label: 'Unrestricted' },
  { value: 'confidential', label: 'Confidential' },
  { value: 'aeo', label: "Attorney's Eyes Only" },
  { value: 'sealed', label: 'Sealed' },
];

function ProtectiveOrderBadge({ tier }: { tier: ProtectiveOrderTier }) {
  if (tier === 'none') return null;
  const styles: Record<string, string> = {
    confidential: 'bg-amber-500/10 text-amber-600',
    aeo: 'bg-red-500/10 text-red-600',
    sealed: 'bg-red-600/20 text-red-700 dark:text-red-400',
  };
  return (
    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${styles[tier]}`}>
      {tier}
    </span>
  );
}

export function SearchPage() {
  const { documents, cases } = useProviders();
  const navigate = useNavigate();
  const { session } = useAuth();
  const vitals = useVitalsLogger();
  const track = useVitalsInteraction();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Document[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [userCaseIds, setUserCaseIds] = useState<string[]>([]);
  const [casesLoaded, setCasesLoaded] = useState(false);

  useEffect(() => {
    async function loadUserCases() {
      try {
        const myCases = await cases.listCases();
        setUserCaseIds(myCases.map((c) => c.id));
      } catch {
        setUserCaseIds([]);
      } finally {
        setCasesLoaded(true);
      }
    }
    if (session) loadUserCases();
    else setCasesLoaded(true);
  }, [session, cases]);

  // Filter state
  const [filterCategory, setFilterCategory] = useState<DocumentCategory | ''>('');
  const [filterProtective, setFilterProtective] = useState<ProtectiveOrderTier | ''>('');
  const [filterOriginator, setFilterOriginator] = useState('');

  const handleSearch = async () => {
    if (!query.trim() || !casesLoaded) return;
    setLoading(true);
    setSearched(true);

    const filters: SearchFilters = {};
    if (userCaseIds.length > 0) filters.allowedCaseIds = userCaseIds;
    if (filterCategory) filters.category = filterCategory;
    if (filterProtective) filters.protectiveOrder = filterProtective;
    if (filterOriginator) filters.originator = filterOriginator;

    const activeFilterCount = Object.keys(filters).length;
    vitals.action(`Searching for "${query}"${activeFilterCount > 0 ? ` with ${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} applied` : ''}.`);

    const result = await documents.searchDocuments(query, activeFilterCount > 0 ? filters : undefined);
    setResults(result.documents);
    setTotalCount(result.totalCount);
    vitals.success(`Search complete. Found ${result.totalCount} document${result.totalCount !== 1 ? 's' : ''} matching "${query}".`);
    setLoading(false);
  };

  const clearFilters = () => {
    vitals.action('Cleared all search filters.');
    setFilterCategory('');
    setFilterProtective('');
    setFilterOriginator('');
  };

  const hasActiveFilters = filterCategory || filterProtective || filterOriginator;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-ad-gold" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-ad-gold font-bold">Discovery Intelligence</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Document Search</h1>
        <p className="text-muted-foreground text-sm mt-1">Search across all case documents with AI-powered synopsis matching</p>
      </div>

      {/* Search Bar */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onMouseEnter={track.hover('Search: Query input')}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search documents, entities, synopses..."
              className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ad-gold/40 focus:border-ad-gold/30 transition-all"
            />
          </div>
          <button
            onMouseEnter={track.hover('Search: Filters toggle')}
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all flex items-center gap-2 ${
              showFilters || hasActiveFilters
                ? 'bg-ad-gold/10 border-ad-gold/30 text-ad-gold'
                : 'bg-card border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-ad-gold" />
            )}
          </button>
          <button
            onMouseEnter={track.hover('Search: Execute button')}
            onClick={handleSearch}
            disabled={loading || !query.trim() || !casesLoaded}
            className="px-6 py-3 ad-gradient-gold text-amber-950 rounded-xl font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-card border border-border rounded-xl p-4 ad-animate-fade-up">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Filters</span>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-xs text-ad-gold hover:underline flex items-center gap-1">
                  <X className="w-3 h-3" /> Clear All
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Category</label>
                <div className="relative">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value as DocumentCategory | '')}
                    className="w-full appearance-none bg-muted/50 border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-ad-gold/40"
                  >
                    <option value="">All Categories</option>
                    {categoryOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Protection Level</label>
                <div className="relative">
                  <select
                    value={filterProtective}
                    onChange={(e) => setFilterProtective(e.target.value as ProtectiveOrderTier | '')}
                    className="w-full appearance-none bg-muted/50 border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-ad-gold/40"
                  >
                    <option value="">All Levels</option>
                    {protectiveOrderOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1 block">Originator</label>
                <input
                  type="text"
                  value={filterOriginator}
                  onChange={(e) => setFilterOriginator(e.target.value)}
                  placeholder="Filter by originator..."
                  className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-ad-gold/40"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {searched && !loading && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{totalCount} result{totalCount !== 1 ? 's' : ''}</span>
            <span>for &ldquo;{query}&rdquo;</span>
            {hasActiveFilters && <span className="text-ad-gold">with filters applied</span>}
          </div>

          {results.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <Search className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No documents match your search.</p>
              <p className="text-xs text-muted-foreground mt-1">Try different keywords or adjust your filters.</p>
            </div>
          ) : (
            results.map((doc) => (
              <button
                key={doc.id}
                onMouseEnter={track.hover(`Search Result: ${doc.title}`)}
                onClick={() => navigate(`/cases/${doc.caseId}`)}
                className="w-full text-left bg-card border border-border rounded-xl p-4 hover:border-ad-gold/30 hover:shadow-lg hover:shadow-ad-gold/5 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${
                        categoryColorMap[doc.category] || 'bg-muted text-muted-foreground'
                      }`}>
                        {doc.category.replace(/_/g, ' ')}
                      </span>
                      <ProtectiveOrderBadge tier={doc.protectiveOrder} />
                      {doc.hasTwin && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-sky-500/10 text-sky-600 dark:text-sky-400">
                          <Link2 className="w-3 h-3" /> Twin
                        </span>
                      )}
                      {doc.verified && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-600">
                          <CheckCircle2 className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </div>
                    <h4 className="font-medium text-sm group-hover:text-ad-gold transition-colors">{doc.title}</h4>
                    {doc.aiSynopsis && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{doc.aiSynopsis}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span><FileText className="w-3 h-3 inline" /> {doc.pageCount} pages</span>
                      <span>From: {doc.originator}</span>
                      {doc.batesStart && <span>Bates: {doc.batesStart}–{doc.batesEnd}</span>}
                    </div>
                    {doc.entities && doc.entities.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {doc.entities.slice(0, 6).map((e, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded text-[10px] bg-muted text-muted-foreground">
                            {e}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {doc.productionId && (
                      <span className="flex items-center gap-1 text-[10px] text-amber-500">
                        <AlertTriangle className="w-3 h-3" /> Flagged
                      </span>
                    )}
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Shield className="w-3 h-3" />
                      <span className="font-mono">{doc.contentHash.slice(0, 12)}...</span>
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}

      {/* Initial State */}
      {!searched && (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-ad-gold/10 mb-4 ad-glow-gold">
            <Search className="w-8 h-8 text-ad-gold" />
          </div>
          <h3 className="font-bold text-lg mb-2">Search All Documents</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Search across all cases using keywords, entity names, or natural language. 
            AI-powered synopsis matching finds relevant documents even when exact terms don't appear.
          </p>
          <div className="flex items-center justify-center gap-4 mt-4 text-[10px] text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Sparkles className="w-3 h-3 text-ad-gold" /> AI Synopsis Search</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            <span className="inline-flex items-center gap-1"><Shield className="w-3 h-3 text-emerald-500" /> Hash Verified</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            <span className="inline-flex items-center gap-1"><Link2 className="w-3 h-3 text-sky-500" /> Twin Bond Tracking</span>
          </div>
        </div>
      )}
    </div>
  );
}

const categoryColorMap: Record<string, string> = {
  pleading: 'bg-blue-500/10 text-blue-600',
  motion: 'bg-indigo-500/10 text-indigo-600',
  order: 'bg-purple-500/10 text-purple-600',
  medical_record: 'bg-rose-500/10 text-rose-600',
  financial_record: 'bg-amber-500/10 text-amber-600',
  communication: 'bg-cyan-500/10 text-cyan-600',
  expert_report: 'bg-emerald-500/10 text-emerald-600',
  deposition: 'bg-orange-500/10 text-orange-600',
  court_transcript: 'bg-violet-500/10 text-violet-600',
  insurance: 'bg-teal-500/10 text-teal-600',
};
