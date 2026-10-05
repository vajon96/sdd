import React, { useState } from 'react';
import { Award, ShieldCheck, X, QrCode, Printer, CheckCircle2, Sparkles, Building2 } from 'lucide-react';
import { Cadet, Certificate, CertificateType } from '../types';

interface CertificateStudioModalProps {
  cadets: Cadet[];
  isOpen: boolean;
  onClose: () => void;
  onIssueCertificate: (cert: Certificate) => void;
}

const CERT_TYPES: CertificateType[] = [
  'Annual Training Camp (ATC)',
  'Basic Military Training',
  'National Day Parade',
  'Leadership & Drill',
  'First Aid & Disaster Management',
  'Shooting / Firing Excellence',
  'Youth Exchange Program (YEP)',
  'Special Recognition'
];

export const CertificateStudioModal: React.FC<CertificateStudioModalProps> = ({
  cadets,
  isOpen,
  onClose,
  onIssueCertificate
}) => {
  const [selectedCadetId, setSelectedCadetId] = useState<string>(cadets[0]?.id || '');
  const cadet = cadets.find((c) => c.id === selectedCadetId);

  const [title, setTitle] = useState<string>('Annual Training Camp (ATC) Certificate of Merit');
  const [certType, setCertType] = useState<CertificateType>('Annual Training Camp (ATC)');
  const [certNo, setCertNo] = useState<string>(
    `BNCC-${new Date().getFullYear()}-ATC-${Math.floor(100 + Math.random() * 900)}`
  );
  const [issuingOrg, setIssuingOrg] = useState<string>('15 BNCC Battalion, Karnafuli Regiment, BNCC');
  const [signedBy, setSignedBy] = useState<string>('Lt. Colonel M. Rahman, Regiment Commander');
  const [grade, setGrade] = useState<string>('A+ (Distinction)');
  const [description, setDescription] = useState<string>(
    'Awarded for exceptional leadership in drill formation, weapon handling, and military theory.'
  );
  const [issueDate, setIssueDate] = useState<string>(new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cadet) return;

    const hash = 'SHA256-' + Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();

    const newCert: Certificate = {
      id: 'cert-' + Date.now(),
      certificateNo: certNo,
      title,
      type: certType,
      cadetId: cadet.id,
      cadetName: cadet.fullName,
      cadetNo: cadet.cadetNo,
      batch: cadet.batch,
      rank: cadet.rank,
      platoon: cadet.platoon || "Cox's Bazar City College Platoon",
      issueDate,
      issuingOrganization: issuingOrg,
      signedBy,
      grade,
      description,
      verificationHash: hash,
      qrPayload: `https://cbccbncc.netlify.app/verify/certificate/${certNo}`,
      createdAt: new Date().toISOString()
    };

    onIssueCertificate(newCert);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900 border border-amber-400/40 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 my-8">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-amber-950/60 via-slate-900 to-emerald-950/40 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Military Certificate Generation Studio</h2>
              <p className="text-xs text-white/50">Issue Official Cryptographically Verifiable BNCC Certificates</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
          {/* Select Cadet */}
          <div className="space-y-1">
            <label className="text-white/70 font-semibold block text-xs uppercase tracking-wider">
              Recipent Cadet:
            </label>
            <select
              value={selectedCadetId}
              onChange={(e) => setSelectedCadetId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-white focus:outline-none focus:border-amber-400"
            >
              {cadets.map((c) => (
                <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                  {c.fullName} ({c.cadetNo}) — Rank: {c.rank} (Batch {c.batch})
                </option>
              ))}
            </select>
          </div>

          {/* Certificate Title & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-white/70 font-semibold block text-xs">Certificate Title:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-white/70 font-semibold block text-xs">Curriculum Type:</label>
              <select
                value={certType}
                onChange={(e) => setCertType(e.target.value as CertificateType)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-white focus:outline-none focus:border-amber-400"
              >
                {CERT_TYPES.map((t) => (
                  <option key={t} value={t} className="bg-slate-900 text-white">
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Unique Cert No & Grade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-white/70 font-semibold block text-xs">Verification Number (Unique ID):</label>
              <input
                type="text"
                value={certNo}
                onChange={(e) => setCertNo(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-white/70 font-semibold block text-xs">Evaluation Grade:</label>
              <input
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-emerald-400 font-semibold focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Issuing Org & Signatory */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-white/70 font-semibold block text-xs">Issuing Authority / Unit:</label>
              <input
                type="text"
                value={issuingOrg}
                onChange={(e) => setIssuingOrg(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-white focus:outline-none focus:border-amber-400 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-white/70 font-semibold block text-xs">Signing Commander:</label>
              <input
                type="text"
                value={signedBy}
                onChange={(e) => setSignedBy(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-white focus:outline-none focus:border-amber-400 text-xs"
              />
            </div>
          </div>

          {/* Issue Date & Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-white/70 font-semibold block text-xs">Date of Issuance:</label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-white/70 font-semibold block text-xs">Citation / Commendation Text:</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-white text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Live Preview Pill */}
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>This certificate will be instantly verifiable in the Public Portal using ID <strong className="font-mono">{certNo}</strong></span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-semibold text-xs"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-400/20"
            >
              Issue & Register Certificate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
