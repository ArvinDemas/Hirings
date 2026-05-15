import { useState, useEffect } from "react";
import { 
  Bell, 
  ChevronRight, 
  Home, 
  User, 
  UserPlus, 
  Target, 
  Star, 
  Search, 
  ChevronDown, 
  LogOut, 
  ArrowRight,
  TrendingUp,
  Briefcase,
  Clock,
  Bookmark,
  Flame,
  CheckCircle2,
  AlertTriangle,
  X,
  Plus,
  ArrowLeft,
  ChevronUp,
  Cpu,
  BarChart as BarChartIcon,
  Code as CodeIcon,
  BookOpen as BookIcon
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext.jsx";
import { api } from "../lib/api.js";

export default function CareerPage() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { pathname } = location;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [filters, setFilters] = useState({ industries: [], sortOptions: [] });
  const [activeIndustry, setActiveIndustry] = useState("all");
  const [sortBy, setSortBy] = useState("highest-match");
  const [expandedId, setExpandedId] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchRecommendations();
    }
  }, [activeIndustry, sortBy]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [filterRes, latestRes] = await Promise.all([
        api.get("/career-recommendations/filters"),
        api.get("/career-recommendations/latest")
      ]);
      setFilters(filterRes.data.data);
      setData(latestRes.data.data);
    } catch (error) {
      console.error("Failed to fetch career data", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await api.get("/career-recommendations/latest", {
        params: { industryId: activeIndustry, sortBy }
      });
      setData(response.data.data);
    } catch (error) {
      console.error("Failed to fetch recommendations", error);
    }
  };

  const toggleSave = async (careerId, isSaved) => {
    try {
      if (isSaved) {
        await api.delete(`/career-recommendations/saved/${careerId}`);
      } else {
        await api.post("/career-recommendations/saved", { careerId });
      }
      fetchRecommendations();
    } catch (error) {
      console.error("Failed to toggle save", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdf2ff] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
          <p className="text-pink-600 font-bold animate-pulse">Menyiapkan rekomendasi...</p>
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
        <div className="flex items-center gap-2 mb-6 lg:mb-10">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-pink-50 text-pink-500">
            <TrendingUp size={18} />
          </div>
          <h1 className="text-xl font-bold text-[#2b0b3d]">Career Recommendation</h1>
        </div>

        {/* Results Context Card */}
        <section className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-white mb-8">
           <div className="flex items-start gap-4 mb-8">
              <button className="h-10 w-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-500 shrink-0">
                <ArrowLeft size={18} />
              </button>
              <div>
                <h2 className="text-lg lg:text-xl font-bold text-[#081024]">Hasil Rekomendasi</h2>
                <p className="text-[#667085] text-xs lg:text-sm mt-1">
                  Berdasarkan profil skill kamu • {data?.context?.targetRole || 'Semua Role'} • {data?.context?.level || 'Semua Level'}
                </p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SummaryCard 
                icon={Target} 
                bg="bg-purple-50" 
                color="text-purple-600" 
                value={data?.summary?.matchCount || 0} 
                label="Career Match" 
              />
              <SummaryCard 
                icon={TrendingUp} 
                bg="bg-green-50" 
                color="text-green-600" 
                value={data?.summary?.demandTrend || 'Stabil'} 
                label="Demand Karir" 
              />
              <SummaryCard 
                icon={Clock} 
                bg="bg-orange-50" 
                color="text-orange-600" 
                value={`~${data?.summary?.averageReadyMonths || 0} bulan`} 
                label="Avg. Siap Kerja" 
              />
           </div>
        </section>

        {/* Filters & Sorting */}
        <div className="space-y-6 mb-8 bg-white p-5 rounded-3xl border border-white shadow-sm">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#667085] uppercase tracking-widest ml-1">Filter Industri</label>
                <div className="relative">
                   <select 
                    value={activeIndustry}
                    onChange={(e) => setActiveIndustry(e.target.value)}
                    className="w-full appearance-none bg-[#fdf2ff] border-none rounded-2xl px-4 py-3.5 pr-10 text-xs font-bold text-[#2b0b3d] outline-none focus:ring-2 focus:ring-pink-200 cursor-pointer transition-all"
                   >
                      {filters.industries.map(ind => (
                        <option key={ind.id} value={ind.id}>{ind.name}</option>
                      ))}
                   </select>
                   <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#667085] pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#667085] uppercase tracking-widest ml-1">Urutkan</label>
                <div className="relative">
                   <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full appearance-none bg-[#fdf2ff] border-none rounded-2xl px-4 py-3.5 pr-10 text-xs font-bold text-[#2b0b3d] outline-none focus:ring-2 focus:ring-pink-200 cursor-pointer transition-all"
                   >
                      {filters.sortOptions.map(opt => (
                        <option key={opt.id} value={opt.id}>{opt.name}</option>
                      ))}
                   </select>
                   <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#667085] pointer-events-none" />
                </div>
              </div>
           </div>
        </div>

        {/* Recommendations List */}
        <div className="space-y-6">
           {data?.recommendations?.map((career) => (
              <CareerCard 
                key={career.id} 
                career={career} 
                isExpanded={expandedId === career.id}
                onToggle={() => setExpandedId(expandedId === career.id ? null : career.id)}
                onSave={() => toggleSave(career.id, career.isSaved)}
              />
           ))}

           {data?.recommendations?.length === 0 && (
             <div className="bg-white rounded-[40px] p-20 text-center shadow-sm border border-white">
                <div className="h-20 w-20 rounded-full bg-pink-50 flex items-center justify-center mx-auto mb-6">
                   <Search size={40} className="text-pink-300" />
                </div>
                <h3 className="text-xl font-bold text-[#2b0b3d]">Tidak ada hasil</h3>
                <p className="text-[#667085] mt-2 max-w-xs mx-auto">Coba ganti filter industri atau kriteria pencarian kamu.</p>
             </div>
           )}
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

function SummaryCard({ icon: Icon, bg, color, value, label }) {
  return (
    <div className="bg-white rounded-2xl p-5 flex items-center gap-5 border border-[#f3e8ff]">
       <div className={`h-12 w-12 rounded-xl ${bg} ${color} flex items-center justify-center shrink-0`}>
          <Icon size={24} />
       </div>
       <div>
          <div className={`text-xl font-black ${color}`}>{value}</div>
          <div className="text-[11px] font-bold text-[#667085] uppercase tracking-wider">{label}</div>
       </div>
    </div>
  );
}

function CareerCard({ career, isExpanded, onToggle, onSave }) {
  return (
    <div className={`bg-white rounded-[32px] border-2 transition-all duration-300 overflow-hidden ${isExpanded ? 'border-pink-100 shadow-xl' : 'border-white shadow-sm hover:border-pink-50'}`}>
       <div className="p-5 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
             {/* Header Area */}
             <div className="flex items-center lg:items-start gap-4">
                <div className="h-14 w-14 lg:h-16 lg:w-16 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-500 shrink-0">
                   {career.title.includes('Analyst') ? <BarChartIcon size={24} /> : career.title.includes('Scientist') ? <CodeIcon size={24} /> : <Target size={24} />}
                </div>
                <div className="min-w-0 flex-1">
                   <h3 className="text-base lg:text-xl font-black text-[#2b0b3d] leading-tight mb-1 truncate">{career.title}</h3>
                   <div className="px-2 py-0.5 rounded-full bg-green-50 text-green-600 text-[9px] font-black uppercase inline-block">
                     {career.matchScore}% Match
                   </div>
                </div>
             </div>

             <div className="flex-1">
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                   <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50/50 px-2 py-1 rounded-lg">
                     <TrendingUp size={12} /> {career.demand.label}
                   </span>
                   {career.badge && (
                     <span className="flex items-center gap-1 text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg">
                       <Flame size={12} /> {career.badge}
                     </span>
                   )}
                </div>
                <p className="text-[13px] text-[#667085] leading-relaxed mb-6 lg:max-w-2xl">
                   {career.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-6 lg:mb-0">
                   {career.skills.map((skill, idx) => (
                     <span key={idx} className="px-2.5 py-1 rounded-lg bg-[#fdf2ff] text-[#2b0b3d] text-[10px] font-bold border border-pink-50">
                       {skill}
                     </span>
                   ))}
                   {career.additionalSkillCount > 0 && (
                     <span className="px-2.5 py-1 rounded-lg bg-pink-50 text-pink-600 text-[10px] font-bold">
                       +{career.additionalSkillCount} lagi
                     </span>
                   )}
                </div>
             </div>
             
             <div className="flex flex-row lg:flex-col gap-4 lg:w-64 shrink-0 lg:text-right border-t lg:border-t-0 pt-4 lg:pt-0 border-[#fdf2ff] justify-between">
                <div className="space-y-0.5">
                   <div className="text-[10px] font-bold text-[#667085]">Estimasi Gaji</div>
                   <div className="text-xs lg:text-sm font-black text-[#2b0b3d]">{career.salaryRange}</div>
                </div>
                <div className="space-y-0.5">
                   <div className="text-[10px] font-bold text-[#667085]">Persiapan</div>
                   <div className="text-xs lg:text-sm font-bold text-pink-600 flex items-center lg:justify-end gap-1">
                     <Clock size={12} /> ~{career.readyInMonths} bln
                   </div>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-[#fdf2ff]">
             <button 
              onClick={onSave}
              className={`h-11 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition active:scale-95 border ${
                career.isSaved 
                ? 'bg-pink-500 border-pink-500 text-white shadow-sm shadow-pink-200' 
                : 'bg-white border-pink-100 text-pink-600 hover:bg-pink-50'
              }`}
             >
                <Bookmark size={16} className={career.isSaved ? 'fill-current' : ''} />
                {career.isSaved ? 'Tersimpan' : 'Simpan'}
             </button>
             <button 
              onClick={onToggle}
              className={`h-11 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition active:scale-95 ${
                isExpanded 
                ? 'bg-[#2b0b3d] text-white' 
                : 'bg-pink-500 text-white shadow-lg shadow-pink-500/20'
              }`}
             >
                {isExpanded ? 'Tutup' : 'Lihat Detail'}
                {isExpanded ? <ChevronUp size={16} /> : <ArrowRight size={16} />}
             </button>
          </div>
       </div>

       {isExpanded && (
          <div className="bg-[#fdf2ff]/50 border-t border-pink-50 p-6 lg:p-10 space-y-10 animate-in slide-in-from-top-4 duration-500">
             <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-white">
                <h4 className="text-lg font-black text-[#2b0b3d] mb-8">Roadmap Menuju {career.title}</h4>
                <div className="relative space-y-12 ml-4">
                   <div className="absolute left-[7px] top-4 bottom-4 w-0.5 bg-pink-100 border-dashed border-l-2 border-pink-200 -z-0" />
                   
                   {career.roadmap.map((step, idx) => (
                      <div key={idx} className="relative z-10 flex gap-6">
                         <div className={`h-4 w-4 rounded-full border-2 border-white shadow-sm mt-1 shrink-0 ${
                            step.status === 'sudah punya' ? 'bg-green-500' :
                            step.status === 'perlu belajar' ? 'bg-orange-500' : 'bg-pink-500'
                         }`} />
                         <div className="flex-1">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-2">
                               <div className="flex items-center gap-3">
                                  <span className="text-xs font-black text-pink-400 uppercase tracking-widest">{step.step}.</span>
                                  <h5 className="font-bold text-[#2b0b3d]">{step.title}</h5>
                                  <span className="text-xs text-[#667085]">({step.duration})</span>
                               </div>
                               <div className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                                  step.status === 'sudah punya' ? 'bg-green-50 text-green-600' :
                                  step.status === 'perlu belajar' ? 'bg-orange-50 text-orange-600' : 'bg-pink-50 text-pink-600'
                               }`}>
                                  {step.status}
                               </div>
                            </div>
                            <p className="text-xs text-[#667085] leading-relaxed max-w-xl">
                               {step.description}
                            </p>
                         </div>
                      </div>
                   ))}
                </div>
             </div>

             <div>
                <div className="flex items-center justify-between mb-6">
                   <h4 className="text-lg font-black text-[#2b0b3d]">Rekomendasi Kursus</h4>
                   <button className="text-xs font-bold text-pink-500 hover:underline">Lihat Semua</button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                   {career.courseRecommendations.map((course, idx) => (
                      <div key={idx} className="bg-white rounded-2xl p-5 border border-white shadow-sm hover:shadow-md transition flex items-center justify-between gap-4 group">
                         <div className="flex items-center gap-4 min-w-0">
                            <div className="h-12 w-12 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500 shrink-0">
                               <BookIcon size={24} />
                            </div>
                            <div className="min-w-0">
                               <h5 className="text-[13px] font-extrabold text-[#2b0b3d] truncate group-hover:text-pink-600 transition-colors">
                                  {course.title}
                               </h5>
                               <p className="text-[11px] text-[#667085] mt-0.5">{course.provider}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-4 shrink-0">
                            <span className="text-[10px] font-bold text-[#667085] hidden sm:block">{course.durationWeeks} minggu</span>
                            <button className="flex items-center gap-1.5 text-[11px] font-black text-pink-500">
                               Mulai <ChevronRight size={14} />
                            </button>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
       )}
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
