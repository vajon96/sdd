import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Upload,
  User,
  Shield,
  GraduationCap,
  Phone,
  Heart,
  Image as ImageIcon
} from 'lucide-react';
import {
  Cadet,
  BatchYear,
  CadetRank,
  CadetStatus,
  BloodGroup,
  Gender
} from '../types';

interface CadetFormModalProps {
  cadetToEdit: Cadet | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (cadetData: Cadet) => void;
}

export const CadetFormModal: React.FC<CadetFormModalProps> = ({
  cadetToEdit,
  isOpen,
  onClose,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'academic' | 'bncc' | 'contact'>('personal');

  // Form State
  const [formData, setFormData] = useState<Partial<Cadet>>({
    cadetNo: '',
    exCadetNo: '',
    firstName: '',
    middleName: '',
    lastName: '',
    fullName: '',
    photoUrl: '',
    gender: 'Male',
    bloodGroup: 'B+',
    dob: '',
    nidOrBirthCert: '',
    nationality: 'Bangladeshi',
    fatherName: '',
    motherName: '',
    guardianName: '',
    guardianMobile: '',
    institution: "Cox's Bazar City College",
    facultyOrGroup: 'Science',
    classLevel: 'HSC 1st Year',
    session: '2024-2025',
    batch: '2025',
    rank: 'Cadet',
    regiment: 'Karnafuli Regiment',
    battalion: '5 BNCC Battalion',
    company: 'Alpha Company',
    platoon: 'City College Platoon',
    enrollmentDate: new Date().toLocaleDateString('en-GB'),
    status: 'Active',
    mobile: '',
    email: '',
    division: 'Chattogram',
    district: "Cox's Bazar",
    upazila: "Cox's Bazar Sadar",
    city: "Cox's Bazar",
    address: '',
    bio: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (cadetToEdit) {
      setFormData(cadetToEdit);
    } else {
      // Auto-generate realistic Cadet No for new cadet
      const randomNo = '2515' + Math.floor(4300 + Math.random() * 900);
      setFormData({
        cadetNo: randomNo,
        exCadetNo: '',
        firstName: '',
        middleName: '',
        lastName: '',
        fullName: '',
        photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
        gender: 'Male',
        bloodGroup: 'B+',
        dob: '15/05/2007',
        nidOrBirthCert: '',
        nationality: 'Bangladeshi',
        fatherName: '',
        motherName: '',
        guardianName: '',
        guardianMobile: '',
        institution: "Cox's Bazar City College",
        facultyOrGroup: 'Science',
        classLevel: 'HSC 1st Year',
        session: '2024-2025',
        batch: '2025',
        rank: 'Cadet',
        regiment: 'Karnafuli Regiment',
        battalion: '5 BNCC Battalion',
        company: 'Alpha Company',
        platoon: 'City College Platoon',
        enrollmentDate: new Date().toLocaleDateString('en-GB'),
        status: 'Active',
        mobile: '',
        email: '',
        division: 'Chattogram',
        district: "Cox's Bazar",
        upazila: "Cox's Bazar Sadar",
        city: "Cox's Bazar",
        address: "Cox's Bazar Sadar",
        bio: ''
      });
    }
    setErrors({});
  }, [cadetToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: keyof Cadet, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto update fullName if individual names are changed
      if (field === 'firstName' || field === 'middleName' || field === 'lastName') {
        const parts = [
          field === 'firstName' ? value : prev.firstName,
          field === 'middleName' ? value : prev.middleName,
          field === 'lastName' ? value : prev.lastName
        ].filter(Boolean);
        if (parts.length > 0) {
          updated.fullName = parts.join(' ');
        }
      }
      return updated;
    });

    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Handle image upload from file or URL
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          handleChange('photoUrl', uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.cadetNo?.trim()) errs.cadetNo = 'Cadet Number is required';
    if (!formData.fullName?.trim() && !formData.firstName?.trim()) {
      errs.fullName = 'Cadet Full Name is required';
    }
    if (!formData.mobile?.trim()) errs.mobile = 'Mobile Number is required';
    if (!formData.institution?.trim()) errs.institution = 'Institution is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const finalFullName =
      formData.fullName?.trim() ||
      [formData.firstName, formData.middleName, formData.lastName].filter(Boolean).join(' ') ||
      'Cadet';

    const finalCadet: Cadet = {
      id: cadetToEdit ? cadetToEdit.id : 'cadet-' + (formData.cadetNo || Date.now()),
      cadetNo: formData.cadetNo || '',
      exCadetNo: formData.exCadetNo || '',
      firstName: formData.firstName || finalFullName.split(' ')[0] || '',
      middleName: formData.middleName || '',
      lastName: formData.lastName || finalFullName.split(' ').slice(1).join(' ') || '',
      fullName: finalFullName,
      photoUrl:
        formData.photoUrl ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
      gender: (formData.gender as Gender) || 'Male',
      bloodGroup: (formData.bloodGroup as BloodGroup) || 'O+',
      dob: formData.dob || '01/01/2006',
      nidOrBirthCert: formData.nidOrBirthCert || '',
      nationality: formData.nationality || 'Bangladeshi',
      fatherName: formData.fatherName || '',
      motherName: formData.motherName || '',
      guardianName: formData.guardianName || '',
      guardianMobile: formData.guardianMobile || '',
      institution: formData.institution || "Cox's Bazar City College",
      facultyOrGroup: formData.facultyOrGroup || 'Science',
      classLevel: formData.classLevel || 'HSC 1st Year',
      session: formData.session || '2024-2025',
      batch: (formData.batch as BatchYear) || '2025',
      rank: (formData.rank as CadetRank) || 'Cadet',
      regiment: formData.regiment || 'Karnafuli Regiment',
      battalion: formData.battalion || '5 BNCC Battalion',
      company: formData.company || 'Alpha Company',
      platoon: formData.platoon || 'City College Platoon',
      enrollmentDate: formData.enrollmentDate || new Date().toLocaleDateString('en-GB'),
      status: (formData.status as CadetStatus) || 'Active',
      mobile: formData.mobile || '',
      email: formData.email || '',
      division: formData.division || 'Chattogram',
      district: formData.district || "Cox's Bazar",
      upazila: formData.upazila || "Cox's Bazar Sadar",
      city: formData.city || "Cox's Bazar",
      address: formData.address || '',
      bio: formData.bio || '',
      achievements: cadetToEdit?.achievements || ['Enrolled BNCC Cadet'],
      createdAt: cadetToEdit?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(finalCadet);
    onClose();
  };

  return (
    <div
      id="cadet-form-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <div
        id="cadet-form-modal-container"
        className="w-full max-w-3xl max-h-[92vh] bg-slate-900/95 border border-white/15 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-white my-auto"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center font-bold">
              +
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {cadetToEdit ? 'Edit Cadet Record' : 'Enroll New BNCC Cadet'}
              </h2>
              <p className="text-xs text-white/50">Official Bangladesh National Cadet Corps Registration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 border-b border-white/10 bg-white/[0.01] text-xs font-semibold overflow-x-auto">
          {[
            { id: 'personal', label: '1. Personal & Photo', icon: User },
            { id: 'academic', label: '2. Academic & Family', icon: GraduationCap },
            { id: 'bncc', label: '3. BNCC Corps Placement', icon: Shield },
            { id: 'contact', label: '4. Contact & Address', icon: Phone }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-amber-400 text-amber-300 bg-amber-400/5'
                    : 'border-transparent text-white/60 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Tab 1: Personal Details & Photo */}
          {activeTab === 'personal' && (
            <div className="space-y-4">
              {/* Photo selector */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row items-center gap-4">
                <img
                  src={
                    formData.photoUrl ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80'
                  }
                  alt="Preview"
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-xl object-cover border-2 border-amber-400/40"
                />
                <div className="flex-1 space-y-2 text-xs w-full">
                  <label className="block font-semibold text-white/80">Cadet Photograph URL or Upload</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formData.photoUrl || ''}
                      onChange={(e) => handleChange('photoUrl', e.target.value)}
                      placeholder="Paste image URL (https://...)"
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400"
                    />
                    <label className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-semibold cursor-pointer flex items-center gap-1.5 shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                  <p className="text-[11px] text-white/40">Upload JPG/PNG or provide an external image URL.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-white/70 mb-1 font-medium">Cadet Number *</label>
                  <input
                    type="text"
                    value={formData.cadetNo || ''}
                    onChange={(e) => handleChange('cadetNo', e.target.value)}
                    placeholder="e.g. 25154364"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 font-mono font-bold text-amber-300 focus:outline-none focus:border-amber-400"
                  />
                  {errors.cadetNo && <span className="text-red-400 text-[10px] mt-0.5">{errors.cadetNo}</span>}
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-medium">Full Name *</label>
                  <input
                    type="text"
                    value={formData.fullName || ''}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    placeholder="e.g. Jannatul Adon"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 font-semibold text-white focus:outline-none focus:border-amber-400"
                  />
                  {errors.fullName && <span className="text-red-400 text-[10px] mt-0.5">{errors.fullName}</span>}
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-medium">Gender</label>
                  <select
                    value={formData.gender || 'Male'}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-medium">Blood Group</label>
                  <select
                    value={formData.bloodGroup || 'B+'}
                    onChange={(e) => handleChange('bloodGroup', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-red-300 font-bold focus:outline-none focus:border-amber-400"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-medium">Date of Birth (DD/MM/YYYY)</label>
                  <input
                    type="text"
                    value={formData.dob || ''}
                    onChange={(e) => handleChange('dob', e.target.value)}
                    placeholder="25/04/2008"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-medium">NID / Birth Certificate No.</label>
                  <input
                    type="text"
                    value={formData.nidOrBirthCert || ''}
                    onChange={(e) => handleChange('nidOrBirthCert', e.target.value)}
                    placeholder="2008221543640001"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 font-mono text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Academic & Family */}
          {activeTab === 'academic' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-white/70 mb-1 font-medium">College / Institution *</label>
                  <input
                    type="text"
                    value={formData.institution || ''}
                    onChange={(e) => handleChange('institution', e.target.value)}
                    placeholder="Cox's Bazar City College"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white font-semibold focus:outline-none focus:border-amber-400"
                  />
                  {errors.institution && (
                    <span className="text-red-400 text-[10px] mt-0.5">{errors.institution}</span>
                  )}
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-medium">Academic Class / Level</label>
                  <input
                    type="text"
                    value={formData.classLevel || ''}
                    onChange={(e) => handleChange('classLevel', e.target.value)}
                    placeholder="HSC 1st Year / Degree 2nd Year"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-medium">Group / Faculty</label>
                  <input
                    type="text"
                    value={formData.facultyOrGroup || ''}
                    onChange={(e) => handleChange('facultyOrGroup', e.target.value)}
                    placeholder="Science / Business Studies / Humanities"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-medium">Academic Session</label>
                  <input
                    type="text"
                    value={formData.session || ''}
                    onChange={(e) => handleChange('session', e.target.value)}
                    placeholder="2024-2025"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-medium">Father's Name</label>
                  <input
                    type="text"
                    value={formData.fatherName || ''}
                    onChange={(e) => handleChange('fatherName', e.target.value)}
                    placeholder="Father's full name"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-medium">Mother's Name</label>
                  <input
                    type="text"
                    value={formData.motherName || ''}
                    onChange={(e) => handleChange('motherName', e.target.value)}
                    placeholder="Mother's full name"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-medium">Guardian Emergency Phone</label>
                  <input
                    type="text"
                    value={formData.guardianMobile || ''}
                    onChange={(e) => handleChange('guardianMobile', e.target.value)}
                    placeholder="018XXXXXXXX"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: BNCC Placement */}
          {activeTab === 'bncc' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 mb-1 font-medium">Batch Year</label>
                  <select
                    value={formData.batch || '2025'}
                    onChange={(e) => handleChange('batch', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 font-bold text-amber-300 focus:outline-none focus:border-amber-400"
                  >
                    <option value="2023">Batch 2023</option>
                    <option value="2024">Batch 2024</option>
                    <option value="2025">Batch 2025</option>
                    <option value="2026">Batch 2026</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-medium">Corps Rank</label>
                  <select
                    value={formData.rank || 'Cadet'}
                    onChange={(e) => handleChange('rank', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white font-medium focus:outline-none focus:border-amber-400"
                  >
                    <option value="Cadet">Cadet</option>
                    <option value="Lance Corporal">Lance Corporal</option>
                    <option value="Corporal">Corporal</option>
                    <option value="Sergeant">Sergeant</option>
                    <option value="Cadet Under Officer (CUO)">Cadet Under Officer (CUO)</option>
                    <option value="Senior Under Officer (SUO)">Senior Under Officer (SUO)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-medium">Regiment</label>
                  <input
                    type="text"
                    value={formData.regiment || ''}
                    onChange={(e) => handleChange('regiment', e.target.value)}
                    placeholder="Karnafuli Regiment"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-medium">Battalion</label>
                  <input
                    type="text"
                    value={formData.battalion || ''}
                    onChange={(e) => handleChange('battalion', e.target.value)}
                    placeholder="5 BNCC Battalion"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-medium">Company & Platoon</label>
                  <input
                    type="text"
                    value={formData.platoon || ''}
                    onChange={(e) => handleChange('platoon', e.target.value)}
                    placeholder="City College Platoon"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-medium">Cadet Status</label>
                  <select
                    value={formData.status || 'Active'}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-emerald-400 font-bold focus:outline-none focus:border-amber-400"
                  >
                    <option value="Active">Active</option>
                    <option value="Ex Cadet">Ex Cadet</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Alumni">Alumni</option>
                    <option value="Probation">Probation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-medium">Ex-Cadet Number (Optional)</label>
                  <input
                    type="text"
                    value={formData.exCadetNo || ''}
                    onChange={(e) => handleChange('exCadetNo', e.target.value)}
                    placeholder="e.g. 22154351"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-medium">Enrollment Date</label>
                  <input
                    type="text"
                    value={formData.enrollmentDate || ''}
                    onChange={(e) => handleChange('enrollmentDate', e.target.value)}
                    placeholder="12/01/2025"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Contact & Address */}
          {activeTab === 'contact' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 mb-1 font-medium">Cadet Mobile Phone *</label>
                  <input
                    type="text"
                    value={formData.mobile || ''}
                    onChange={(e) => handleChange('mobile', e.target.value)}
                    placeholder="018XXXXXXXX"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                  {errors.mobile && <span className="text-red-400 text-[10px] mt-0.5">{errors.mobile}</span>}
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-medium">Email Address</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="cadet@gmail.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-medium">Division</label>
                  <input
                    type="text"
                    value={formData.division || ''}
                    onChange={(e) => handleChange('division', e.target.value)}
                    placeholder="Chattogram"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-medium">District</label>
                  <input
                    type="text"
                    value={formData.district || ''}
                    onChange={(e) => handleChange('district', e.target.value)}
                    placeholder="Cox's Bazar"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-medium">Upazila / Thana</label>
                  <input
                    type="text"
                    value={formData.upazila || ''}
                    onChange={(e) => handleChange('upazila', e.target.value)}
                    placeholder="Cox's Bazar Sadar / Ramu / Chakaria"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1 font-medium">City / Area</label>
                  <input
                    type="text"
                    value={formData.city || ''}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="Cox's Bazar"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-white/70 mb-1 font-medium">Detailed Street Address</label>
                  <input
                    type="text"
                    value={formData.address || ''}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="House/Street, Ward, Post Office"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-white/70 mb-1 font-medium">Cadet Bio / Notes</label>
                  <textarea
                    rows={2}
                    value={formData.bio || ''}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    placeholder="Special skills, leadership traits, military drill interests..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Form Actions Footer */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-400/20 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{cadetToEdit ? 'Update Cadet Record' : 'Save & Register Cadet'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
