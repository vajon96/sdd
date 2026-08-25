import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  QrCode,
  Award,
  CheckCircle2,
  Calendar,
  Building2,
  FileCheck,
  Printer,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Camera
} from 'lucide-react';
import { Certificate, VerificationResult, PublicCadet } from '../types';
import { verifyCertificateByNo, getCertificates } from '../data/storage';

interface CertificateVerificationDeskProps {
  initialCertNo?: string;
  onViewCadet?: (cadetNo: string) => void;
}

export const CertificateVerificationDesk: React.FC<CertificateVerificationDeskProps> = ({
  initialCertNo = '',
  onViewCadet
}) => {
  const [certInput, setCertInput] = useState<string>(initialCertNo);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [allCerts, setAllCerts] = useState<Certificate[]>([]);
  const [isScanningMode, setIsScanningMode] = useState<boolean>(false);

  useEffect(() => {
    setAllCerts(getCertificates());
    if (initialCertNo) {
      handleVerify(initialCertNo);
    }
  }, [initialCertNo]);

  const handleVerify = (codeToTest?: string) => {
    const query = codeToTest !== undefined ? codeToTest : certInput;
    if (!query.trim()) return;

    setIsSearching(true);
    setTimeout(() => {
      const res = verifyCertificateByNo(query);
      setResult(res);
      setIsSearching(false);
    }, 350);
  };

  const handleCopyHash = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const simulateCameraScan = (sampleCertNo: string) => {
    setIsScanningMode(true);
    setTimeout(() => {
      setIsScanningMode(false);
      setCertInput(sampleCertNo);
      handleVerify(sampleCertNo);
    }, 1200);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900/90 to-amber-950/60 border border-amber-400/30 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-wide uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Cryptographic Validation Protocol v2.5</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Institutional Certificate Verification Desk
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Verify official merit certificates, training credentials, and awards issued by Bangladesh National Cadet Corps (BNCC) Karnafuli Regiment & 5 BNCC Battalion.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => simulateCameraScan(allCerts[0]?.certificateNo || 'BNCC-2025-ATC-001')}
              disabled={isScanningMode}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold flex items-center gap-2 transition-all active:scale-95 shadow"
            >
              {isScanningMode ? (
                <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />
              ) : (
                <Camera className="w-4 h-4 text-amber-400" />
              )}
              <span>{isScanningMode ? 'Scanning Optical QR...' : 'Simulate QR Scan'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Input Search Form & Quick Samples */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleVerify();
          }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-amber-400/70 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              id="certificate-verify-input"
              type="text"
              value={certInput}
              onChange={(e) => setCertInput(e.target.value)}
              placeholder="Enter Certificate No (e.g., BNCC-2025-ATC-001 or SHA256 Hash)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:border-amber-400 focus:bg-white/[0.07] font-mono text-sm tracking-wide transition-all shadow-inner"
            />
          </div>

          <button
            id="certificate-verify-submit-button"
            type="submit"
            disabled={isSearching || !certInput.trim()}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-400/20 border border-amber-300/40 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            {isSearching ? (
              <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            )}
            <span>Verify Legitimacy</span>
          </button>
        </form>

        {/* Quick Sample Selector */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <span className="text-[11px] text-white/50 uppercase tracking-wider font-semibold block">
            Institutional Sample Certificates (Click to instantly verify):
          </span>
          <div className="flex flex-wrap gap-2">
            {allCerts.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setCertInput(c.certificateNo);
                  handleVerify(c.certificateNo);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono border transition-all ${
                  certInput === c.certificateNo
                    ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                    : 'bg-white/5 border-white/10 text-white/70 hover:border-amber-400/40 hover:text-white'
                }`}
              >
                {c.certificateNo}
                <span className="text-[10px] text-white/40 ml-1.5">({c.cadetName})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Verification Result Display */}
      {result && (
        <div className="animate-fadeIn">
          {result.valid && result.certificate ? (
            <div
              id="authentic-certificate-card"
              className="p-6 sm:p-10 rounded-3xl bg-slate-900 border-2 border-emerald-500/50 shadow-2xl relative overflow-hidden space-y-8"
            >
              {/* Authenticity Watermark Stamp */}
              <div className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-bold text-xs shadow-lg backdrop-blur-md">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>{result.statusText}</span>
              </div>

              {/* Certificate Header */}
              <div className="text-center space-y-3 pb-6 border-b border-white/10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-xl text-slate-950 mb-2">
                  <Award className="w-9 h-9 stroke-[2]" />
                </div>
                <h3 className="text-xs uppercase tracking-[0.25em] text-amber-400 font-bold">
                  {result.certificate.issuingOrganization}
                </h3>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {result.certificate.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  Official Verification ID: <span className="font-mono text-amber-300 font-bold">{result.certificate.certificateNo}</span>
                </p>
              </div>

              {/* Certificate Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                {/* Cadet Info Column */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                  <span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider block">
                    Awardee Cadet Dossier
                  </span>
                  
                  {result.cadet && (
                    <div className="flex items-center gap-3 pb-2 border-b border-white/10">
                      <img
                        src={result.cadet.photoUrl}
                        alt={result.cadet.fullName}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover border border-amber-400/40"
                      />
                      <div>
                        <div className="font-bold text-white text-sm">{result.cadet.fullName}</div>
                        <div className="text-xs text-amber-300 font-mono">Cadet No: {result.cadet.cadetNo}</div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-white/60">
                      <span>Full Name:</span>
                      <span className="text-white font-semibold">{result.certificate.cadetName}</span>
                    </div>
                    <div className="flex justify-between text-white/60">
                      <span>Cadet Number:</span>
                      <span className="text-white font-mono">{result.certificate.cadetNo}</span>
                    </div>
                    <div className="flex justify-between text-white/60">
                      <span>Rank:</span>
                      <span className="text-amber-300 font-semibold">{result.certificate.rank || 'Cadet'}</span>
                    </div>
                    <div className="flex justify-between text-white/60">
                      <span>Batch:</span>
                      <span className="text-white font-semibold">Batch {result.certificate.batch || '2025'}</span>
                    </div>
                  </div>
                </div>

                {/* Training & Grade Details */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                  <span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider block">
                    Curriculum & Performance
                  </span>
                  
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-white/50 block text-[10px]">Course Type</span>
                      <span className="font-semibold text-white">{result.certificate.type}</span>
                    </div>
                    <div>
                      <span className="text-white/50 block text-[10px]">Academic / Military Grade</span>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold inline-block mt-0.5">
                        {result.certificate.grade || 'A+ (Distinction)'}
                      </span>
                    </div>
                    <div>
                      <span className="text-white/50 block text-[10px]">Date of Issuance</span>
                      <span className="font-mono text-white">{result.certificate.issueDate}</span>
                    </div>
                  </div>
                </div>

                {/* Authority & Integrity Hash */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                  <span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider block">
                    Official Signatory & Seal
                  </span>
                  
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-white/50 block text-[10px]">Signing Authority</span>
                      <span className="font-semibold text-white">{result.certificate.signedBy}</span>
                    </div>
                    <div>
                      <span className="text-white/50 block text-[10px]">Platoon / Unit</span>
                      <span className="text-white">{result.certificate.platoon || "Cox's Bazar City College Platoon"}</span>
                    </div>
                    <div>
                      <span className="text-white/50 block text-[10px]">Security Integrity Signature</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono text-[10px] text-emerald-400 truncate">
                          {result.verificationHash}
                        </span>
                        <button
                          onClick={() => handleCopyHash(result.verificationHash || '')}
                          className="p-1 rounded bg-white/10 hover:bg-white/20 text-white/70 hover:text-white"
                          title="Copy hash"
                        >
                          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description / Citation */}
              {result.certificate.description && (
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-slate-200 italic leading-relaxed">
                  "{result.certificate.description}"
                </div>
              )}

              {/* Actions Footer */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Verified live against BNCC Central Platoon Relational Registry</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-400" />
                    <span>Print Verified Certificate</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-red-950/40 border-2 border-red-500/40 text-center space-y-4 backdrop-blur-xl">
              <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Certificate Verification Failed</h3>
              <p className="text-xs sm:text-sm text-red-200/80 max-w-md mx-auto">
                {result.message || 'No record exists for the provided verification code. Please check the spelling or contact the Platoon Commander.'}
              </p>
              <div className="text-xs font-mono text-white/40 pt-2">
                Query Attempt: {certInput} · Verified at {new Date().toLocaleTimeString()}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
