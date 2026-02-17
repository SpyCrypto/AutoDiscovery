import { useState, useCallback, useRef } from 'react';
import {
  Mail, AlertTriangle, ShieldAlert, Shield, ShieldCheck,
  Paperclip, X, Eye, Users, CheckCircle2, XCircle,
  FileWarning, ImageIcon, FileText, Send, Clock, Lock,
} from 'lucide-react';
import { useProviders } from '@/providers/context';
import type {
  EmailRecipientCheck,
  EmailAttachment,
  EmailThreatLevel,
  TandemApproval,
  CaseContact,
} from '@/providers/types';

// ── Threat Level Config ──
const threatConfig: Record<EmailThreatLevel, {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: typeof Shield;
  description: string;
}> = {
  safe: {
    label: 'SAFE',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    icon: ShieldCheck,
    description: 'All recipients are on our team. Standard send protocols.',
  },
  caution: {
    label: 'CAUTION',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    icon: Shield,
    description: 'External recipients detected. Review content before sending.',
  },
  danger: {
    label: 'DANGER',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    icon: ShieldAlert,
    description: 'Opposing counsel or party detected. Attachment review required. Tandem approval recommended.',
  },
  critical: {
    label: 'CRITICAL',
    color: 'text-red-500',
    bgColor: 'bg-red-600/15',
    borderColor: 'border-red-600/40',
    icon: AlertTriangle,
    description: 'JUDICIAL OFFICER detected. This may constitute ex parte communication. Tandem approval REQUIRED.',
  },
};

// ── Recipient Badge ──
function RecipientBadge({ recipient }: { recipient: EmailRecipientCheck }) {
  const config = threatConfig[recipient.threatLevel];
  const Icon = config.icon;

  return (
    <div className={`${config.bgColor} border ${config.borderColor} rounded-lg p-3 space-y-1.5`}>
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${config.color} shrink-0`} />
        <span className="font-semibold text-sm">{recipient.name}</span>
        <span className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${config.bgColor} ${config.color}`}>
          {config.label}
        </span>
      </div>
      <p className="text-[11px] text-muted-foreground leading-relaxed">{recipient.warningMessage}</p>
      <p className="text-[10px] text-muted-foreground/60 font-mono">{recipient.email}</p>
    </div>
  );
}

// ── Attachment Card ──
function AttachmentCard({
  attachment,
  onRemove,
  showPreview,
  onTogglePreview,
}: {
  attachment: EmailAttachment;
  onRemove: () => void;
  showPreview: boolean;
  onTogglePreview: () => void;
}) {
  const hasWarnings = (attachment.metadataWarnings?.length || 0) > 0;
  const isImage = attachment.previewUrl !== undefined;
  const sizeLabel = attachment.fileSize > 1024 * 1024
    ? `${(attachment.fileSize / 1024 / 1024).toFixed(1)} MB`
    : `${(attachment.fileSize / 1024).toFixed(0)} KB`;

  return (
    <div className={`border rounded-lg overflow-hidden ${hasWarnings ? 'border-amber-500/30 bg-amber-500/5' : 'border-border bg-card'}`}>
      <div className="flex items-center gap-3 p-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${hasWarnings ? 'bg-amber-500/10' : 'bg-muted'}`}>
          {isImage ? (
            <ImageIcon className={`w-4 h-4 ${hasWarnings ? 'text-amber-400' : 'text-muted-foreground'}`} />
          ) : (
            <FileText className={`w-4 h-4 ${hasWarnings ? 'text-amber-400' : 'text-muted-foreground'}`} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{attachment.fileName}</p>
          <p className="text-[10px] text-muted-foreground">{sizeLabel} · {attachment.mimeType}</p>
        </div>
        <div className="flex items-center gap-1">
          {hasWarnings && (
            <FileWarning className="w-4 h-4 text-amber-400" />
          )}
          {isImage && (
            <button onClick={onTogglePreview} className="p-1.5 hover:bg-muted rounded-md transition-colors" title="Preview">
              <Eye className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          )}
          <button onClick={onRemove} className="p-1.5 hover:bg-red-500/10 rounded-md transition-colors" title="Remove">
            <X className="w-3.5 h-3.5 text-red-400" />
          </button>
        </div>
      </div>

      {/* Metadata warnings */}
      {hasWarnings && (
        <div className="px-3 pb-2 space-y-1">
          {attachment.metadataWarnings!.map((w, i) => (
            <p key={i} className="text-[10px] text-amber-400/80 leading-relaxed">⚠ {w}</p>
          ))}
        </div>
      )}

      {/* Image preview */}
      {showPreview && attachment.previewUrl && (
        <div className="border-t border-border p-3 bg-black/20">
          <p className="text-[10px] text-muted-foreground mb-2 font-bold uppercase tracking-wide">Attachment Preview — Verify before sending</p>
          <img
            src={attachment.previewUrl}
            alt={`Preview of ${attachment.fileName}`}
            className="max-h-48 rounded-lg border border-border object-contain mx-auto"
          />
        </div>
      )}
    </div>
  );
}

// ── Tandem Approval Panel ──
function TandemApprovalPanel({
  approval,
  onCancel,
}: {
  approval: TandemApproval | null;
  onCancel: () => void;
}) {
  if (!approval) return null;

  return (
    <div className="border border-purple-500/30 bg-purple-500/5 rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-purple-400" />
        <span className="font-bold text-sm text-purple-400">Tandem Approval Required</span>
        <span className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${
          approval.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' :
          approval.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
          'bg-purple-500/10 text-purple-400'
        }`}>
          {approval.status}
        </span>
      </div>

      <p className="text-[11px] text-muted-foreground">
        {approval.requiredApprovers} set{approval.requiredApprovers > 1 ? 's' : ''} of eyes must sign off before this email can be sent.
      </p>

      {/* Approver list */}
      <div className="space-y-1.5">
        {approval.approvers.map((a, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            {a.status === 'approved' ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : a.status === 'rejected' ? (
              <XCircle className="w-3.5 h-3.5 text-red-400" />
            ) : (
              <Clock className="w-3.5 h-3.5 text-muted-foreground animate-pulse" />
            )}
            <span className={a.status === 'approved' ? 'text-emerald-400' : a.status === 'rejected' ? 'text-red-400' : 'text-muted-foreground'}>
              {a.name}
            </span>
            {a.comment && <span className="text-[10px] text-muted-foreground/50 italic">— {a.comment}</span>}
          </div>
        ))}

        {/* Pending slots */}
        {Array.from({ length: Math.max(0, approval.requiredApprovers - approval.approvers.length) }).map((_, i) => (
          <div key={`pending-${i}`} className="flex items-center gap-2 text-xs text-muted-foreground/40">
            <Clock className="w-3.5 h-3.5" />
            <span>Awaiting approver...</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 pt-1">
        <Lock className="w-3 h-3 text-muted-foreground/40" />
        <span className="text-[10px] text-muted-foreground/40">
          Expires {new Date(approval.expiresAt).toLocaleString()}
        </span>
      </div>

      {approval.status === 'awaiting' && (
        <button
          onClick={onCancel}
          className="text-[11px] text-red-400 hover:text-red-300 transition-colors"
        >
          Cancel approval request
        </button>
      )}
    </div>
  );
}

// ── Main Email Safety Dialog ──
export function EmailSafetyDialog({
  caseId,
  prefilledTo,
  onClose,
}: {
  caseId: string;
  prefilledTo?: CaseContact;
  onClose: () => void;
}) {
  const { emailSafety } = useProviders();

  const [toInput, setToInput] = useState(prefilledTo?.email || '');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [recipients, setRecipients] = useState<EmailRecipientCheck[]>([]);
  const [attachments, setAttachments] = useState<EmailAttachment[]>([]);
  const [previewIds, setPreviewIds] = useState<Set<string>>(new Set());
  const [tandemApproval, setTandemApproval] = useState<TandemApproval | null>(null);
  const [checking, setChecking] = useState(false);
  const [overallThreat, setOverallThreat] = useState<EmailThreatLevel>('safe');
  const [step, setStep] = useState<'compose' | 'review' | 'approval'>('compose');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check recipients
  const checkRecipients = useCallback(async () => {
    if (!toInput.trim()) return;
    setChecking(true);
    const emails = toInput.split(/[,;\s]+/).filter(Boolean);
    const checks = await emailSafety.checkRecipients(caseId, emails);
    setRecipients(checks);
    const threat = emailSafety.calculateThreatLevel(checks, attachments);
    setOverallThreat(threat);
    setChecking(false);
  }, [toInput, caseId, emailSafety, attachments]);

  // Handle file attachments
  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const scanned = await emailSafety.scanAttachments(Array.from(files));
    setAttachments((prev) => [...prev, ...scanned]);
    // Recalculate threat
    const threat = emailSafety.calculateThreatLevel(recipients, [...attachments, ...scanned]);
    setOverallThreat(threat);
  }, [emailSafety, recipients, attachments]);

  const removeAttachment = useCallback((id: string) => {
    setAttachments((prev) => {
      const next = prev.filter((a) => a.id !== id);
      setOverallThreat(emailSafety.calculateThreatLevel(recipients, next));
      return next;
    });
  }, [emailSafety, recipients]);

  const togglePreview = useCallback((id: string) => {
    setPreviewIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // Move to review step
  const goToReview = useCallback(async () => {
    await checkRecipients();
    setStep('review');
  }, [checkRecipients]);

  // Request tandem approval
  const requestTandemApproval = useCallback(async (requiredApprovers: number) => {
    const approval = await emailSafety.createTandemApproval(`draft-${Date.now()}`, requiredApprovers);
    setTandemApproval(approval);
    setStep('approval');
  }, [emailSafety]);

  const config = threatConfig[overallThreat];
  const ThreatIcon = config.icon;
  const needsTandem = overallThreat === 'critical' || (overallThreat === 'danger' && attachments.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card border ${config.borderColor} rounded-2xl shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`${config.bgColor} border-b ${config.borderColor} px-5 py-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Mail className={`w-5 h-5 ${config.color}`} />
              <h2 className="font-bold text-lg">Compose Email</h2>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${config.bgColor} ${config.color} border ${config.borderColor}`}>
                {config.label}
              </span>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className={`text-[11px] mt-1 ${config.color}`}>{config.description}</p>
        </div>

        <div className="p-5 space-y-4">
          {step === 'compose' && (
            <>
              {/* To field */}
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1 block">To</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={toInput}
                    onChange={(e) => setToInput(e.target.value)}
                    onBlur={checkRecipients}
                    placeholder="email@example.com (separate multiple with commas)"
                    className="flex-1 bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ad-gold/30"
                  />
                  <button
                    onClick={checkRecipients}
                    disabled={checking}
                    className="px-3 py-2 bg-ad-gold/10 text-ad-gold text-xs font-bold rounded-lg hover:bg-ad-gold/20 transition-colors disabled:opacity-50"
                  >
                    {checking ? 'Checking...' : 'Check'}
                  </button>
                </div>
              </div>

              {/* Recipient warnings */}
              {recipients.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Recipient Safety Check</p>
                  {recipients.map((r) => (
                    <RecipientBadge key={r.email} recipient={r} />
                  ))}
                </div>
              )}

              {/* Subject */}
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1 block">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Re: Case communication"
                  className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ad-gold/30"
                />
              </div>

              {/* Body */}
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1 block">Message</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Compose your message..."
                  rows={6}
                  className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ad-gold/30 resize-y"
                />
              </div>

              {/* Attachments */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Attachments</label>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-lg text-xs transition-colors"
                  >
                    <Paperclip className="w-3.5 h-3.5" /> Add Files
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                  />
                </div>

                {attachments.length > 0 && (
                  <div className="space-y-2">
                    {attachments.map((a) => (
                      <AttachmentCard
                        key={a.id}
                        attachment={a}
                        onRemove={() => removeAttachment(a.id)}
                        showPreview={previewIds.has(a.id)}
                        onTogglePreview={() => togglePreview(a.id)}
                      />
                    ))}
                  </div>
                )}

                {attachments.length === 0 && (
                  <p className="text-[11px] text-muted-foreground/50 text-center py-3 border border-dashed border-border rounded-lg">
                    No attachments. Drag files here or click "Add Files."
                  </p>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center gap-2">
                  <ThreatIcon className={`w-4 h-4 ${config.color}`} />
                  <span className={`text-xs font-bold ${config.color}`}>
                    Threat Level: {config.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={goToReview}
                    disabled={!toInput.trim() || !subject.trim()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-ad-gold/10 text-ad-gold text-xs font-bold rounded-lg hover:bg-ad-gold/20 transition-colors disabled:opacity-40"
                  >
                    <Eye className="w-3.5 h-3.5" /> Review & Send
                  </button>
                </div>
              </div>
            </>
          )}

          {step === 'review' && (
            <>
              {/* Overall threat banner */}
              <div className={`${config.bgColor} border ${config.borderColor} rounded-xl p-4`}>
                <div className="flex items-center gap-3">
                  <ThreatIcon className={`w-8 h-8 ${config.color}`} />
                  <div>
                    <h3 className={`font-bold ${config.color}`}>Pre-Send Safety Review — {config.label}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{config.description}</p>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-muted/30 rounded-lg p-3">
                  <p className="text-lg font-bold">{recipients.length}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">Recipients</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-3">
                  <p className="text-lg font-bold">{attachments.length}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">Attachments</p>
                </div>
                <div className={`${config.bgColor} rounded-lg p-3`}>
                  <p className={`text-lg font-bold ${config.color}`}>{config.label}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">Threat Level</p>
                </div>
              </div>

              {/* Recipient list */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Recipient Verification</p>
                {recipients.map((r) => (
                  <RecipientBadge key={r.email} recipient={r} />
                ))}
              </div>

              {/* Attachment review */}
              {attachments.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Attachment Review — Double Check</p>
                  {attachments.map((a) => (
                    <AttachmentCard
                      key={a.id}
                      attachment={a}
                      onRemove={() => removeAttachment(a.id)}
                      showPreview={previewIds.has(a.id)}
                      onTogglePreview={() => togglePreview(a.id)}
                    />
                  ))}
                </div>
              )}

              {/* Tandem approval requirement */}
              {needsTandem && (
                <div className="border border-purple-500/30 bg-purple-500/5 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-purple-400" />
                    <span className="font-bold text-sm text-purple-400">Tandem Approval Required</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mb-3">
                    {overallThreat === 'critical'
                      ? 'Emails to judicial officers REQUIRE tandem approval. This protects against accidental ex parte communication.'
                      : 'Sending attachments to opposing counsel requires at least one additional set of eyes.'}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => requestTandemApproval(overallThreat === 'critical' ? 2 : 1)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 text-purple-400 text-xs font-bold rounded-lg hover:bg-purple-500/20 transition-colors"
                    >
                      <Users className="w-3.5 h-3.5" />
                      Request {overallThreat === 'critical' ? '2' : '1'} Approval{overallThreat === 'critical' ? 's' : ''}
                    </button>
                  </div>
                </div>
              )}

              {/* Send / Back buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <button
                  onClick={() => setStep('compose')}
                  className="px-4 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Back to Compose
                </button>
                <div className="flex items-center gap-2">
                  {needsTandem ? (
                    <span className="text-[10px] text-muted-foreground">Send locked — tandem approval required above</span>
                  ) : (
                    <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-lg hover:bg-emerald-500/20 transition-colors">
                      <Send className="w-3.5 h-3.5" /> Send Email
                    </button>
                  )}
                </div>
              </div>
            </>
          )}

          {step === 'approval' && (
            <>
              <TandemApprovalPanel
                approval={tandemApproval}
                onCancel={() => {
                  setTandemApproval(null);
                  setStep('review');
                }}
              />

              {tandemApproval?.status === 'approved' && (
                <div className="flex justify-end pt-2">
                  <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-lg hover:bg-emerald-500/20 transition-colors">
                    <Send className="w-3.5 h-3.5" /> Send Approved Email
                  </button>
                </div>
              )}

              {tandemApproval?.status === 'awaiting' && (
                <p className="text-[11px] text-muted-foreground text-center py-4">
                  Waiting for approvals... Email will be sendable once all required approvers sign off.
                </p>
              )}

              <div className="flex justify-start pt-2">
                <button
                  onClick={() => setStep('review')}
                  className="px-4 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Back to Review
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
