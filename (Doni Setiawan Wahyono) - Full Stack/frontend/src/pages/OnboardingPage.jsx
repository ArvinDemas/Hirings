import { useState, useEffect } from "react";
import { 
  Bell, 
  ChevronRight, 
  Home, 
  User, 
  UserPlus, 
  Target, 
  Star, 
  Upload, 
  Edit3, 
  CheckCircle2,
  X,
  Plus,
  ArrowRight,
  TrendingUp,
  Search,
  ChevronDown,
  LogOut,
  FileText
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext.jsx";
import { api } from "../lib/api.js";

export default function OnboardingPage() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { pathname, search } = location;
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState(null);
  const [detectedSkills, setDetectedSkills] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSkillInput, setShowSkillInput] = useState(false);
  const [skillQuery, setSkillQuery] = useState("");
  const [skillSuggestions, setSkillSuggestions] = useState([]);
  const [isSearchingSkills, setIsSearchingSkills] = useState(false);

  useEffect(() => {
    fetchOnboardingStatus();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(search);

    if (params.get("manual") === "true") {
      setCurrentStep(2);
      setShowSkillInput(true);
    }
  }, [search]);

  useEffect(() => {
    if (!showSkillInput || skillQuery.trim().length < 2) {
      setSkillSuggestions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setIsSearchingSkills(true);
        const response = await api.get("/skills/search", {
          params: {
            q: skillQuery,
            limit: 8,
          },
        });

        setSkillSuggestions(response.data.data.skills ?? []);
      } catch (error) {
        console.error("Failed to fetch skill suggestions", error);
        setSkillSuggestions([]);
      } finally {
        setIsSearchingSkills(false);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [showSkillInput, skillQuery]);

  const fetchOnboardingStatus = async () => {
    try {
      const response = await api.get("/onboarding/me");
      setOnboardingData(response.data.data);
      if (response.data.data?.skills) {
        setDetectedSkills(response.data.data.skills);
      }
    } catch (error) {
      console.error("Failed to fetch onboarding data", error);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("cv", file);

    try {
      // Simulate progress for UI
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await api.post("/onboarding/cv-uploads", formData, {
        headers: { 
          "Content-Type": "multipart/form-data"
        }
      });
      
      clearInterval(interval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setDetectedSkills(response.data.data.skills ?? []);
        setCurrentStep(3); // Move to confirmation step
        setIsUploading(false);
      }, 500);

    } catch (error) {
      console.error("CV Upload failed", error);
      setIsUploading(false);
    }
  };

  const handleRemoveSkill = async (skillId) => {
    try {
      if (skillId) {
        await api.delete(`/onboarding/skills/${skillId}`);
        setDetectedSkills(prev => prev.filter(s => s.id !== skillId));
        return;
      }

      const remainingSkills = detectedSkills.filter(skill => skill.id !== skillId);
      const response = await syncDraftSkills(remainingSkills);
      setDetectedSkills(response);
    } catch (error) {
      console.error("Failed to delete skill", error);
    }
  };

  const syncDraftSkills = async (skills) => {
    const response = await api.patch("/onboarding/skills", {
      skills: skills.map(skill => ({
        name: skill.name,
        proficiencyLevel: skill.proficiencyLevel || undefined,
      })),
    });

    return response.data.data.skills ?? [];
  };

  const handleAddSkill = async (skillName) => {
    const name = skillName.trim();
    if (!name) return;

    const alreadyExists = detectedSkills.some(
      skill => skill.name.toLowerCase() === name.toLowerCase()
    );

    if (alreadyExists) {
      setSkillQuery("");
      setSkillSuggestions([]);
      setShowSkillInput(false);
      return;
    }

    try {
      const nextSkills = [...detectedSkills, { name }];
      const savedSkills = await syncDraftSkills(nextSkills);

      setDetectedSkills(savedSkills);
      setSkillQuery("");
      setSkillSuggestions([]);
      setShowSkillInput(false);
    } catch (error) {
      console.error("Failed to add skill", error);
    }
  };

  const handleConfirm = async () => {
    try {
      await api.post("/onboarding/confirm", {});
      setCurrentStep(4);
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Confirmation failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf2ff] pb-40 lg:pb-12 font-['Plus_Jakarta_Sans',sans-serif] text-[#081024]">
      {/* Desktop Navbar (Consistent with Dashboard) */}
      <nav className="hidden lg:block sticky top-0 z-[100] bg-white border-b border-[#f3e8ff] shadow-sm">
        <div className="max-w-[1440px] mx-auto px-10 h-20 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link to="/dashboard" className="flex items-center gap-2">
              <img src="/image/logo_hirings.png" alt="Hirings" className="h-9 w-auto" />
              <span className="text-xl font-black text-[#2b0b3d]">Hirings</span>
            </Link>
            
            <div className="flex items-center gap-8">
              <NavLink to="/dashboard" label="Home" active={pathname === '/dashboard'} />
              <NavLink to="/onboarding" label="Onboarding" active={pathname === '/onboarding'} />
              <NavLink to="/skill-gap" label="Skill Gap" active={pathname === '/skill-gap'} />
              <NavLink to="/career" label="Career Recommendation" active={pathname === '/career'} />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Cari fitur atau skill..." 
                className="w-64 h-10 pl-10 pr-4 bg-[#fdf2ff] border-none rounded-full text-sm focus:ring-2 focus:ring-pink-200 outline-none transition-all"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#667085]" size={16} />
            </div>
            
            <button className="relative p-2 text-[#2b0b3d] hover:bg-[#fdf2ff] rounded-full transition">
              <Bell size={22} />
              <span className="absolute top-2 right-2 h-2 w-2 bg-pink-500 rounded-full border-2 border-white" />
            </button>

            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 pl-2 pr-1 py-1 bg-[#fdf2ff] rounded-full hover:bg-pink-50 transition"
              >
                <div className="h-8 w-8 rounded-full overflow-hidden border border-white">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" alt="Profile" className="w-full h-full object-cover" />
                </div>
                <span className="text-sm font-bold">{user?.fullName?.split(' ')[0]}</span>
                <ChevronDown size={16} className={`transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-[#f3e8ff] overflow-hidden py-2 animate-in fade-in zoom-in duration-200">
                  <button className="w-full px-5 py-2.5 text-left text-sm hover:bg-pink-50 flex items-center gap-3">
                    <User size={16} /> Profile Saya
                  </button>
                  <button 
                    onClick={logout}
                    className="w-full px-5 py-2.5 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-3"
                  >
                    <LogOut size={16} /> Keluar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between px-6 pt-12 pb-6">
        <div className="flex items-center gap-2">
          <img src="/image/logo_hirings.png" alt="Hirings" className="h-9 w-auto" />
          <span className="text-xl font-black text-[#2b0b3d]">Hirings</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2 text-[#2b0b3d] bg-white shadow-sm rounded-full">
            <Bell size={22} />
            <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-pink-500" />
          </button>
          <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-5 lg:px-10 mt-4 lg:mt-10">
        <div className="flex items-center gap-2 mb-6 lg:mb-8">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-pink-50 text-pink-500">
            <TrendingUp size={18} />
          </div>
          <h1 className="text-lg lg:text-xl font-bold text-[#2b0b3d]">Smart Onboarding</h1>
        </div>

        {/* Step Indicator / Status Card */}
        <section className="rounded-3xl bg-white p-6 lg:p-8 shadow-[0_10px_40px_rgba(43,11,61,0.06)] mb-8 border border-white">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl lg:text-2xl font-extrabold text-[#081024]">Lengkapi profil kamu</h2>
              <p className="text-[#667085] text-sm lg:text-base mt-1">Pilih cara input skill terbaikmu</p>
            </div>
            <div className="flex-1 max-w-md w-full">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#667085]">Progress Onboarding</span>
                <span className="text-sm font-black text-pink-600">
                  {currentStep === 1 ? '0%' : currentStep === 2 ? '30%' : currentStep === 3 ? '60%' : '100%'}
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-pink-50 overflow-hidden">
                <div 
                  className="h-full bg-pink-500 transition-all duration-700" 
                  style={{ width: `${currentStep === 1 ? 5 : currentStep === 2 ? 30 : currentStep === 3 ? 60 : 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Stepper */}
          <div className="mt-10 grid grid-cols-4 gap-2 relative">
             <div className="absolute top-4 left-[12.5%] right-[12.5%] h-0.5 bg-pink-50 -z-0 hidden sm:block" />
             <StepItem number={1} label="Pilih Jalur" active={currentStep === 1} completed={currentStep > 1} />
             <StepItem number={2} label="Input Data" active={currentStep === 2} completed={currentStep > 2} />
             <StepItem number={3} label="Konfirmasi" active={currentStep === 3} completed={currentStep > 3} />
             <StepItem number={4} label="Selesai" active={currentStep === 4} completed={currentStep > 4} />
          </div>
        </section>

        {/* Dynamic Content based on currentStep */}
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            {currentStep === 1 && (
              <div className="grid sm:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <SelectionCard 
                  icon={FileText} 
                  title="Upload CV" 
                  desc="PDF atau DOCX" 
                  btnText="Upload CV (PDF)" 
                  onClick={() => document.getElementById('cv-upload').click()}
                  primary
                />
                <SelectionCard 
                  icon={Edit3} 
                  title="Input Manual" 
                  desc="Isi kuis skill" 
                  btnText="Mulai Kuis" 
                  onClick={() => {
                    setCurrentStep(2);
                    setShowSkillInput(true);
                  }}
                />
                <input type="file" id="cv-upload" className="hidden" accept=".pdf,.docx" onChange={handleFileUpload} />
              </div>
            )}

            {isUploading && (
              <div className="rounded-3xl border-2 border-dashed border-pink-200 bg-white p-10 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
                 <div className="relative mb-6">
                    <div className="h-20 w-20 rounded-full bg-pink-50 flex items-center justify-center">
                       <Upload className="text-pink-500 animate-bounce" size={32} />
                    </div>
                    <svg className="absolute -top-1 -left-1 h-[88px] w-[88px] -rotate-90">
                       <circle 
                        cx="44" cy="44" r="42" 
                        stroke="currentColor" strokeWidth="4" fill="transparent" 
                        className="text-pink-100" 
                       />
                       <circle 
                        cx="44" cy="44" r="42" 
                        stroke="currentColor" strokeWidth="4" fill="transparent" 
                        strokeDasharray={264}
                        strokeDashoffset={264 - (264 * uploadProgress) / 100}
                        className="text-pink-500 transition-all duration-300" 
                       />
                    </svg>
                 </div>
                 <h3 className="text-lg font-bold text-[#2b0b3d]">Sedang menganalisis CV kamu...</h3>
                 <p className="text-sm text-[#667085] mt-2">Ini hanya akan memakan waktu beberapa detik.</p>
                 <div className="mt-8 w-full max-w-xs">
                    <div className="flex justify-between text-[11px] font-bold text-[#667085] mb-2 uppercase tracking-widest">
                       <span>Uploading</span>
                       <span>{uploadProgress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-pink-50 rounded-full overflow-hidden">
                       <div className="h-full bg-pink-500 transition-all" style={{ width: `${uploadProgress}%` }} />
                    </div>
                 </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <section className="rounded-3xl bg-white p-6 lg:p-8 shadow-[0_10px_40px_rgba(43,11,61,0.06)] border border-white">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-[#2b0b3d]">Input skill manual</h3>
                      <p className="text-sm text-[#667085] mt-1">Ketik sebagian nama skill, lalu pilih dari rekomendasi.</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-pink-50 text-pink-500 text-[11px] font-black">{detectedSkills.length} skill</span>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {detectedSkills.map((skill, idx) => (
                      <div key={skill.id || skill.name || idx} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#fdf2ff] border border-pink-50 text-pink-600 text-sm font-bold animate-in zoom-in duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                        {skill.name}
                        <button onClick={() => handleRemoveSkill(skill.id)} className="hover:text-pink-800 transition">
                          <X size={14} />
                        </button>
                      </div>
                    ))}

                    {showSkillInput ? (
                      <div className="relative w-full">
                        <div className="flex gap-2">
                          <input
                            autoFocus
                            value={skillQuery}
                            onChange={(event) => setSkillQuery(event.target.value)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                event.preventDefault();
                                handleAddSkill(skillQuery);
                              }

                              if (event.key === "Escape") {
                                setShowSkillInput(false);
                                setSkillQuery("");
                                setSkillSuggestions([]);
                              }
                            }}
                            placeholder="Ketik skill, contoh: pyt, git, sql"
                            className="min-w-0 flex-1 rounded-xl border border-pink-100 bg-white px-4 py-2.5 text-sm font-bold text-[#2b0b3d] outline-none focus:border-pink-300 focus:ring-4 focus:ring-pink-50"
                          />
                          <button
                            onClick={() => handleAddSkill(skillQuery)}
                            className="px-4 py-2.5 rounded-xl bg-pink-500 text-white text-sm font-black active:scale-95 transition"
                            type="button"
                          >
                            Tambah
                          </button>
                          <button
                            onClick={() => {
                              setShowSkillInput(false);
                              setSkillQuery("");
                              setSkillSuggestions([]);
                            }}
                            className="px-3 py-2.5 rounded-xl border border-pink-100 text-pink-400 text-sm font-black active:scale-95 transition"
                            type="button"
                          >
                            <X size={16} />
                          </button>
                        </div>

                        {(isSearchingSkills || skillSuggestions.length > 0) && (
                          <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-2xl border border-pink-50 bg-white p-2 shadow-xl shadow-purple-900/10">
                            {isSearchingSkills ? (
                              <p className="px-3 py-2 text-xs font-bold text-[#98a2b3]">
                                Mencari skill...
                              </p>
                            ) : (
                              skillSuggestions.map((skill) => (
                                <button
                                  key={skill.name}
                                  onClick={() => handleAddSkill(skill.name)}
                                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-bold text-[#2b0b3d] transition hover:bg-pink-50"
                                  type="button"
                                >
                                  <span>{skill.name}</span>
                                  <span className="text-[10px] font-black text-pink-400">
                                    {skill.category}
                                  </span>
                                </button>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowSkillInput(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-pink-100 text-pink-400 text-sm font-bold hover:bg-pink-50 transition"
                        type="button"
                      >
                        <Plus size={16} />
                        Tambah skill
                      </button>
                    )}
                  </div>

                  <div className="mt-10">
                    <button
                      onClick={() => setCurrentStep(3)}
                      disabled={detectedSkills.length === 0}
                      className="w-full flex items-center justify-center gap-3 h-14 rounded-2xl bg-[#2b0b3d] text-white font-bold shadow-xl shadow-purple-900/20 hover:scale-[1.01] transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      Lanjut Konfirmasi
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </section>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <section className="rounded-3xl bg-white p-6 lg:p-8 shadow-[0_10px_40px_rgba(43,11,61,0.06)] border border-white">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-[#2b0b3d]">Skill terdeteksi</h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-pink-50 text-pink-500 text-[11px] font-black">{detectedSkills.length} skill</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {detectedSkills.map((skill, idx) => (
                      <div key={skill.id || idx} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#fdf2ff] border border-pink-50 text-pink-600 text-sm font-bold animate-in zoom-in duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                        {skill.name}
                        <button onClick={() => handleRemoveSkill(skill.id)} className="hover:text-pink-800 transition">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    {showSkillInput ? (
                      <div className="relative w-full">
                        <div className="flex gap-2">
                          <input
                            autoFocus
                            value={skillQuery}
                            onChange={(event) => setSkillQuery(event.target.value)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                event.preventDefault();
                                handleAddSkill(skillQuery);
                              }

                              if (event.key === "Escape") {
                                setShowSkillInput(false);
                                setSkillQuery("");
                                setSkillSuggestions([]);
                              }
                            }}
                            placeholder="Ketik skill, contoh: pyt, git, sql"
                            className="min-w-0 flex-1 rounded-xl border border-pink-100 bg-white px-4 py-2.5 text-sm font-bold text-[#2b0b3d] outline-none focus:border-pink-300 focus:ring-4 focus:ring-pink-50"
                          />
                          <button
                            onClick={() => handleAddSkill(skillQuery)}
                            className="px-4 py-2.5 rounded-xl bg-pink-500 text-white text-sm font-black active:scale-95 transition"
                            type="button"
                          >
                            Tambah
                          </button>
                          <button
                            onClick={() => {
                              setShowSkillInput(false);
                              setSkillQuery("");
                              setSkillSuggestions([]);
                            }}
                            className="px-3 py-2.5 rounded-xl border border-pink-100 text-pink-400 text-sm font-black active:scale-95 transition"
                            type="button"
                          >
                            <X size={16} />
                          </button>
                        </div>

                        {(isSearchingSkills || skillSuggestions.length > 0) && (
                          <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-2xl border border-pink-50 bg-white p-2 shadow-xl shadow-purple-900/10">
                            {isSearchingSkills ? (
                              <p className="px-3 py-2 text-xs font-bold text-[#98a2b3]">
                                Mencari skill...
                              </p>
                            ) : (
                              skillSuggestions.map((skill) => (
                                <button
                                  key={skill.name}
                                  onClick={() => handleAddSkill(skill.name)}
                                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-bold text-[#2b0b3d] transition hover:bg-pink-50"
                                  type="button"
                                >
                                  <span>{skill.name}</span>
                                  <span className="text-[10px] font-black text-pink-400">
                                    {skill.category}
                                  </span>
                                </button>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowSkillInput(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-pink-100 text-pink-400 text-sm font-bold hover:bg-pink-50 transition"
                        type="button"
                      >
                        <Plus size={16} />
                        Tambah skill
                      </button>
                    )}
                  </div>

                  <div className="mt-10">
                    <button 
                      onClick={handleConfirm}
                      className="w-full flex items-center justify-center gap-3 h-14 rounded-2xl bg-[#2b0b3d] text-white font-bold shadow-xl shadow-purple-900/20 hover:scale-[1.01] transition active:scale-95"
                    >
                      Konfirmasi & Analisis
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </section>
              </div>
            )}

            {currentStep === 4 && (
              <div className="rounded-[40px] bg-white p-12 text-center shadow-xl border border-white animate-in zoom-in duration-500">
                <div className="mx-auto h-24 w-24 rounded-full bg-green-50 flex items-center justify-center mb-6">
                  <CheckCircle2 className="text-green-500" size={48} />
                </div>
                <h2 className="text-3xl font-black text-[#2b0b3d]">Selesai!</h2>
                <p className="text-[#667085] mt-4 text-lg">Profil kamu sudah siap. Kami sedang menyiapkan rekomendasi karir terbaik untukmu.</p>
                <div className="mt-8 flex justify-center">
                   <div className="flex items-center gap-2 text-pink-500 font-bold">
                      <div className="h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
                      Mengarahkan ke Dashboard...
                   </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel: Tips/Guidance (Desktop Only) */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              <div className="rounded-3xl bg-[#2b0b3d] p-8 text-white relative overflow-hidden shadow-2xl">
                 <div className="relative z-10">
                    <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                       <BrainCircuit className="text-pink-300" size={24} />
                    </div>
                    <h4 className="text-xl font-bold mb-3">AI Personal Advisor</h4>
                    <p className="text-pink-100/80 text-sm leading-relaxed">
                       Pastikan CV kamu dalam format PDF yang bersih untuk ekstraksi skill yang lebih akurat oleh sistem kami.
                    </p>
                 </div>
                 <div className="absolute -bottom-10 -right-10 h-40 w-40 bg-pink-500/10 rounded-full blur-3xl" />
              </div>

              <div className="rounded-3xl bg-white p-6 border border-pink-50 shadow-sm">
                 <h4 className="font-bold text-[#2b0b3d] mb-4">Mengapa ini penting?</h4>
                 <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm text-[#667085]">
                       <div className="h-1.5 w-1.5 rounded-full bg-pink-500 mt-1.5 shrink-0" />
                       Membantu AI memahami potensi tersembunyi kamu.
                    </li>
                    <li className="flex items-start gap-3 text-sm text-[#667085]">
                       <div className="h-1.5 w-1.5 rounded-full bg-pink-500 mt-1.5 shrink-0" />
                       Meningkatkan akurasi kecocokan karir hingga 95%.
                    </li>
                 </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-24 bg-white border-t border-[#fdf2ff] px-6 flex items-center justify-between z-[100] shadow-[0_-10px_30px_rgba(43,11,61,0.05)]">
        <NavIconButton to="/dashboard" icon={Home} label="Home" active={pathname === '/dashboard'} />
        <NavIconButton to="/onboarding" icon={UserPlus} label="Onboarding" active={pathname === '/onboarding'} />
        <NavIconButton to="/skill-gap" icon={Target} label="Skill Gap" active={pathname === '/skill-gap'} />
        <NavIconButton to="/career" icon={Star} label="Career" active={pathname === '/career'} />
        <NavIconButton to="/profile" icon={User} label="Profile" active={pathname === '/profile'} />
      </nav>
    </div>
  );
}

function NavLink({ to, label, active }) {
  return (
    <Link to={to} className={`text-[15px] font-bold transition-colors ${active ? 'text-[#2b0b3d] relative after:absolute after:-bottom-2 after:left-0 after:right-0 after:h-0.5 after:bg-[#2b0b3d] after:rounded-full' : 'text-[#667085] hover:text-[#2b0b3d]'}`}>
      {label}
    </Link>
  );
}

function NavIconButton({ to, icon: Icon, label, active }) {
  return (
    <Link to={to} className="flex flex-col items-center gap-1">
      <div className={`h-12 w-12 rounded-full flex items-center justify-center transition active:scale-90 ${active ? 'bg-pink-100 text-pink-600' : 'text-[#98a2b3]'}`}>
        <Icon size={24} />
      </div>
      <span className={`text-[11px] font-bold ${active ? 'text-pink-600' : 'text-[#98a2b3]'}`}>{label}</span>
    </Link>
  );
}

function StepItem({ number, label, active, completed }) {
  return (
    <div className="flex flex-col items-center gap-2 z-10">
      <div className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-black border-2 transition-all duration-500 ${
        completed ? 'bg-pink-500 border-pink-500 text-white' : 
        active ? 'bg-white border-pink-500 text-pink-500 shadow-lg shadow-pink-100' : 
        'bg-white border-pink-50 text-pink-200'
      }`}>
        {completed ? <CheckCircle2 size={18} /> : number}
      </div>
      <span className={`text-[10px] lg:text-[11px] font-bold transition-colors duration-500 ${
        active || completed ? 'text-pink-600' : 'text-pink-100'
      }`}>
        {label}
      </span>
    </div>
  );
}

function SelectionCard({ icon: Icon, title, desc, btnText, onClick, primary }) {
  return (
    <div className={`rounded-3xl p-6 lg:p-8 border-2 transition-all hover:shadow-xl hover:scale-[1.02] cursor-pointer flex flex-col items-center text-center group ${
      primary ? 'bg-white border-pink-50 shadow-sm' : 'bg-white border-pink-50 shadow-sm'
    }`}>
      <div className={`h-16 w-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:rotate-6 ${
        primary ? 'bg-purple-50 text-purple-600' : 'bg-pink-50 text-pink-600'
      }`}>
        <Icon size={32} />
      </div>
      <h4 className="text-lg font-bold text-[#2b0b3d]">{title}</h4>
      <p className="text-sm text-[#667085] mt-1 mb-8">{desc}</p>
      <button 
        onClick={onClick}
        className={`w-full py-3 rounded-xl font-black text-[13px] transition active:scale-95 ${
          primary ? 'bg-[#2b0b3d] text-white shadow-lg shadow-purple-900/10' : 'border border-pink-200 text-pink-600 hover:bg-pink-50'
        }`}
      >
        {btnText}
      </button>
    </div>
  );
}

function BrainCircuit(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .52 8.242 4.002 4.002 0 0 0 7.803.167A3 3 0 1 0 12 5Z" />
      <path d="M9 13h4a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2H9" />
      <path d="M15 13v4" />
      <path d="M11 13v4" />
    </svg>
  )
}
