import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Users, Star, ArrowLeft, GripVertical, Baby, Scale,
  Phone, Building2, Hash, Sparkles, Shield,
  Gavel, Eye, UserCircle, AlertTriangle, Send,
} from 'lucide-react';
import { useProviders } from '@/providers/context';
import type { Case, CaseContact, ContactRole } from '@/providers/types';
import { EmailSafetyDialog } from '@/components/email-safety-dialog';

// ── Role display config ──
const roleLabels: Partial<Record<ContactRole, string>> = {
  lead_attorney: 'Lead Attorney',
  associate: 'Associate',
  paralegal: 'Paralegal',
  legal_secretary: 'Legal Secretary',
  expert_witness: 'Expert Witness',
  fact_witness: 'Fact Witness',
  victim: 'Victim / Plaintiff',
  plaintiff: 'Plaintiff',
  defendant: 'Defendant',
  judge: 'Judge',
  magistrate: 'Magistrate',
  mediator: 'Mediator',
  opposing_counsel: 'Opposing Counsel',
  opposing_associate: 'Associate',
  opposing_paralegal: 'Paralegal',
  custodian: 'Record Custodian',
  court_reporter: 'Court Reporter',
  process_server: 'Process Server',
  insurance_adjuster: 'Insurance',
  law_enforcement: 'Law Enforcement',
  other: 'Other',
};

const roleIcons: Partial<Record<ContactRole, typeof Users>> = {
  judge: Gavel,
  victim: Shield,
  expert_witness: Eye,
  lead_attorney: Scale,
  opposing_counsel: Scale,
};

// ── Star Rating Component ──
function StarRating({
  stars,
  onChange,
}: {
  stars: 0 | 1 | 2 | 3;
  onChange?: (s: 0 | 1 | 2 | 3) => void;
}) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3].map((n) => (
        <button
          key={n}
          onClick={(e) => {
            e.stopPropagation();
            if (onChange) {
              onChange((stars === n ? n - 1 : n) as 0 | 1 | 2 | 3);
            }
          }}
          className="p-0.5 transition-all hover:scale-125"
          title={`${n} star${n > 1 ? 's' : ''} precedence`}
        >
          <Star
            className={`w-3.5 h-3.5 transition-colors ${
              n <= stars
                ? 'fill-ad-gold text-ad-gold'
                : 'text-muted-foreground/30'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

// ── Contact Card ──
function ContactCard({
  contact,
  onStarChange,
  hoveredId,
  onHover,
  connectedIds,
  onDragStart,
  onDragOver,
  onDrop,
  onEmail,
}: {
  contact: CaseContact;
  onStarChange: (id: string, stars: 0 | 1 | 2 | 3) => void;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  connectedIds: Set<string>;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, id: string) => void;
  onEmail: (contact: CaseContact) => void;
}) {
  const isGlowing = hoveredId !== null && hoveredId !== contact.id && connectedIds.has(contact.id);
  const isHovered = hoveredId === contact.id;
  const Icon = roleIcons[contact.role] || UserCircle;

  const teamBorder = contact.team === 'our_team'
    ? 'border-emerald-500/20'
    : contact.team === 'opposing_team'
    ? 'border-red-500/20'
    : contact.team === 'court'
    ? 'border-ad-gold/20'
    : 'border-border';

  const glowClass = isGlowing
    ? contact.team === 'our_team'
      ? 'ring-2 ring-emerald-400/50 shadow-lg shadow-emerald-500/20'
      : contact.team === 'opposing_team'
      ? 'ring-2 ring-red-400/50 shadow-lg shadow-red-500/20'
      : 'ring-2 ring-ad-gold/50 shadow-lg shadow-ad-gold/20'
    : '';

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, contact.id)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, contact.id)}
      onMouseEnter={() => onHover(contact.id)}
      onMouseLeave={() => onHover(null)}
      className={`
        group bg-card border ${teamBorder} rounded-xl p-4 transition-all duration-300 cursor-grab active:cursor-grabbing
        ${isHovered ? 'border-white/70 shadow-md shadow-white/5' : ''}
        ${glowClass}
        ${isGlowing ? 'scale-[1.02]' : ''}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Drag Handle */}
        <div className="pt-1 opacity-0 group-hover:opacity-40 transition-opacity">
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </div>

        {/* Avatar */}
        <div className={`
          w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold
          ${contact.team === 'our_team' ? 'bg-emerald-500/10 text-emerald-500' : ''}
          ${contact.team === 'opposing_team' ? 'bg-red-500/10 text-red-400' : ''}
          ${contact.team === 'court' ? 'bg-ad-gold/10 text-ad-gold' : ''}
          ${contact.team === 'neutral' ? 'bg-blue-500/10 text-blue-400' : ''}
        `}>
          <Icon className="w-5 h-5" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-sm truncate">{contact.name}</h4>
            <StarRating
              stars={contact.stars}
              onChange={(s) => onStarChange(contact.id, s)}
            />
          </div>

          {/* Role badge */}
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className={`
              text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md
              ${contact.team === 'our_team' ? 'bg-emerald-500/10 text-emerald-500' : ''}
              ${contact.team === 'opposing_team' ? 'bg-red-500/10 text-red-400' : ''}
              ${contact.team === 'court' ? 'bg-ad-gold/10 text-ad-gold' : ''}
              ${contact.team === 'neutral' ? 'bg-blue-500/10 text-blue-400' : ''}
            `}>
              {roleLabels[contact.role] || contact.role}
            </span>

            {/* Newbie indicator */}
            {contact.isFirstYearAssociate && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400">
                <Baby className="w-3 h-3" />
                1st Year
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-muted-foreground mt-1.5">{contact.description}</p>

          {/* Contact details (visible on hover) */}
          <div className="mt-2 space-y-1 max-h-0 group-hover:max-h-40 overflow-hidden transition-all duration-300">
            {contact.firm && (
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Building2 className="w-3 h-3" /> {contact.firm}
              </div>
            )}
            {contact.email && (
              <button
                onClick={(e) => { e.stopPropagation(); onEmail(contact); }}
                className={`flex items-center gap-1.5 text-[11px] transition-colors rounded-md px-1.5 py-0.5 -ml-1.5 ${
                  contact.team === 'opposing_team' || contact.team === 'court'
                    ? 'text-amber-400 hover:bg-amber-500/10 hover:text-amber-300'
                    : 'text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-400'
                }`}
                title={contact.team !== 'our_team' ? '⚠ External recipient — safety checks will apply' : 'Compose email'}
              >
                <Send className="w-3 h-3" /> {contact.email}
                {(contact.team === 'opposing_team' || contact.team === 'court') && (
                  <AlertTriangle className="w-3 h-3 ml-0.5" />
                )}
              </button>
            )}
            {contact.phone && (
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Phone className="w-3 h-3" /> {contact.phone}
              </div>
            )}
            {contact.barNumber && (
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Hash className="w-3 h-3" /> {contact.barNumber}
              </div>
            )}
            {contact.notes && (
              <p className="text-[11px] text-muted-foreground/70 italic mt-1">
                {contact.notes}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Team Section ──
function TeamSection({
  title,
  subtitle,
  contacts,
  accentColor,
  onStarChange,
  hoveredId,
  onHover,
  allContacts,
  onDragStart,
  onDragOver,
  onDrop,
  onEmail,
}: {
  title: string;
  subtitle: string;
  contacts: CaseContact[];
  accentColor: 'emerald' | 'red' | 'gold' | 'blue';
  onStarChange: (id: string, stars: 0 | 1 | 2 | 3) => void;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  allContacts: CaseContact[];
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, id: string) => void;
  onEmail: (contact: CaseContact) => void;
}) {
  const colorMap = {
    emerald: {
      header: 'from-emerald-500/15 to-emerald-600/5',
      border: 'border-emerald-500/20',
      text: 'text-emerald-500',
      dot: 'bg-emerald-500',
    },
    red: {
      header: 'from-red-500/15 to-red-600/5',
      border: 'border-red-500/20',
      text: 'text-red-400',
      dot: 'bg-red-400',
    },
    gold: {
      header: 'from-amber-500/15 to-amber-600/5',
      border: 'border-ad-gold/20',
      text: 'text-ad-gold',
      dot: 'bg-ad-gold',
    },
    blue: {
      header: 'from-blue-500/15 to-blue-600/5',
      border: 'border-blue-500/20',
      text: 'text-blue-400',
      dot: 'bg-blue-400',
    },
  };
  const c = colorMap[accentColor];

  // Build connected IDs for the currently hovered contact
  const hoveredContact = hoveredId ? allContacts.find((ct) => ct.id === hoveredId) : null;
  const connectedIds = new Set(hoveredContact?.connectedContactIds || []);

  const newbieCount = contacts.filter((ct) => ct.isFirstYearAssociate).length;

  return (
    <div className={`border ${c.border} rounded-2xl overflow-hidden`}>
      {/* Section Header */}
      <div className={`bg-gradient-to-r ${c.header} px-5 py-3.5 border-b ${c.border}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-2 h-2 rounded-full ${c.dot}`} />
            <h3 className={`font-bold text-sm ${c.text}`}>{title}</h3>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
            <span>{contacts.length} contacts</span>
            {newbieCount > 0 && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 font-bold">
                <Baby className="w-3 h-3" /> {newbieCount} newbie{newbieCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>
      </div>

      {/* Contact Cards */}
      <div className="p-3 space-y-2">
        {contacts.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-6">No contacts in this section</p>
        ) : (
          contacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onStarChange={onStarChange}
              hoveredId={hoveredId}
              onHover={onHover}
              connectedIds={connectedIds}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
              onEmail={onEmail}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ── Main Page Component ──
export function CaseContacts() {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const { cases, contacts: contactsProvider } = useProviders();

  const [caseData, setCaseData] = useState<Case | null>(null);
  const [allContacts, setAllContacts] = useState<CaseContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [emailTarget, setEmailTarget] = useState<CaseContact | null>(null);

  useEffect(() => {
    async function load() {
      if (!caseId) return;
      setLoading(true);
      try {
        const [c, cts] = await Promise.all([
          cases.getCase(caseId),
          contactsProvider.getContactsByCaseId(caseId),
        ]);
        setCaseData(c);
        setAllContacts(cts);
      } catch {
        setCaseData(null);
      }
      setLoading(false);
    }
    load();
  }, [caseId, cases, contactsProvider]);

  const handleStarChange = useCallback(async (contactId: string, stars: 0 | 1 | 2 | 3) => {
    const updated = await contactsProvider.updateContactStars(contactId, stars);
    setAllContacts((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  }, [contactsProvider]);

  const handleDragStart = useCallback((e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;

    setAllContacts((prev) => {
      const dragged = prev.find((c) => c.id === draggedId);
      const target = prev.find((c) => c.id === targetId);
      if (!dragged || !target || dragged.team !== target.team) return prev;

      const teamContacts = prev.filter((c) => c.team === dragged.team && c.caseId === dragged.caseId);
      const dragIdx = teamContacts.findIndex((c) => c.id === draggedId);
      const targetIdx = teamContacts.findIndex((c) => c.id === targetId);

      teamContacts.splice(dragIdx, 1);
      teamContacts.splice(targetIdx, 0, dragged);

      const reordered = teamContacts.map((c, i) => ({ ...c, sortOrder: i }));

      return prev.map((c) => {
        const updated = reordered.find((r) => r.id === c.id);
        return updated || c;
      });
    });

    setDraggedId(null);
  }, [draggedId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Users className="w-5 h-5 text-ad-gold animate-pulse" />
          <span className="text-sm">Loading contacts...</span>
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <AlertTriangle className="w-8 h-8 text-amber-500 mb-3" />
        <h2 className="text-lg font-bold">Case Not Found</h2>
        <p className="text-muted-foreground text-sm mt-1">The requested case could not be loaded.</p>
      </div>
    );
  }

  const ourTeam = allContacts.filter((c) => c.team === 'our_team').sort((a, b) => a.sortOrder - b.sortOrder);
  const opposingTeam = allContacts.filter((c) => c.team === 'opposing_team').sort((a, b) => a.sortOrder - b.sortOrder);
  const courtContacts = allContacts.filter((c) => c.team === 'court').sort((a, b) => a.sortOrder - b.sortOrder);
  const neutralContacts = allContacts.filter((c) => c.team === 'neutral').sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate(`/cases/${caseId}`)}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-ad-gold transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Case
        </button>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-ad-gold" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-ad-gold font-bold">Case Contacts</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{caseData.title}</h1>
        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
          <span className="font-mono bg-muted px-2 py-0.5 rounded-md">{caseData.caseNumber}</span>
          <span>{caseData.jurisdiction}</span>
          <span>{allContacts.length} total contacts</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-[10px] text-muted-foreground flex-wrap">
        <span className="inline-flex items-center gap-1.5">
          <Star className="w-3 h-3 fill-ad-gold text-ad-gold" /> Star = precedence (click to change)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <GripVertical className="w-3 h-3" /> Drag to reorder within team
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Baby className="w-3 h-3 text-purple-400" /> 1st year associate
        </span>
        <span>Hover to see connected contacts glow</span>
      </div>

      {/* Two-Column: Our Team vs Opposing Team */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TeamSection
          title="Our Team & Contacts"
          subtitle="Plaintiff's counsel, staff, client, and retained experts"
          contacts={ourTeam}
          accentColor="emerald"
          onStarChange={handleStarChange}
          hoveredId={hoveredId}
          onHover={setHoveredId}
          allContacts={allContacts}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onEmail={setEmailTarget}
        />

        <TeamSection
          title="Opposing Counsel's Team & Contacts"
          subtitle="Defense counsel, staff, defendants, and their experts"
          contacts={opposingTeam}
          accentColor="red"
          onStarChange={handleStarChange}
          hoveredId={hoveredId}
          onHover={setHoveredId}
          allContacts={allContacts}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onEmail={setEmailTarget}
        />
      </div>

      {/* Court & Neutral — below the main split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TeamSection
          title="The Court"
          subtitle="Judicial officers and court staff"
          contacts={courtContacts}
          accentColor="gold"
          onStarChange={handleStarChange}
          hoveredId={hoveredId}
          onHover={setHoveredId}
          allContacts={allContacts}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onEmail={setEmailTarget}
        />

        {neutralContacts.length > 0 && (
          <TeamSection
            title="Neutral / Third Parties"
            subtitle="Custodians, insurers, and other non-aligned parties"
            contacts={neutralContacts}
            accentColor="blue"
            onStarChange={handleStarChange}
            hoveredId={hoveredId}
            onHover={setHoveredId}
            allContacts={allContacts}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onEmail={setEmailTarget}
          />
        )}
      </div>

      {/* Email Safety Dialog */}
      {emailTarget && caseId && (
        <EmailSafetyDialog
          caseId={caseId}
          prefilledTo={emailTarget}
          onClose={() => setEmailTarget(null)}
        />
      )}
    </div>
  );
}
