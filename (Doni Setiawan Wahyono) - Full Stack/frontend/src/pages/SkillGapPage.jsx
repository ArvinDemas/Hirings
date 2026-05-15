import { useState, useEffect } from "react";
import { 
  Bell, 
  ChevronRight, 
  Home, 
  User, 
  UserPlus, 
  Target, 
  Star, 
  TrendingUp,
  Search,
  ChevronDown,
  LogOut,
  Briefcase,
  AlertTriangle,
  CheckCircle2,
  Clock,
  PlayCircle,
  Cpu,
  Layers,
  Wrench,
  Monitor
} from "lucide-react";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer 
} from 'recharts';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext.jsx";
import { api } from "../lib/api.js";

export default function SkillGapPage() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [targets, setTargets] = useState({ roles: [], industries: [], levels: [] });
  const [selectedTarget, setSelectedTarget] = useState({ roleId: '', industryId: '', levelId: '' });
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('Semua');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [targetsRes, latestRes] = await Promise.all([
        api.get("/skill-gap/targets"),
        api.get("/skill-gap/analyses/latest")
      ]);

      const nextTargets = targetsRes.data.data;
      setTargets(nextTargets);
      if (latestRes.data.data.analysis) {
        const result = latestRes.data.data.analysis;
        setAnalysis(result);
        setSelectedTarget({
          roleId: result.target.role.id,
          industryId: result.target.industry.id,
          levelId: result.target.level.id
        });
      } else {
        // Set default values if no latest analysis
        setSelectedTarget({
          roleId: nextTargets.roles[0]?.id ?? '',
          industryId: nextTargets.industries[0]?.id ?? '',
          levelId: nextTargets.levels[0]?.id ?? ''
        });
      }
    } catch (error) {
      console.error("Failed to fetch skill gap data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    try {
      setAnalyzing(true);
      const response = await api.post("/skill-gap/analyses", selectedTarget);
      setAnalysis(response.data.data);
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setAnalyzing(false);
    }
  };

  const filterSkills = (skills) => {
    if (!skills) return [];
    if (activeTab === 'Semua') return skills;
    if (activeTab === 'Teknis') return skills.filter(s => s.dimension === 'Technical Skill');
    if (activeTab === 'Soft Skill') return skills.filter(s => ['Communication', 'Teamwork', 'Leadership', 'Problem Solving'].includes(s.dimension));
    if (activeTab === 'Tools') return skills.filter(s => s.dimension === 'Tools');
    return skills;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdf2ff] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
          <span className="font-bold text-[#2b0b3d]">Loading Skill Gap...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf2ff] pb-40 lg:pb-12 font-['Plus_Jakarta_Sans',sans-serif] text-[#081024]">
      {/* Desktop Navbar */}
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
                placeholder="Search anything..." 
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
        <div className="flex items-center gap-2 mb-6 lg:mb-10">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-pink-50 text-pink-500">
            <TrendingUp size={18} />
          </div>
          <h1 className="text-xl font-bold text-[#2b0b3d]">Skill Gap Analyzer</h1>
        </div>

        <section className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-white mb-8">
          <h2 className="text-lg font-bold mb-6">Pilih Target Karir</h2>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-end">
            <DropdownField 
              label="Pilih Role" 
              icon={Briefcase} 
              options={targets.roles} 
              value={selectedTarget.roleId} 
              onChange={(val) => setSelectedTarget(prev => ({ ...prev, roleId: val }))}
            />
            <DropdownField 
              label="Industri" 
              icon={Cpu} 
              options={targets.industries} 
              value={selectedTarget.industryId} 
              onChange={(val) => setSelectedTarget(prev => ({ ...prev, industryId: val }))}
            />
            <DropdownField 
              label="Level" 
              icon={TrendingUp} 
              options={targets.levels} 
              value={selectedTarget.levelId} 
              onChange={(val) => setSelectedTarget(prev => ({ ...prev, levelId: val }))}
            />
            <button 
              onClick={handleAnalyze}
              disabled={analyzing}
              className="w-full h-14 rounded-2xl bg-pink-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20 hover:scale-[1.01] transition active:scale-95 disabled:opacity-50"
            >
              {analyzing ? 'Menganalisis...' : 'Analisis Sekarang'}
              {!analyzing && <ArrowRight size={20} />}
            </button>
          </div>
        </section>

        {analysis ? (
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <section className="bg-white rounded-[32px] lg:rounded-[40px] p-6 lg:p-10 shadow-sm border border-white overflow-hidden">
                <div className="flex items-center justify-between gap-4 mb-8">
                  <h3 className="text-lg lg:text-xl font-black text-[#081024]">Skill Gap Overview</h3>
                  <button className="text-[11px] lg:text-sm font-bold text-pink-600 hover:underline shrink-0">Lihat Semua</button>
                </div>
                <div className="flex gap-6 border-b border-[#fdf2ff] mb-8 overflow-x-auto no-scrollbar">
                  {['Semua', 'Teknis', 'Soft Skill', 'Tools'].map(tab => (
                    <button 
                      key={tab} 
                      onClick={() => setActiveTab(tab)}
                      className={`pb-4 text-[13px] lg:text-sm font-bold transition-all relative whitespace-nowrap ${activeTab === tab ? 'text-pink-500 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-pink-500 after:rounded-full' : 'text-[#667085] hover:text-[#2b0b3d]'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="flex flex-col lg:grid lg:grid-cols-2 gap-10 lg:items-center">
                   <div className="flex flex-col items-center">
                      <div className="h-[240px] sm:h-[300px] w-full max-w-[300px] sm:max-w-[400px]">
                        <ResponsiveContainer width="100%" height={300}>
                          <RadarChart cx="50%" cy="50%" outerRadius="45%" data={analysis.radar}>
                            <PolarGrid stroke="#f3e8ff" />
                            <PolarAngleAxis 
                              dataKey="dimension" 
                              tick={{ fill: '#667085', fontSize: 10, fontWeight: 700 }} 
                            />
                            <Radar name="Skill Anda" dataKey="userScore" stroke="#2b0b3d" fill="#2b0b3d" fillOpacity={0.25} />
                            <Radar name="Benchmark Industri" dataKey="benchmarkScore" stroke="#f472b6" fill="#f472b6" fillOpacity={0.15} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex justify-center gap-6 mt-4">
                        <div className="flex items-center gap-2">
                           <div className="h-2.5 w-2.5 rounded-full bg-[#2b0b3d]" />
                           <span className="text-[10px] font-bold text-[#667085]">Skill Anda</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <div className="h-2.5 w-2.5 rounded-full bg-pink-400" />
                           <span className="text-[10px] font-bold text-[#667085]">Benchmark Industri</span>
                        </div>
                      </div>
                   </div>
                   <div className="space-y-8 lg:space-y-10">
                      <div className="space-y-6">
                         <h4 className="text-[10px] font-black text-[#081024] uppercase tracking-wider">Skill yang Kamu Punya</h4>
                         <div className="space-y-4">
                            {filterSkills(analysis.ownedSkills).length > 0 ? (
                              filterSkills(analysis.ownedSkills).slice(0, 4).map((skill, idx) => (
                                <div key={idx} className="space-y-2">
                                  <div className="flex items-center gap-2 text-[13px] font-bold text-[#2b0b3d]">
                                      <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                                      <span className="truncate">{skill.name}</span>
                                  </div>
                                  <div className="h-1.5 w-full bg-pink-50 rounded-full overflow-hidden">
                                    <div className="h-full bg-pink-500" style={{ width: `${skill.matchPercent}%` }} />
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-[11px] text-[#667085] italic">Belum ada skill terdeteksi.</p>
                            )}
                         </div>
                      </div>
                      <div className="space-y-6">
                         <h4 className="text-[10px] font-black text-[#081024] uppercase tracking-wider">Skill yang Perlu Ditingkatkan</h4>
                         <div className="space-y-4">
                            {filterSkills(analysis.gapSkills).length > 0 ? (
                              filterSkills(analysis.gapSkills).slice(0, 4).map((skill, idx) => (
                                <div key={idx} className="space-y-2">
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 text-[13px] font-bold text-[#2b0b3d] truncate">
                                        <AlertTriangle size={14} className="text-orange-400 shrink-0" />
                                        <span className="truncate">{skill.name}</span>
                                    </div>
                                    <span className="px-1.5 py-0.5 rounded bg-red-50 text-red-500 text-[8px] font-black uppercase shrink-0">
                                      {skill.priority.split(' ')[0]}
                                    </span>
                                  </div>
                                  <div className="h-1.5 w-full bg-pink-50 rounded-full overflow-hidden">
                                    <div className="h-full bg-pink-200" style={{ width: `${skill.matchPercent}%` }} />
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-[11px] text-[#667085] italic">Semua skill sudah terpenuhi!</p>
                            )}
                         </div>
                      </div>
                   </div>
                </div>
              </section>
              <div className="bg-white rounded-[32px] lg:rounded-[40px] p-8 lg:p-10 shadow-sm border border-white flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="flex flex-col lg:flex-row items-center gap-5 text-center lg:text-left">
                  <div className="hidden lg:flex h-14 w-14 rounded-2xl bg-pink-50 items-center justify-center shrink-0">
                    <Star className="text-pink-500" size={28} />
                  </div>
                  <div className="max-w-md">
                    <h3 className="text-lg font-black text-[#2b0b3d]">Siap melihat jalur karir terbaikmu?</h3>
                    <p className="text-sm text-[#667085] mt-1">Dapatkan rekomendasi karir yang paling cocok berdasarkan skill kamu.</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                   <button className="h-14 px-8 rounded-2xl border-2 border-pink-100 text-pink-600 font-bold text-sm hover:bg-pink-50 transition active:scale-95">
                     Ubah Target Role
                   </button>
                   <button className="h-14 px-8 rounded-2xl bg-pink-500 text-white font-bold text-sm shadow-lg shadow-pink-500/20 hover:scale-[1.02] transition active:scale-95 flex items-center justify-center gap-2">
                     Lihat Career Path
                     <ArrowRight size={18} />
                   </button>
                </div>
              </div>
            </div>
            <div className="lg:col-span-4 space-y-8">
               <section className="bg-white rounded-[32px] lg:rounded-[40px] p-8 shadow-sm border border-white text-center">
                  <h3 className="text-lg font-black text-[#081024] mb-8">Overall Match Score</h3>
                  <div className="relative h-40 w-40 mx-auto mb-6">
                    <svg className="h-full w-full -rotate-90">
                       <circle cx="80" cy="80" r="70" stroke="#fdf2ff" strokeWidth="12" fill="transparent" />
                       <circle 
                        cx="80" cy="80" r="70" stroke="url(#gradient)" strokeWidth="12" fill="transparent" 
                        strokeDasharray={440}
                        strokeDashoffset={440 - (440 * analysis.summary.overallMatchScore) / 100}
                        strokeLinecap="round"
                       />
                       <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#ec4899" />
                          <stop offset="100%" stopColor="#db2777" />
                        </linearGradient>
                       </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className="text-4xl font-black text-[#2b0b3d]">{analysis.summary.overallMatchScore}%</span>
                       <span className="text-[10px] font-bold text-[#667085] uppercase tracking-widest mt-1">Overall Match</span>
                    </div>
                  </div>
                  <div className="inline-flex px-4 py-1.5 rounded-full bg-green-50 text-green-600 text-[11px] font-black italic mb-6">
                    {analysis.summary.matchLabel}
                  </div>
                  <div className="space-y-4 pt-8 border-t border-[#fdf2ff]">
                     <StatRow icon={CheckCircle2} color="text-green-500" bg="bg-green-50" label="Skill Match" value={`${analysis.summary.fulfilledSkillCount} dari ${analysis.summary.totalRequiredSkillCount}`} />
                     <StatRow icon={AlertTriangle} color="text-orange-500" bg="bg-orange-50" label="Skill Gap" value={`${analysis.summary.gapSkillCount} skill perlu ditingkatkan`} />
                  </div>
               </section>
               <section className="bg-white rounded-[32px] lg:rounded-[40px] p-8 shadow-sm border border-white">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-black text-[#081024]">Rekomendasi Kursus</h3>
                    <button className="text-[11px] font-black text-pink-500 hover:underline shrink-0">Lihat Semua</button>
                  </div>
                  <div className="space-y-6">
                    {analysis.courseRecommendations.map((course, idx) => (
                      <div key={idx} className="flex items-center gap-4 group cursor-pointer">
                        <div className="h-12 w-12 rounded-xl bg-[#fdf2ff] flex items-center justify-center text-[#2b0b3d] group-hover:bg-pink-50 transition-colors">
                           {course.title.includes('Data') ? <BarChartIcon size={22} /> : course.title.includes('Machine') ? <CodeIcon size={22} /> : <BookIcon size={22} />}
                        </div>
                        <div className="flex-1 min-w-0">
                           <h4 className="text-[13px] font-extrabold text-[#2b0b3d] truncate">{course.title}</h4>
                           <span className="text-[11px] text-[#667085]">{course.provider}</span>
                        </div>
                        <button className="text-[10px] font-black text-pink-500 shrink-0">
                           <ChevronRight size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
               </section>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[40px] p-20 text-center shadow-sm border border-white">
             <div className="h-24 w-24 rounded-full bg-pink-50 flex items-center justify-center mx-auto mb-8">
                <Target size={48} className="text-pink-300" />
             </div>
             <h3 className="text-2xl font-black text-[#2b0b3d]">Belum ada analisis</h3>
             <p className="text-[#667085] mt-4 max-w-md mx-auto">Pilih target karir dan klik tombol analisis untuk memulai.</p>
          </div>
        )}
      </main>

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
    <Link to={to} className={`text-[15px] font-bold transition-colors ${active ? 'text-[#2b0b3d] relative after:absolute after:-bottom-2 after:left-0 after:right-0 after:h-0.5 after:bg-pink-500 after:rounded-full' : 'text-[#667085] hover:text-[#2b0b3d]'}`}>
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

function DropdownField({ label, icon: Icon, options, value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-[#667085]">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2b0b3d]">
          <Icon size={18} />
        </div>
        <select 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-14 pl-12 pr-10 bg-[#fdf2ff] border-none rounded-2xl text-[14px] font-bold text-[#2b0b3d] appearance-none focus:ring-2 focus:ring-pink-200 outline-none transition-all"
        >
          {options.map(opt => (
            <option key={opt.id} value={opt.id}>{opt.name}</option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#667085] pointer-events-none">
          <ChevronDown size={18} />
        </div>
      </div>
    </div>
  );
}

function StatRow({ icon: Icon, color, bg, label, value }) {
  return (
    <div className="flex items-center gap-4 text-left">
      <div className={`h-10 w-10 rounded-xl ${bg} ${color} flex items-center justify-center shrink-0`}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">{label}</div>
        <div className="text-[13px] font-black text-[#2b0b3d] truncate">{value}</div>
      </div>
    </div>
  );
}

function ArrowRight({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  );
}

function BarChartIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="10"></line>
      <line x1="18" y1="20" x2="18" y2="4"></line>
      <line x1="6" y1="20" x2="6" y2="16"></line>
    </svg>
  );
}

function CodeIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
    </svg>
  );
}

function BookIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>
  );
}
